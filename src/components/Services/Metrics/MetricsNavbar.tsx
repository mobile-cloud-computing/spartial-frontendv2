import React from "react";
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import { Link, To } from "react-router-dom";

const metricsHomepage = "/Metrics/metricsHomepage";

const MetricsNavbar: React.FC = () => {
  return (
    <>
      {/* <div className="container mt-5"></div> */}
      <Link to={metricsHomepage} className="nav-link text-lightblue fs-4 mt-4">
        Metrics Service
      </Link>
      <BootstrapNavbar expand="lg" bg="dark" variant="dark">
        <br />
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link
              to="/Metrics/metricsHomepage"
              className="text-grey ms-3 mt-3 d-block "
            >
              CLF Accuracy
            </Link>
            <Link
              to="/Metrics/ConsistencyMetric"
              className="text-grey ms-3 mt-3 d-block "
            >
              Consistency
            </Link>
            <Link
              to="/Metrics/CompacityMetric"
              className="text-grey ms-3 mt-3 d-block "
            >
              Compacity
            </Link>
            <Link
              to="/Metrics/EvasionImpact"
              className="text-grey ms-3 mt-3 d-block "
            >
              Evasion Impact
            </Link>
            {/* <Nav.Link href="/Metrics/metricsHomepage">CLF Accuracy</Nav.Link> */}
            {/* <Nav.Link href="/Metrics/ConsistencyMetric">Consistency</Nav.Link>
            <Nav.Link href="/Metrics/CompacityMetric">Compacity</Nav.Link> */}
            {/* <Nav.Link href="/Metrics/EvasionImpact">Evasion Impact</Nav.Link> */}
          </Nav>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>{" "}
    </>
  );
};

export default MetricsNavbar;
