import React, { useEffect } from 'react';
import { ILIMEParametersState } from '../../types/LimeTypes';
import { processProbsData } from "./XAIUtility";

interface DataUpdaterProps {
    state: ILIMEParametersState;
    updateState: (state: (prevState: any) => any) => void;
    triggerUpdate: boolean;
    selectedModelId?: string;
}

const LimeDataUpdater: React.FC<DataUpdaterProps> = ({ state, updateState, triggerUpdate, selectedModelId }) => {
    const { modelId, sampleId } = state;

    const fetchAndUpdateData = async () => {
        if (!modelId) return;

        try {
            const { dataTableProbs, pieData } = await processProbsData(modelId, sampleId);
            updateState(prevState => ({ ...prevState, pieData, dataTableProbs }));
        } catch (error) {
            console.error("Error fetching and updating data:", error);
        }
    };

    useEffect(() => {
        if (triggerUpdate) {
            fetchAndUpdateData();
        }
    }, [triggerUpdate, selectedModelId]);

    return null;
};

export default LimeDataUpdater;
