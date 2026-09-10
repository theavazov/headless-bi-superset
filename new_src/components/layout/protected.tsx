import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem('superset_access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};