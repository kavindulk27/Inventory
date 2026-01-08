import api from './api';

export interface DashboardStats {
    totalItems: number;
    lowStockItems: number;
    totalSuppliers: number;
    totalInventoryValue: number;
    lowStockItemsList?: any[];
}

const reportService = {
    getDashboardStats: () => api.get<DashboardStats>('reports/dashboard-stats/'),
};

export default reportService;
