import { InventoryItem } from '../../types/inventory';

export type InventoryCreate = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;
