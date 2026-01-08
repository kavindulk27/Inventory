import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
