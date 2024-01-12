import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { detectMIEmergencies } from "../../../api";

import MedicalNavbar from "./medicalNavbar";

const GenerateExplanations: React.FC = () => {
  const [formData, setFormData] = useState({ dat: "", hea: "" });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make API request
      const response = await detectMIEmergencies(formData.dat, formData.hea);

      console.log("API Response:", response); // Log the response to the console

      // Check if response is defined
      if (response) {
        // Create a data URL directly from the Blob
        const imageUrl = URL.createObjectURL(response);

        // Set the result to the image URL
        setResult(imageUrl);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      // Handle API request error
      console.error("Error in handleSubmit:", error);
      // You might want to set an error state or display an error message to the user
    } finally {
      setLoading(false); // Set loading state to false after the API call completes
    }
  };

  return (
    <>
      <MedicalNavbar />
      <div className="container mt-4">
        <Row>
          {/* Left side with the form */}
          <Col md={6}>
            <div className="border p-3">
              <form onSubmit={handleSubmit}>
                <h2 className="text-gray">
                  Generate default explanation for MI detection emergency use
                  case
                </h2>
                <div className="mb-3">
                  <label htmlFor="textareaDat" className="form-label">
                    dat:
                  </label>
                  <textarea
                    id="textareaDat"
                    name="dat"
                    value={formData.dat}
                    onChange={handleInputChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="textareaHea" className="form-label">
                    hea:
                  </label>
                  <textarea
                    id="textareaHea"
                    name="hea"
                    value={formData.hea}
                    onChange={handleInputChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            </div>
          </Col>

          {/* Right side with the results */}
          <Col md={6}>
            {result && (
              <div className="border p-3">
                <h2>Results:</h2>
                <img src={result} alt="Result Image" className="img-fluid" />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GenerateExplanations;
