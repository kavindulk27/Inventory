import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import reportService, { DashboardStats } from '../services/reportService';
import Loader from '../components/common/Loader';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: color.replace('bg-', '').replace('-500', '-600') }}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color.replace('500', '50')} ${color.replace('bg-', 'text-')}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await reportService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="mt-2 text-blue-100 max-w-xl text-lg">
                        Welcome back. Here's what's happening today. You have {stats?.lowStockItems} low stock items requiring attention.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Items" value={stats?.totalItems?.toLocaleString() || '0'} icon={Package} color="bg-blue-500" trend="+12%" />
                <StatCard title="Low Stock Items" value={stats?.lowStockItems?.toString() || '0'} icon={AlertTriangle} color="bg-red-500" trend="-5%" />
                <StatCard title="Total Suppliers" value={stats?.totalSuppliers?.toString() || '0'} icon={TrendingUp} color="bg-purple-500" trend="+3%" />
                <StatCard title="Total Value" value={`Rs ${parseFloat(stats?.totalInventoryValue?.toString() || '0').toLocaleString()}`} icon={DollarSign} color="bg-green-500" trend="+8%" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">System Initialized</p>
                                <p className="text-xs text-gray-500">Real-time data connected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
