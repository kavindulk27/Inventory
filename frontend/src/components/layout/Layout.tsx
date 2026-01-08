import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar - Stays fixed on the left */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Navbar */}
                <Navbar />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
                    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 min-h-[calc(100vh-8rem)] animate-fade-in">
                        <Outlet />
                    </div>

                    <div className="px-6 pb-4">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
