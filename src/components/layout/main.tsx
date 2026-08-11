import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';

export const MainLayout: React.FC = () => {

    return (
        <div className="wrapper">
            <main className="main"><Outlet /></main>
            <Footer />
        </div>
    );
};