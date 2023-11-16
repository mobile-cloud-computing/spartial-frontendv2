import axios from "axios";
import { SERVER_URL } from "../constants";
import {BuildStatusInterface, MMTStatusInterface} from "../context/context";


interface Option {

    reports:  string
    isRunning: string
    lastBuildAt: string
    lastBuildId: string
    config: any

}
export const requestAllReports = async () => {
    const url = `${SERVER_URL}/api/reports`;
    try {

        const response = await axios.get<Option[]>(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
};

export const requestMMTStatus = async () => {
    const url = `${SERVER_URL}/api/mmt`;
    try {
        const response = await axios.get<MMTStatusInterface>(url)
        return response.data;
    }
    catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
};

export const requestBuildModel = async (datasets: any, ratio: any, params: any) => {
    const url = `${SERVER_URL}/api/build`;
    const buildConfig = {
        "datasets": datasets,
        "training_ratio": ratio,
        "training_parameters": params,
    };

    try {
        const response = await axios.post<Option>(url, {buildConfig});
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const requestBuildStatusAC = async () => {
    const url = `${SERVER_URL}/api/ac/build`;

    try {
        const response = await axios.get<BuildStatusInterface>(url)

        if (Array.isArray(response) ?? response == null ) {
            // Handle the array case (never[] should technically never happen)
            console.error("Unexpected type: never[]");
            return;
        }

        return response.data.buildStatus

    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
};

