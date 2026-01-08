import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, DollarSign, Package, Download, ChevronRight, Loader2 } from 'lucide-react';
import reportService, { SalesReport } from '../services/reportService';
import toast from 'react-hot-toast';

const ReportsPage = () => {
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<SalesReport | null>(null);

    const fetchReport = async (selectedPeriod: 'daily' | 'weekly' | 'monthly') => {
        try {
            setLoading(true);
            const response = await reportService.getSalesReport(selectedPeriod);
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(period);
    }, [period]);

    const StatMiniCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: color }}>
            <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: color + '20', color: color }}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{title}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Financial Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Detailed analysis of sales and performance.</p>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${period === p
                                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium text-sm">Generating report...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatMiniCard
                            title="Total Revenue"
                            value={`Rs ${parseFloat(reportData?.summary.total_sales?.toString() || '0').toLocaleString()}`}
                            icon={DollarSign}
                            color="#10b981"
                        />
                        <StatMiniCard
                            title="Items Sold"
                            value={reportData?.summary.total_items || 0}
                            icon={Package}
                            color="#3b82f6"
                        />
                        <StatMiniCard
                            title="Total Orders"
                            value={reportData?.summary.order_count || 0}
                            icon={TrendingUp}
                            color="#8b5cf6"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 card p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    Revenue Over Time
                                </h3>
                                <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                                    Export Data <Download className="h-3 w-3" />
                                </button>
                            </div>

                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {reportData?.chartData.length ? (
                                    reportData.chartData.map((item, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center group">
                                            <div
                                                className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 transition-all rounded-t-lg relative"
                                                style={{ height: `${(item.value / Math.max(...reportData.chartData.map(d => d.value), 1)) * 100}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    Rs {item.value}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-2 font-medium truncate w-full text-center">
                                                {period === 'daily' ? `${item.label}:00` : item.label}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
                                        No sales data found for this period
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                Period Summary
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Average/Sale</span>
                                    <span className="font-bold">
                                        Rs {(reportData?.summary.total_sales && reportData?.summary.order_count)
                                            ? (reportData.summary.total_sales / reportData.summary.order_count).toFixed(2)
                                            : 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Peak Period</span>
                                    <span className="font-bold text-blue-600">
                                        {reportData?.chartData?.reduce((prev, current) => (prev.value > current.value) ? prev : current, { label: 'N/A', value: 0 }).label}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs text-gray-500 leading-relaxed italic">
                                        "Sales have {reportData?.summary.total_sales ? 'seen activity' : 'been quiet'} during this {period} period.
                                        {reportData?.summary.order_count && reportData.summary.order_count > 10 ? ' High volume detected.' : ''}"
                                    </p>
                                </div>
                                <button className="w-full btn-primary flex items-center justify-center gap-2 text-sm">
                                    View Full History <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsPage;
