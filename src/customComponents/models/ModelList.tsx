import React, { useState, useCallback } from 'react';
import { Button, Table, DropdownButton, Dropdown, Card, Pagination } from 'react-bootstrap';
import { useSpatialContext } from "../../context/context";
import { Utility } from "../utility/utility";
import { ModelData, ModelListType } from "../../types/types";

const ModelsTable: React.FC = () => {
    const { allModel } = useSpatialContext();
    const models: ModelListType | null = allModel as ModelListType | null;

    const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);

    const handleRowClick = useCallback((model: ModelData) => {
        setSelectedModel(model);
    }, []);

    const RenderTimestamp = (timestamp: number) => Utility(timestamp);

    return (
        <>
            <h1>All the machine learning models</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Model Id</th>
                    <th>Built At</th>
                    <th>Training Dataset</th>
                    <th>Testing Dataset</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {models?.map((model) => (
                    <tr key={model.modelId} onClick={() => handleRowClick(model)}>
                        <td>{model.modelId}</td>
                        <td>{RenderTimestamp(model.lastBuildAt)}</td>
                        <td>
                            <Button variant="link">View</Button>
                            <Button variant="link">Download</Button>
                        </td>
                        <td>
                            <Button variant="link">View</Button>
                            <Button variant="link">Download</Button>
                        </td>
                        <td>
                            <DropdownButton id="dropdown-item-button" title="Select an action">
                                <Dropdown.Item as="button">Retrain</Dropdown.Item>
                                <Dropdown.Item as="button">Online</Dropdown.Item>
                                <Dropdown.Item as="button">Offline</Dropdown.Item>
                            </DropdownButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {selectedModel && (
                <Card>
                    <Card.Header>Build config for {selectedModel.modelId}:</Card.Header>
                    <Card.Body>
                        <pre>
                            {JSON.stringify(selectedModel.buildConfig, null, 2)}
                        </pre>
                    </Card.Body>
                </Card>
            )}

            <div className="my-3">
                <Button variant="danger">Delete All Models</Button>
            </div>
            <Pagination>
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Next />
            </Pagination>
        </>
    );
};

export default ModelsTable;
