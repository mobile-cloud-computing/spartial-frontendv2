import React from "react";
import { useParams } from "react-router";
import { Container } from "react-bootstrap";
import MedicalDashboard from "./Dashboard/MedicalDashboard";
import NetworkDashboard from "./Dashboard/NetworkDashboard";
import WithSecureDashboard from "./Dashboard/WithSecureDashboard";

const SpatialDashboard: React.FC = () => {
    const { modelId: routeModelId } = useParams();

    const getFirstTwoCharsOfModelId = (params: string): string =>
        params.length >= 2 ? params.substring(0, 2) : "";

    const serviceMapping: { [key: string]: string } = {
        ac: "Network",
        ma: "Medical",
        ws: "WithSecure",
    };

    const serviceType =
        serviceMapping[getFirstTwoCharsOfModelId(routeModelId as string)];

    return (
        <Container className="mt-5">
            <h2>Spatial Dashboard</h2>
            {serviceType === "Medical" && <MedicalDashboard />}
            {serviceType === "Network" && <NetworkDashboard />}
            {serviceType === "WithSecure" && <WithSecureDashboard />}
        </Container>
    );
};

export default SpatialDashboard;
