import React from "react";
import "./Dashboard.css"; // Import the custom CSS

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="background-wrapper">
        <img
          decoding="async"
          className="background-image"
          src={`${process.env.PUBLIC_URL}/Banner.jpg`}
          alt="Background"
        />
      </div>
      <div className="container-fluid overlay">
        <div className="row min-vh-100">
          <div className="col-12 col-md-8 text-container">
            <div className="heading-wrapper mb-4">
              <br />
              <img
                decoding="async"
                className="spatial-image mb-4"
                src={`${process.env.PUBLIC_URL}/Spatial_Logo.png`}
                alt="spatial"
                height={120}
              />
              <h1 className="h4" style={{ color: "#009999" }}>
                Achieving trustworthy, transparent and explainable AI
                <br />
                for cybersecurity solutions
              </h1>
              <br />
              <br />
            </div>
            <div className="card-container mb-4">
              <p className="h2">
                <strong>PRIVACY.</strong>
                <br />
                <strong>ACCOUNTABILITY.</strong>
                <br />
                <strong>RESILIENCE.</strong>
              </p>
            </div>
            <div className="card-container">
              <img
                decoding="async"
                className="funded"
                src={`${process.env.PUBLIC_URL}/Funded.png`}
                alt="funded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
