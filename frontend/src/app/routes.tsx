import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PublicLayout from '../components/layout/PublicLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import InventoryPage from '../pages/InventoryPage';
import SuppliersPage from '../pages/SuppliersPage';
import ReportsPage from '../pages/ReportsPage';
import LowStockPage from '../pages/LowStockPage';
import DailySalesPage from '../pages/DailySalesPage';
import Login from '../pages/LoginPage';
import Register from '../features/auth/Register';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: 'inventory', element: <InventoryPage /> },
                    { path: 'suppliers', element: <SuppliersPage /> },
                    { path: 'sales', element: <DailySalesPage /> },
                    { path: 'reports', element: <ReportsPage /> },
                    { path: 'low-stock', element: <LowStockPage /> },
                ]
            }
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/register',
                element: <Register />,
            },
        ]
    },
]);
