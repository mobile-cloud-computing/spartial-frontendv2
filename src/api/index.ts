import axios, {AxiosResponse} from "axios";
import {LOCAL_URL, SERVER_URL} from "../constants";
import {
    DatasetType,
    TParamType,
    BuildStatusType,
    MMTStatusInterface
} from "../types/types";
import {getLabelsListXAI} from "../customComponents/util/utility";

interface Option {
    reports: string
    isRunning: string
    lastBuildAt: string
    lastBuildId: string
    config: any
}

interface FormState {
    clientSamplingRate: number;
    clippingValue: number;
    delta: number;
    epsilon: number;
    modelParameters: number[][][];
    // modelParameters2: number;
    noiseType: number;
    sigma: number;
    totalFLRounds: number;
}

export interface Ac {
    datasets: string[]
}

interface MedicalModel {
    modelId: string;
    lastBuildAt: string;
    buildConfig: {
        uploadFileName: string;
      description: string;
      category: string;
      dataStructure: string;
      dataFormat: string;
      preprocessing: string;
    };
  }
  
  const transformMedicalModel = (model: any): MedicalModel => {
    return {
      modelId: `ma-${model._id}`,
      lastBuildAt: model.created_at,   
      buildConfig: {
        uploadFileName: model.upload_file_name,
        description: model.description,
        category: model.category,
        dataStructure: model.data_structure,
        dataFormat: model.data_format,
        preprocessing: model.preprocessing,
      },
    };
  };


async function makeApiRequest<T>(
    url: string,
    method: 'get' | 'post' | 'put' = 'get',
    payload?: any,
    responseType: 'json' | 'blob' = 'json'
): Promise<T | null> {
    try {
        let response: AxiosResponse<T>;
        switch (method) {
            case 'post':
                response = await axios.post<T>(url, payload, {responseType});
                break;
            case 'put':
                response = await axios.put<T>(url, payload, {responseType});
                break;
            default:
                response = await axios.get<T>(url, {params: payload, responseType});
        }
        return response.data;
    } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        return null;
    }
}

export const requestAllReports = async () => {
    return makeApiRequest<Option[]>(`${LOCAL_URL}/api/reports`);
};
export const requestMMTStatus = async () => {
    return makeApiRequest<MMTStatusInterface>(`${LOCAL_URL}/api/mmt`);
};
export const requestXAIStatus = async () => {
    return makeApiRequest<any>(`${LOCAL_URL}/api/xai`);
}
export const requestBuildADModel = async (
    datasets: DatasetType,
    ratio: number,
    params: TParamType
): Promise<BuildStatusType | null> => {
    const buildConfig = {datasets, "training_ratio": ratio, "training_parameters": params};
    return makeApiRequest<BuildStatusType>(`${LOCAL_URL}/api/build`, 'post', {buildConfig});
};

export const requestDatasetAC = async () => {
    return makeApiRequest<Ac>(`${LOCAL_URL}/api/ac/datasets`);
};

export const requestBuildStatusAC = async () => {
    const response = await makeApiRequest<any>(`${LOCAL_URL}/api/ac/build`);
    return response ? response.buildStatus : null;
};

export const requestBuildACModel = async (modelType: any, dataset: any, featuresList: any, trainingRatio: any) => {
    const buildACConfig = {modelType, dataset, featuresList, trainingRatio};
    return makeApiRequest<any>(`${LOCAL_URL}/api/ac/build`, 'post', {buildACConfig});
};

export const requestAllModels = async () => {
    const response = await makeApiRequest<any>(`${LOCAL_URL}/api/models`);
    return response ? response.models : null;
}

export const requestModel = async (modelId: string) => {
    return await makeApiRequest<any>(`${LOCAL_URL}/api/models/${modelId}`);
}
export const requestDownloadModel = async (modelId: string) => {

    try {
        const response = await makeApiRequest<Blob>(`${LOCAL_URL}/api/models/${modelId}/download`, 'get', null, 'blob');
        BlobDownload(response, modelId, null)

    } catch (error) {
        console.error('Error downloading the model:', error);
    }
};

