import api from '../../services/api';
import { Supplier } from './supplierTypes';

const supplierService = {
    getAll: () => api.get<Supplier[]>('suppliers/'),
    create: (data: any) => api.post<Supplier>('suppliers/', data),
};

export default supplierService;
