import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginWidget from "../components/auth/LoginWidget";
import {LoginCallback} from "@okta/okta-react";
import ProtectedRoute from "../components/util/ProtectedRoute";
import ProtectedComponent from "../views/ProtectedComponent";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Navigate replace to="/protected"/>}/>
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
        </>
    );
};

export default AppRoutes;
