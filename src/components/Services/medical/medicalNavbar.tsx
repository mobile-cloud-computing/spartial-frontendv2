import React from "react";
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import { Link, To } from "react-router-dom";

const medicalHomepage = "/medicalHomepage";

const MedicalNavbar: React.FC = () => {
  return (
    <>
      <Link to={medicalHomepage} className="nav-link text-lightblue fs-4 mt-4">
        Medical Analysis Service
      </Link>
      <BootstrapNavbar expand="lg" bg="dark" variant="dark">
        {/* <BootstrapNavbar.Brand href="#">Your Brand</BootstrapNavbar.Brand> */}
        <br />
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown
              className="bg-dark"
              title="Emergency Detection"
              id="emergency-dropdown"
            >
              <Link to="/DetectMIEmergencies" className="dropdown-item">
                Detect MI Emergencies
              </Link>
              <Link to="/GenerateExplanations" className="dropdown-item">
                Generate Explanations
              </Link>
              <Link to="/DemoMIEmergency" className="dropdown-item">
                ECG List-Demo
              </Link>
              <Link to="/DemoMIEmergencyData" className="dropdown-item">
                ECG Data-Demo
              </Link>
            </NavDropdown>

            <NavDropdown
              className="bg-dark"
              title="Medical Analysis"
              id="medical-dropdown"
            >
              <Link to="/VisualizeECG" className="dropdown-item">
                Visualize ECG
              </Link>
              <Link to="/IdentifySegments" className="dropdown-item">
                Identify Segments
              </Link>
              <Link to="/TickImportance" className="dropdown-item">
                Tick Importance
              </Link>
              <Link to="/TimeImportance" className="dropdown-item">
                Time Importance
              </Link>
              <Link to="/LeadImportance" className="dropdown-item">
                Lead Importance
              </Link>
            </NavDropdown>

            <NavDropdown
              className="bg-dark"
              title="Model Administration & Application"
              id="model-dropdown"
            >
              <Link to="/ModelSpecific" className="dropdown-item">
                View a Specific Model
              </Link>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>{" "}
    </>
  );
};

export default MedicalNavbar;
