import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link, To } from "react-router-dom";
import NetworkTrafficForm from "./NetworkTrafficForm";
import { ServiceFormProps } from "../../../types/types";
import MedicalServiceUploadForm from "./MedicalServiceUploadForm";
import WithSecureServiceUploadForm from "./WithSecureServiceUploadForm";

const BuildModel = "/build/ac";

const serviceForms: { [key: string]: React.FC<ServiceFormProps> } = {
  "Network Traffic": NetworkTrafficForm,
  Medical: MedicalServiceUploadForm,
  WithSecure: WithSecureServiceUploadForm,
};

const serviceHeadings: {
  [key: string]: { title: string; description: string };
} = {
  "Network Traffic": {
    title: "Build Network Traffic Models",
    description: "Build a new AI model for Network Traffic Service",
  },
  Medical: {
    title: "Upload Medical Model",
    description: "Upload a pre-trained AI model for Medical Service",
  },
  WithSecure: {
    title: "Upload AI Model",
    description: "Upload a pre-trained AI model for WithSecure Service",
  },
};

const BuildModelForms: React.FC = () => {
  const [serviceType, setServiceType] = useState("Network Traffic");

  const handleServiceTypeChange = (newServiceType: string) => {
    setServiceType(newServiceType);
  };

  const SelectedServiceForm = serviceForms[serviceType];
  const { title, description } = serviceHeadings[serviceType];

  return (
    <Container className="container mt-5">
      <Row className="contentContainer ">
        {" "}
        {/*justify-content-center */}
        <Col md={10} lg={8}>
          <Link to={BuildModel} className="nav-link text-lightblue fs-4">
            {title}
          </Link>
          {/* <h2>{title}</h2> */}
          <p>{description}</p>
          <Form.Group as={Row} className="mb-3">
            <InputGroup>
              <InputGroup.Text>Service Type:</InputGroup.Text>

              <Form.Select
                name="serviceType"
                value={serviceType}
                onChange={(e) => handleServiceTypeChange(e.target.value)}
              >
                <option value="Network Traffic">Network Traffic</option>
                <option value="Medical">Medical</option>
                <option value="WithSecure">WithSecure</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <SelectedServiceForm
            serviceType={serviceType}
            onServiceTypeChange={handleServiceTypeChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default BuildModelForms;
