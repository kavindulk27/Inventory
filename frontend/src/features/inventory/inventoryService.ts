import api from '../../services/api';
import { InventoryItem } from '../../types/inventory';

const inventoryService = {
    getAll: () => api.get<InventoryItem[]>('inventory/'),
    getById: (id: string) => api.get<InventoryItem>(`inventory/${id}/`),
    create: (item: any) => api.post<InventoryItem>('inventory/', item),
    update: (id: string, item: any) => api.put<InventoryItem>(`inventory/${id}/`, item),
    delete: (id: string) => api.delete(`inventory/${id}/`),
};

export default inventoryService;
