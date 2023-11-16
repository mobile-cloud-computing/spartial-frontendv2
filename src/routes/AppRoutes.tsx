import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginWidget from "../customComponents/auth/LoginWidget";
import { LoginCallback } from "@okta/okta-react";
import ProtectedRoute from "../customComponents/util/ProtectedRoute";
import ProtectedComponent from "../views/ProtectedComponent";
import ModelPage from "../pages/home/ModelPage";
import Dashboard from "../pages/home/Dashboard";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/'
                   element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>}
            />
            <Route path='/models'
                   element={
                        <ProtectedRoute>
                            <ModelPage />
                        </ProtectedRoute>}
            />
            <Route path='/login' element={<LoginWidget/>}/>
            <Route path='/login/callback' element={<LoginCallback/>}/>
            <Route
                path='/protected'
                element={
                    <ProtectedRoute>
                        <ProtectedComponent/>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element="No match"/>
        </Routes>
    );
};

export default AppRoutes;
