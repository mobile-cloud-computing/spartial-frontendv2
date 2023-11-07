import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="main-color py-3">

            <footer className="footer mt-auto py-3 bg-dark">
                <div className="container">
                <span className="text-center text-white text-center d-block">
                    © {currentYear} Copyright Spatial.
                </span>
                </div>
            </footer>
        </div>
    );
};


