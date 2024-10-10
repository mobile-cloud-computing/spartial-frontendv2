import React, { useState, useEffect } from "react";
import { useRoleContext } from "../../RoleProvider/RoleContext";
import XAINavbar from "./XAINavbar";
import { xaiAPIAllMethods } from "../../../api";
import BarChart from "./BarChart";

// Define types for XAI Results
interface LimeResult {
  xai_method: "lime";
  top_T: string[];
  image_base64: string;
  bar_plot_base64: string;
  pred: [string, string];
  top_labels_names: string[];
  scores: number[];
  segment_overlay_base64: string;
}

interface ShapResult {
  xai_method: "shap";
  shap_V_plot_base64: string;
}

interface OccResult {
  xai_method: "occ";
  Occ_GradCam_base64: string;
  Occ_image_base64: string;
}

type ResultType = LimeResult | ShapResult | OccResult;

// Form data type
interface FormData {
  xai_method: string;
  imagetype: string;
  image: File | null;
  model: File | null;
}

const XAIHomepage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<{
    limeResult?: LimeResult;
    shapResult?: ShapResult;
    occResult?: OccResult;
  } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"lime" | "shap" | "occ">(
    "lime"
  );

  const { setCurrentService } = useRoleContext();

  useEffect(() => {
    setCurrentService("XAI");
  }, [setCurrentService]);

  const [formData, setFormData] = useState<FormData>({
    xai_method: "lime",
    imagetype: "cardboard",
    image: null,
    model: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      model: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAllResults(null);

    try {
      if (formData.image && formData.model) {
        const results = await xaiAPIAllMethods(
          formData.image,
          formData.model,
          formData.imagetype
        );
        setAllResults(results);
      } else {
        setError("Please upload both an image and a model.");
      }
    } catch (error) {
      console.error(error);
      setError("Error processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <XAINavbar />
      {/* <br /> */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm p-4">
              <h4 className="card-title text-center ">
                Explainable AI (XAI) Tool
              </h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="selectimagetype" className="form-label">
                    Class Label:
                  </label>
                  <select
                    id="selectimagetype"
                    name="imagetype"
                    value={formData.imagetype}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="cardboard">Cardboard</option>
                    <option value="glass">Glass</option>
                    <option value="metal">Metal</option>
                    <option value="paper">Paper</option>
                    <option value="plastic">Plastic</option>
                    <option value="trash">Trash</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="selectimage" className="form-label">
                    Upload Image:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="selectmodel" className="form-label">
                    Upload Model:
                  </label>
                  <input
                    type="file"
                    accept=".h5, .onnx, .pb"
                    onChange={handleModelChange}
                    className="form-control"
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Run XAI Analysis"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Selection Menu for XAI Method */}
        <div className="row justify-content-center my-4">
          <div className="col-auto">
            <label htmlFor="method-select" className="form-label">
              Select XAI Method:
            </label>
            <select
              id="method-select"
              value={selectedMethod}
              onChange={(e) =>
                setSelectedMethod(e.target.value as "lime" | "shap" | "occ")
              }
              className="form-select"
            >
              <option value="lime">LIME</option>
              <option value="shap">SHAP</option>
              <option value="occ">Occlusion</option>
            </select>
          </div>
        </div>
        {/* Dynamic Result Rendering */}
        {allResults && (
          <div className="row row-cols-1 ">
            {selectedMethod === "lime" && allResults.limeResult && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-4">
                      LIME Analysis Result
                    </h5>

                    <div className="row mb-4">
                      <p className="card-text ">
                        Predicted Label:{" "}
                        <strong>{allResults.limeResult.pred[0]}</strong>
                        <br />
                        Probability:{" "}
                        <strong>{allResults.limeResult.pred[1]}%</strong>
                      </p>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center "
                      style={{
                        width: "600px",
                        maxWidth: "100%",
                        margin: "auto",
                      }}
                      // style={{ maxWidth: "100%", height: "auto" }}
                    >
                      <BarChart
                        scores={allResults.limeResult.scores}
                        labels={allResults.limeResult.top_labels_names}
                      />
                    </div>
                    <br />

                    <div className="row justify-content-center mb-4">
                      <div className="col-md-6 text-center">
                        <h6 className="card-subtitle mb-3 text-muted">
                          LIME Explanation
                        </h6>
                        <img
                          src={`data:image/png;base64, ${allResults.limeResult.image_base64}`}
                          alt="LIME Explanation"
                          className="img-fluid rounded "
                          style={{
                            width: "300px",
                            height: "300px",
                            maxWidth: "100%",
                          }}
                        />
                      </div>

                      <div className="col-md-6 text-center">
                        <h6 className="card-subtitle mb-3 text-muted">
                          Segment Overlay
                        </h6>
                        <img
                          src={`data:image/png;base64, ${allResults.limeResult.segment_overlay_base64}`}
                          alt="Segment Overlay"
                          className="img-fluid rounded "
                          style={{
                            width: "300px",
                            height: "300px",
                            maxWidth: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "shap" && allResults.shapResult && (
              <div className="col">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-4">
                      SHAP Analysis Result
                    </h5>
                    <img
                      src={`data:image/png;base64, ${allResults.shapResult.shap_V_plot_base64}`}
                      alt="SHAP Plot"
                      className="img-fluid "
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "occ" && allResults.occResult && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-4">
                      Occlusion Sensitivity Analysis
                    </h5>
                    <div className="row">
                      <div className="col-md-6 text-center">
                        <h6 className="card-subtitle mb-3 text-muted">
                          Occlusion Sensitivity Result
                        </h6>
                        <img
                          src={`data:image/png;base64, ${allResults.occResult.Occ_image_base64}`}
                          alt="Occlusion Sensitivity"
                          className="img-fluid rounded"
                          style={{
                            width: "300px",
                            height: "300px",
                            maxWidth: "100%",
                          }}
                        />
                      </div>

                      <div className="col-md-6 text-center">
                        <h6 className="card-subtitle mb-3 text-muted">
                          GradCam Result
                        </h6>
                        <img
                          src={`data:image/png;base64, ${allResults.occResult.Occ_GradCam_base64}`}
                          alt="GradCam"
                          className="img-fluid rounded"
                          style={{
                            width: "300px",
                            height: "300px",
                            maxWidth: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}{" "}
        <br />
      </div>
    </>
  );
};

export default XAIHomepage;
