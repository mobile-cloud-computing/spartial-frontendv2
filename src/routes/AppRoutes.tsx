import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginWidget from "../customComponents/auth/LoginWidget";
import { LoginCallback } from "@okta/okta-react";
import ProtectedRoute from "../customComponents/util/ProtectedRoute";
import ProtectedComponent from "../views/ProtectedComponent";
import ModelPage from "../pages/home/ModelPage";
import Dashboard from "../pages/home/Dashboard";
import BuildACModelForm from "../customComponents/models/BuilldACModelForms";
import NoMatchComponent from "../customComponents/NoMatchComponent";

const routeConfig = [
    { path: '/', element: <Dashboard /> },
    { path: '/build/ad', element: <ModelPage /> },
    { path: '/build/ac', element: <BuildACModelForm /> },
    { path: '/login', element: <LoginWidget />, isProtected: false },
    { path: '/login/callback', element: <LoginCallback />, isProtected: false },
    { path: '/protected', element: <ProtectedComponent /> },
    { path: '*', element: <NoMatchComponent />, isProtected: false } // No match route
];

const AppRoutes = () => {
    return (
        <Routes>
            {routeConfig.map(({ path, element, isProtected = true }) => (
                <Route
                    key={path}
                    path={path}
                    element={isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
                />
            ))}
        </Routes>
    );
};

export default AppRoutes;
