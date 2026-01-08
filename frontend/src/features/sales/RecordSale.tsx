import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import salesService from './salesService';
import { InventoryItem } from '../../types/inventory';

interface RecordSaleProps {
    item?: InventoryItem;
    inventoryItems?: InventoryItem[];
    onClose: () => void;
    onSuccess: () => void;
}

const RecordSale: React.FC<RecordSaleProps> = ({ item: initialItem, inventoryItems = [], onClose, onSuccess }) => {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(initialItem || null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialItem) {
            setSelectedItem(initialItem);
        }
    }, [initialItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        try {
            setLoading(true);
            const totalPrice = quantity * selectedItem.price;
            await salesService.create({
                inventory_item: selectedItem.id,
                quantity: quantity,
                total_price: totalPrice
            });
            toast.success('Sale recorded successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to record sale:', error);
            toast.error('Failed to record sale. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!initialItem && (
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Item</label>
                    <select
                        className="input-field w-full"
                        value={selectedItem?.id || ''}
                        onChange={(e) => {
                            const item = inventoryItems.find(i => i.id === e.target.value);
                            setSelectedItem(item || null);
                        }}
                        required
                    >
                        <option value="">Choose an item...</option>
                        {inventoryItems.map(i => (
                            <option key={i.id} value={i.id}>{i.name} ({i.quantity} in stock)</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedItem && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recording sale for:</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedItem.name}</p>
                    <div className="flex justify-between mt-2 text-xs">
                        <span className="text-gray-500">Current Stock: {selectedItem.quantity} {selectedItem.unit}</span>
                        <span className="text-gray-500">Price: Rs {selectedItem.price.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {selectedItem && (
                <>
                    <Input
                        label="Quantity Sold"
                        type="number"
                        min="1"
                        max={selectedItem.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        required
                    />

                    <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-gray-500">Total Price:</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Rs {(quantity * selectedItem.price).toFixed(2)}
                        </span>
                    </div>
                </>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading || !selectedItem || quantity > selectedItem.quantity}>
                    {loading ? 'Recording...' : 'Confirm Sale'}
                </Button>
            </div>
        </form>
    );
};

export default RecordSale;
