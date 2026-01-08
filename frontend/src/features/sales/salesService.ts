import api from '../../services/api';
import { InventoryItem } from '../../types/inventory';

export interface Sale {
    id: number;
    inventory_item: string;
    item_details?: InventoryItem;
    quantity: number;
    total_price: number;
    category: string;
    date_sold: string;
}

export interface DailySummary {
    food: number;
    beverage: number;
    total_revenue: number;
}

const salesService = {
    getAll: () => api.get<Sale[]>('sales/'),
    create: (data: any) => api.post<Sale>('sales/', data),
    getDailySummary: () => api.get<DailySummary>('sales/daily_summary/'),
};

export default salesService;
