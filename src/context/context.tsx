import { requestAllReports, requestBuildStatusAC, requestMMTStatus } from "../api";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface OptionInterface {
    reports: string;
}

const initialBuildStatus: BuildStatusInterface | null = null;

export interface MMTStatusInterface {
    isRunning: boolean;
}

export interface BuildStatusInterface {
    isRunning: boolean | null;
    lastBuildAt: string | null;
    buildStatus: any
}

interface SpatialContextType {
    reportState: OptionInterface[];
    setReportState: React.Dispatch<React.SetStateAction<OptionInterface[]>>;
    MMTStatusState: MMTStatusInterface | null;
    setMMTStatusState: React.Dispatch<React.SetStateAction<MMTStatusInterface | null>>;
    buildStatusState: BuildStatusInterface | null;
    setBuildStatusState: React.Dispatch<React.SetStateAction<BuildStatusInterface | null>>;
}
const SpatialContext = createContext<SpatialContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [reportState, setReportState] = useState<OptionInterface[]>([]);
    const [MMTStatusState, setMMTStatusState] = useState<MMTStatusInterface | null>(null);
    const [buildStatusState, setBuildStatusState] = useState<BuildStatusInterface | null>(initialBuildStatus);


    useEffect(() => {
        const loadData = async () => {

            try {
                const dataSetOptionsResponse = await requestAllReports() ;
                const MMTStatusResponse = await requestMMTStatus() as MMTStatusInterface;

                setReportState(dataSetOptionsResponse);
                const buildStatusResponse = await requestBuildStatusAC() as BuildStatusInterface;

                setMMTStatusState(MMTStatusResponse);
                if (buildStatusResponse ) {
                    setBuildStatusState(buildStatusResponse);
                } else {
                    setBuildStatusState(null);
                }
            } catch (error) {
                setBuildStatusState(null);
            }
        };
        loadData();
    }, []);

    return (
        <SpatialContext.Provider value={{ reportState, setReportState, MMTStatusState, setMMTStatusState, buildStatusState, setBuildStatusState }}>
            {children}
        </SpatialContext.Provider>
    );
};

export const useSpatialContext = (): SpatialContextType => {
    const context = useContext(SpatialContext);
    if (!context) {
        throw new Error('useSpatialContext must be used within a Provider');
    }
    return context;
};