export const requestUpdateModel = async (modelId: string, newModelId: string) => {
    const newId = {newModelId: newModelId};
    console.log(newId)
}

export const requestDownloadDatasets = async (modelId: string, datasetType: string) => {
    if (!modelId) {
        console.error('Model ID is required');
        return;
    }

    try {
        const response = await makeApiRequest<Blob>(`${LOCAL_URL}/api/models/${modelId}/datasets/${datasetType}/download`, 'get', null, 'blob');
        BlobDownload(response, modelId, datasetType)
    } catch (error) {
        console.error('Error downloading the model:', error);
    }
}

const BlobDownload = (response: Blob | null, modelId: any, datasetType: any) => {

    if (!response) {
        console.error('Failed to download model due to empty response');
        return;
    }
    const blob = response instanceof Blob ? response : new Blob([response]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    if (datasetType) {
        const datasetFileName = `${modelId}_${datasetType.charAt(0).toUpperCase() + datasetType.slice(1)}_samples.csv`;
        link.download = datasetFileName;

    } else {
        link.download = `${modelId}.bin`;
    }

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

}

export const requestViewModelDatasets = async (modelId: string, datasetType: string) => {
    return await makeApiRequest<any>(`${LOCAL_URL}/api/models/${modelId}/datasets/${datasetType}/view`, 'get', null);
}
export const requestLimeValues = async (modelId: string, labelId: number) => {
    const labelsList = getLabelsListXAI(modelId);
    console.log(`Get LIME values of the model ${modelId} for the label ${labelsList[labelId]} from server`);
    return await makeApiRequest<any>(`${LOCAL_URL}/api/xai/lime/explanations/${modelId}/${labelId}`)
}

export const requestPredictionsModel = async (modelId: string) => {
    const response = await makeApiRequest<any>(`${LOCAL_URL}/api/models/${modelId}/predictions`);
    return response.predictions
}

export const requestRunLime = async (modelId: string, sampleId: number | string[], numberFeature: number) => {
    const limeConfig = {
        "modelId": modelId,
        "sampleId": sampleId,
        "numberFeature": numberFeature,
    };

    return await makeApiRequest<any>(`${LOCAL_URL}/api/xai/lime`, 'post', {limeConfig});
}

export const requestPredictedProbsModel = async (modelId: string) => {
    const response = await makeApiRequest<any>(`${LOCAL_URL}/api/models/${modelId}/probabilities`);
    return response.probs
}
export const requestBuildConfigModel = async (modelId: string) => {
    const response = await makeApiRequest<any>(`${LOCAL_URL}/api/models/${modelId}/build-config`);
    return response.buildConfig
}

export const enhancedInterpretability = async (file: FormData) => {
    return await makeApiRequest<any>(`/enhanced/interpretability/explain`, 'post', file, 'blob');
}

export const fairnessAPI = async (file: FormData) => {
    return await makeApiRequest<any>(`/explain_fairness/file`, 'post', file, 'blob');
}

export const differentialPrivacy = async (formData: FormState) => {
    return await makeApiRequest<any>(`/api/v3/differential_privacy/execute`, 'post', formData);
}

//medical 

export const MIEmergencyModels = async (modelFile: File) => {
    try {
      const formData = new FormData();
      formData.append('model_file', modelFile);
  
      const response = await makeApiRequest<any>(
        '/model/',
        'post',
        formData,
        'json'
      );
  
      return response;
    } catch (error) {
      // Handle errors as needed
      console.error('Error in MIEmergencyModels:', error);
      throw error;
    }
  };

// export const requestMedicalModel = async () => {
//     return await makeApiRequest<any>(`/model/`);
// }
export const requestMedicalModels = async (): Promise<MedicalModel[]> => {
    const response = await makeApiRequest<any[]>(`/model/?limit=10000`);
    if (!response) {
      throw new Error('Failed to fetch medical models');
    }
    return response.map(transformMedicalModel);
  };
  

export const demoMIEmergency = async (limit: number) => {
    return await makeApiRequest<any>(`/emergency_detection/mi_detection/emergency_data?limit=${limit}`);
}

export const demoMIEmergencyData = async (data_id: string) => {
    return await makeApiRequest<any>(`/emergency_detection/mi_detection/emergency_data/${data_id}`);
}

export const predictMIEmergencies = async (dat: string, hea: string, store_data: string) => {
    try {
        let apiUrl = '/emergency_detection/mi_detection/predict';

        const requestBody = {
            dat: dat,
            hea: hea,
        };

        if (store_data !== '--') {
            apiUrl += `?store_data=${store_data}`;
        }

        const response = await makeApiRequest<any>(apiUrl, 'post', requestBody, 'json');

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in predictMIEmergencies:', error);
        throw error;
    }
}


export const detectMIEmergencies = async (dat: string, hea: string) => {
    try {
        const requestBody = {
            dat: dat,
            hea: hea
        };

        const response = await makeApiRequest<any>(
            `/emergency_detection/mi_detection/explain`,
            'post',
            requestBody,
            'blob'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in detectMIEmergencies:', error);
        throw error;
    }
}
// export const descriptionECGSignal = async (user_role: string, with_segments: string) => {
//     return await makeApiRequest<any>(`/user_support/descriptions/ecg?user_role=${user_role}&with_segments=${with_segments}`);
// }

export const descriptionECGSignal = async (user_role: string, with_segments: string) => {
    const url = `/user_support/descriptions/ecg?user_role=${user_role}&with_segments=${with_segments}`;
    return await makeApiRequest<any>(url);
}

export const descriptionTickImportance = async (xai_visualization_approach: string, user_role: string) => {
    const url = `/user_support/descriptions/xai_visualization_approaches/tickImportance?user_role=${user_role}`;
    return await makeApiRequest<any>(url);
}

export const descriptionTimeImportance = async (xai_visualization_approach: string, user_role: string) => {
    const url = `/user_support/descriptions/xai_visualization_approaches/timeSegmentImportance?user_role=${user_role}`;
    return await makeApiRequest<any>(url);
}

export const descriptionLeadImportance = async (xai_visualization_approach: string, user_role: string) => {
    const url = `/user_support/descriptions/xai_visualization_approaches/channelImportance?user_role=${user_role}`;
    return await makeApiRequest<any>(url);
}


export const descriptionECGClassification = async (user_role: string) => {
    const url = `/user_support/descriptions/classification_prediction?user_role=${user_role}`;
    return await makeApiRequest<any>(url);
}

export const MI_ModelPrediction= async (dat: string, hea: string, model_id: string) => {
    try {
        const url = `/model/${model_id}/predict`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'json');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in MI_ModelPrediction:', error);
        throw error;
    }
}
export const MI_ModelEvaluate = async ( model_id: string,dataset: string) => {
    const url = `/model/${model_id}/evaluate?dataset=${dataset}`;
    return await makeApiRequest<any>(url);
}

//Tick Importance
export const LRP_TICK_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/LRP/tick_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in LRP_TICK_Visualize:', error);
        throw error;
    }
}

