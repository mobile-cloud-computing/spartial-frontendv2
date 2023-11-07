import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    const { authState, oktaAuth } = useOktaAuth();

    const handleLogout = async () => {
        await oktaAuth.signOut();
    };

    if (!authState) {
        return <div>Loading...</div>;
    }
    return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container-fluid">
            <span className="navbar-brand">Spatial</span>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                    {!authState.isAuthenticated ? (
                        <Link to="/login" className="btn btn-outline-light">Sign In</Link>) : (
                        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
                    )}
                </ul>
            </div>
        </div>
    </nav>
    );
};

export default NavBar;
