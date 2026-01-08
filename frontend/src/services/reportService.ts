import api from './api';

export interface DashboardStats {
    totalItems: number;
    lowStockItems: number;
    totalSuppliers: number;
    totalInventoryValue: number;
    lowStockItemsList: any[];
}

export interface SalesReport {
    period: string;
    summary: {
        total_sales: number;
        total_items: number;
        order_count: number;
    };
    chartData: Array<{
        label: string;
        value: number;
    }>;
}

const reportService = {
    getDashboardStats: () => api.get<DashboardStats>('/reports/dashboard-stats/'),
    getSalesReport: (period: 'daily' | 'weekly' | 'monthly') =>
        api.get<SalesReport>(`/reports/sales-report/?period=${period}`),
    getStockReport: () => api.get('/reports/stock/'),
    getUsageReport: () => api.get('/reports/usage/'),
};

export default reportService;
