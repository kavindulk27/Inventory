import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import inventoryService from './inventoryService';
import supplierService from '@/features/suppliers/supplierService';

// Service for handling supplier data

interface AddItemProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const AddItem: React.FC<AddItemProps> = ({ onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: 0,
        unit: 'kg',
        min_stock_level: 0,
        price: 0,
        supplier: '',
        category: 'general'
    });
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await supplierService.getAll();
                setSuppliers(response.data);
            } catch (error) {
                console.error('Failed to fetch suppliers:', error);
            }
        };
        fetchSuppliers();

        if (initialData) {
            setFormData({
                name: initialData.name || '',
                sku: initialData.sku || '',
                quantity: initialData.quantity || 0,
                unit: initialData.unit || 'kg',
                min_stock_level: initialData.minStockLevel || 0,
                price: parseFloat(initialData.price.toString()) || 0,
                supplier: initialData.supplierId || '',
                category: initialData.category || 'general'
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'min_stock_level' || name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (initialData?.id) {
                await inventoryService.update(initialData.id, formData);
                toast.success('Item updated successfully!');
            } else {
                await inventoryService.create(formData);
                toast.success('Item added successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save item:', error);
            toast.error('Failed to save item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tomatoes"
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU-123"
                    required
                />
                <Input
                    label="Unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="kg, liters, etc."
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Min Stock Level"
                    name="min_stock_level"
                    type="number"
                    value={formData.min_stock_level}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Price per Unit"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    required
                >
                    <option value="general">General</option>
                    <option value="food">Food</option>
                    <option value="beverage">Beverage</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : initialData?.id ? 'Update Item' : 'Add Item'}
                </Button>
            </div>
        </form>
    );
};

export default AddItem;