export const GradientSHAP_TICK_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/GradientSHAP/tick_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in GradientSHAP_TICK_Visualize:', error);
        throw error;
    }
}

export const DeepSHAP_TICK_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/DeepSHAP/tick_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in DeepSHAP_TICK_Visualize:', error);
        throw error;
    }
}

//Time Importance
export const LRP_TIME_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
     
        const url = `/medical_analysis/ecg_analysis/explain/LRP/time_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in LRP_TIME_Visualize:', error);
        throw error;
    }
}

export const GradientSHAP_TIME_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/GradientSHAP/time_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in GradientSHAP_TIME_Visualize:', error);
        throw error;
    }
}

export const DeepSHAP_TIME_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/DeepSHAP/time_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in DeepSHAP_TIME_Visualize:', error);
        throw error;
    }
}


//Lead Importance
export const LRP_LEAD_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/LRP/lead_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in LRP_LEAD_Visualize:', error);
        throw error;
    }
}

export const GradientSHAP_LEAD_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/GradientSHAP/lead_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in GradientSHAP_LEAD_Visualize:', error);
        throw error;
    }
}

export const DeepSHAP_LEAD_Visualize = async (dat: string, hea: string, model_id: string, ignore_cached_relevances: string) => {
    try {
        const url = `/medical_analysis/ecg_analysis/explain/DeepSHAP/lead_importance?model_id=${model_id}&ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in DeepSHAP_LEAD_Visualize:', error);
        throw error;
    }
}


