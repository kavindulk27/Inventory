import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Search, Filter, Plus, MoreVertical, Edit2, Trash2, ArrowUpDown,
    ChevronLeft, ChevronRight, Package, AlertCircle, Tag
} from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import Loader from '../components/common/Loader';
import inventoryService from '../features/inventory/inventoryService';
import Modal from '../components/common/Modal';
import AddItem from '../features/inventory/AddItem';
import RecordSale from '../features/sales/RecordSale';

const InventoryPage = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [selectedItemForSale, setSelectedItemForSale] = useState<InventoryItem | null>(null);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await inventoryService.getAll();
            const mappedItems = response.data.map((item: any) => ({
                ...item,
                id: item.id.toString(),
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 0,
                minStockLevel: parseInt(item.min_stock_level) || 0,
                supplierId: item.supplier ? item.supplier.toString() : '',
                category: item.category || 'general'
            }));
            setItems(mappedItems);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: string) => {
        const item = items.find(item => item.id === id);
        if (item) {
            setEditingItem(item);
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await inventoryService.delete(id);
                toast.success('Item deleted successfully!');
                fetchInventory();
            } catch (error) {
                console.error('Failed to delete item:', error);
                toast.error('Failed to delete item.');
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all'
            ? true
            : filterStatus === 'low'
                ? item.quantity < item.minStockLevel
                : item.quantity >= item.minStockLevel;
        const matchesCategory = selectedCategory === 'all' ? true : item.category === selectedCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Inventory</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage stock levels, prices, and suppliers.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary flex items-center gap-2 group hover:scale-105 transition-transform"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>Add Item</span>
                </button>
            </div>

            {/* Controls Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <select
                            className="input-field appearance-none pr-8 cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="food">Food</option>
                            <option value="beverage">Beverage</option>
                            <option value="general">General</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            className="input-field appearance-none pr-8 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low">Low Stock</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/50">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                                        Item Details <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Stock Level</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Value</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.unit}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${item.category === 'food' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                item.category === 'beverage' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{item.sku}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${item.quantity < item.minStockLevel ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                        {item.quantity}
                                                    </span>
                                                    {item.quantity < item.minStockLevel && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                            <AlertCircle className="h-3 w-3" /> Low
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${item.quantity < item.minStockLevel ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                            Rs {item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-bold">
                                            Rs {(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setSelectedItemForSale(item); setIsSaleModalOpen(true); }}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Record Sale"
                                                >
                                                    <Tag className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-8 w-8 opacity-20" />
                                            <p>No items found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredItems.length}</span> results</p>
                    <div className="flex gap-2">
                        <button className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            >
                <AddItem
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchInventory}
                    initialData={editingItem}
                />
            </Modal>

            <Modal
                isOpen={isSaleModalOpen}
                onClose={() => setIsSaleModalOpen(false)}
                title="Record Consumption/Sale"
            >
                {selectedItemForSale && (
                    <RecordSale
                        item={selectedItemForSale}
                        onClose={() => setIsSaleModalOpen(false)}
                        onSuccess={fetchInventory}
                    />
                )}
            </Modal>
        </div>
    );
};

export default InventoryPage;
