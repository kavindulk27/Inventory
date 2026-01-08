import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import inventoryService from './inventoryService';
import { InventoryItem } from '../../types/inventory';

interface UpdateStockModalProps {
    item: InventoryItem;
    onClose: () => void;
    onSuccess: () => void;
}

const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ item, onClose, onSuccess }) => {
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newQuantity = item.quantity + quantityToAdd;
            await inventoryService.update(item.id, {
                ...item,
                quantity: newQuantity,
                // Ensure backend naming convention if necessary, 
                // but inventoryService already maps it.
                min_stock_level: item.minStockLevel,
                supplier: item.supplierId
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Failed to update stock. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Replenishing stock for:</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">Current: {item.quantity} {item.unit}</span>
                    <span className="text-gray-500 font-medium text-blue-600">Min: {item.minStockLevel} {item.unit}</span>
                </div>
            </div>

            <Input
                label="Quantity to Add"
                type="number"
                min="1"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
                required
            />

            <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500">New Total Stock:</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {item.quantity + (isNaN(quantityToAdd) ? 0 : quantityToAdd)} {item.unit}
                </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Confirm Update'}
                </Button>
            </div>
        </form>
    );
};

export default UpdateStockModal;
