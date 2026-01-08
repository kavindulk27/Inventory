import api from '../../services/api';

const reportService = {
    getStockReport: () => api.get('/reports/stock'),
    getUsageReport: () => api.get('/reports/usage'),
};

export default reportService;