export const visualizeECG = async (dat: string, hea: string, cut_classification_window: string) => {
    try {

        let apiUrl = '/medical_analysis/ecg_analysis/visualize_ecg';

        const requestBody = {
            dat: dat,
            hea: hea,
        };

        if (cut_classification_window !== '--') {
            apiUrl += `?cut_classification_window=${cut_classification_window}`;
        }

        const response = await makeApiRequest<any>(apiUrl, 'post', requestBody, 'blob');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in visualizeECG:', error);
        throw error;
    }
}


export const MIModelExplanation = async (dat: string, hea: string, model_id: string,xai_method:string, ignore_cached_relevances: string) => {
    try {
        const url = `/model/${model_id}/explain/${xai_method}?ignore_cached_relevances=${ignore_cached_relevances}`;

        const requestBody = {
            dat: dat,
            hea: hea,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'json');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in MIModelExplanation:', error);
        throw error;
    }
}

export const identifySegments = async (dat: string, hea: string) => {
    try {
        const requestBody = {
            dat: dat,
            hea: hea
        };

        const response = await makeApiRequest<any>(
            `/medical_analysis/ecg_analysis/identify_segments`,
            'post',
            requestBody,
            'blob'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in identifySegments:', error);
        throw error;
    }
}

export const tickImportance = async (dat: string, hea: string, xai_method: string, model_id: string) => {
    try {
        const requestBody = {
            dat: dat,
            hea: hea
        };

        const response = await makeApiRequest<any>(
            `medical_analysis/ecg_analysis/explain/${xai_method}/tick_importance?model_id=${model_id}`,
            'post',
            requestBody,
            'blob'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in tickImportance:', error);
        throw error;
    }
}

export const timeImportance = async (dat: string, hea: string, xai_method: string, model_id: string) => {
    try {
        const requestBody = {
            dat: dat,
            hea: hea
        };

        const response = await makeApiRequest<any>(
            `/medical_analysis/ecg_analysis/explain/${xai_method}/time_importance?model_id=${model_id}`,
            'post',
            requestBody,
            'blob'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in timeImportance:', error);
        throw error;
    }
}


export const leadImportance = async (dat: string, hea: string, xai_method: string, model_id: string) => {
    try {
        const requestBody = {
            dat: dat,
            hea: hea
        };

        const response = await makeApiRequest<any>(
            `/medical_analysis/ecg_analysis/explain/${xai_method}/lead_importance?model_id=${model_id}`,
            'post',
            requestBody,
            'blob'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in leadImportance:', error);
        throw error;
    }
}

export const getSpecificModel = async (model_id: string) => {
    return await makeApiRequest<any>(`/model/${model_id}`);
}

//Llama Service

export const Llama_Service = async (user: string, content: string) => {
    try {
        const url = `/llama/change-text`;

        const requestBody = {
            user: user,
            content: content,
        };


        const response = await makeApiRequest<any>(url, 'post', requestBody, 'json');

        return response;

    } catch (error) {
        // Handle errors as needed
        console.error('Error in Llama_Service:', error);
        throw error;
    }
}



// Metrics component

export const clf_accuracy_metric = async (ground_truth: number[], predictions: number[]) => {
    try {
        const requestBody = {
            ground_truth: ground_truth,
            predictions: predictions
        };

        const response = await makeApiRequest<any>(
            `/clf_accuracy_metric`,
            'post',
            requestBody,
            'json'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in clf_accuracy_metric:', error);
        throw error;
    }
}

export const evasion_impact_metric = async (ground_truth: number[], predictions: number[]) => {
    try {
        const requestBody = {
            ground_truth: ground_truth,
            predictions: predictions
        };

        const response = await makeApiRequest<any>(
            `/evasion_impact_metric`,
            'post',
            requestBody,
            'json'
        );

        return response;
    } catch (error) {
        // Handle errors as needed
        console.error('Error in evasion_impact_metric:', error);
        throw error;
    }
}
interface ContributionDict {
    KernelSHAP: number[][];
    LIME: number[][];
    SamplingSHAP: number[][];
  }

  export const consistencyMetricAPI = async (data: { contribution_dict: ContributionDict }): Promise<any> => {
    try {
      const response = await makeApiRequest<any>(
        '/consistency_metric',
        'post',
        data, // Pass the entire data object directly
        'json'
      );
      console.log('API Response in consistencyMetricAPI:', response);
      return response;
    } catch (error) {
      console.error('Error in consistencyMetricAPI:', error);
      throw error;
    }
  };
  
  export const consistencyMetricAPIPlot = async (data: { contribution_dict: ContributionDict }): Promise<any> => {
    try {
      const response = await makeApiRequest<any>(
        '/consistency_metric_plot',
        'post',
        data, // Pass the entire data object directly
        'blob'
      );
      console.log('API Response in consistencyMetricAPIPlot:', response);
      return response;
    } catch (error) {
      console.error('Error in consistencyMetricAPIPlot:', error);
      throw error;
    }
  };

//   interface CompacityDict {
//     contributions: number[][];
//     selection: number[];
//     distance: number;
//     nb_features: number;
//   }


  export const compacityMetricAPI = async (data: { contributions: number[][]; selection: number[]; distance: number; nb_features: number; }): Promise<any> => {
    try {
    
      const response = await makeApiRequest<any>(
        '/compacity_metric',
        'post',
        data,
        'json'
      );
      console.log('API Response in CompacityMetricAPI:', response);
      return response;
    } catch (error) {
      console.error('Error in CompacityMetricAPI:', error);
      throw error;
    }
  };
  
  export const compacityMetricAPIPlot = async (data: { contributions: number[][]; selection: number[]; distance: number; nb_features: number; }): Promise<any> => {
    try {
      const response = await makeApiRequest<any>(
        '/compacity_metric_plot',
        'post',
        data, // Pass the entire data object directly
        'blob'
      );
      console.log('API Response in CompacityMetricAPIPlot:', response);
      return response;
    } catch (error) {
      console.error('Error in CompacityMetricAPIPlot:', error);
      throw error;
    }
  };


export const xaiAPI = async (xai_method: string, image: File, mlModel: File, imagetype:  string) => {
    try {

        const requestBody = new FormData();
        requestBody.append('file', image);
        requestBody.append('mlModel', mlModel);

        const imageFileBytes = await readFileAsBlob(image);
        requestBody.append('ImageFileBytes', imageFileBytes, 'image.bin');

        // const imageFileBytes = await readFileAsBase64(file);
        // requestBody.append('ImageFileBytes', imageFileBytes);

        
        for (const entry of requestBody.entries()) {
            console.log(entry[0], entry[1]);
        }

        if (xai_method == 'lime') {
            const response = await makeApiRequest<any>(
                `/explain_lime/image?imagetype=${imagetype}`, 
                'post',
                requestBody,
                'json'
            );
            return response;
        } else if (xai_method == 'shap') {
            const response = await makeApiRequest<any>(
                `/explain_shap/image?imagetype=${imagetype}`,
                'post',
                requestBody,
                'json'
            );
            return response;
        } else if (xai_method == 'occ')  {
            const response = await makeApiRequest<any>(
                `/explain_occlusion/image?imagetype=${imagetype}`,
                'post',
                requestBody,
                'json'
            );
            return response;
        }


    } catch (error) {
        // Handle errors as needed
        console.error('Error in xaiAPI:', error);
        throw error;
    }


}


const readFileAsBlob = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const blob = new Blob([new Uint8Array(reader.result as ArrayBuffer)], { type: 'application/octet-stream' });
          resolve(blob);
        } else {
          reject(new Error('Failed to read file content.'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };