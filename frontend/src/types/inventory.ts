import { BaseEntity } from './common';

export interface InventoryItem extends BaseEntity {
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    minStockLevel: number;
    supplierId: string;
    price: number;
    category: 'food' | 'beverage' | 'general';
}
