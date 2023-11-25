import axios, {AxiosResponse} from "axios";
import { SERVER_URL } from "../constants";
import {
    DatasetType,
    TParamType,
    BuildStatusType,
    MMTStatusInterface
} from "../types/types";


interface Option {
    reports:  string
    isRunning: string
    lastBuildAt: string
    lastBuildId: string
    config: any
}

export interface Ac {
    datasets: string[]
}

async function makeApiRequest<T>(url: string, method: 'get' | 'post' = 'get', payload?: any): Promise<T | null> {
    try {
        const response: AxiosResponse<T> = method === 'post'
            ? await axios.post(url, payload)
            : await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        return null;
    }
}

export const requestAllReports = async () => {
    return makeApiRequest<Option[]>(`${SERVER_URL}/api/reports`);
};
export const requestMMTStatus = async () => {
    return makeApiRequest<MMTStatusInterface>(`${SERVER_URL}/api/mmt`);
};
export const requestBuildADModel = async (
    datasets: DatasetType,
    ratio: number,
    params: TParamType
): Promise<BuildStatusType | null> => {
    const buildConfig = { datasets, "training_ratio": ratio, "training_parameters": params };
    return makeApiRequest<BuildStatusType>(`${SERVER_URL}/api/build`, 'post', { buildConfig });
};

export const requestDatasetAC = async () => {
    return makeApiRequest<Ac>(`${SERVER_URL}/api/ac/datasets`);
};

export const requestBuildStatusAC = async () => {
    const response = await makeApiRequest<any>(`${SERVER_URL}/api/ac/build`);
    return response ? response.buildStatus : null;
};

export const requestBuildACModel = async (modelType: any, dataset: any, featuresList: any, trainingRatio: any) => {
    const buildACConfig = { modelType, dataset, featuresList, trainingRatio };
    return makeApiRequest<any>(`${SERVER_URL}/api/ac/build`, 'post', { buildACConfig });
};



