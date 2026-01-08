import api from '../../services/api';

const supplierService = {
    getAll: () => api.get('suppliers/'),
    getById: (id: string) => api.get(`suppliers/${id}/`),
    create: (data: any) => api.post('suppliers/', data),
    update: (id: string, data: any) => api.put(`suppliers/${id}/`, data),
    delete: (id: string) => api.delete(`suppliers/${id}/`),
};

export default supplierService;
