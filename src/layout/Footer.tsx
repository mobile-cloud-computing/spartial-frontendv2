import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="main-color fixed-bottom">
      <footer className="footer mt-auto py-2 bg-light">
        <span className="text-center text-dark d-block small">
          © {currentYear} Copyright Spatial.
        </span>
      </footer>
    </div>
  );
};
