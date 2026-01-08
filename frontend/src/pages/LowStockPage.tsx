import React, { useEffect, useState } from 'react';
import { AlertCircle, Package, ArrowRight, RefreshCw, Plus } from 'lucide-react';
import reportService from '../services/reportService';
import Loader from '../components/common/Loader';
import { InventoryItem } from '../types/inventory';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import UpdateStockModal from '../features/inventory/UpdateStockModal';

const LowStockPage = () => {
    const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const navigate = useNavigate();

    const fetchLowStock = async () => {
        try {
            setLoading(true);
            const response = await reportService.getDashboardStats();
            setLowStockItems(response.data.lowStockItemsList || []);
        } catch (error) {
            console.error('Failed to fetch low stock items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLowStock();
    }, []);

    const handleUpdateStock = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsUpdateModalOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Low Stock Alert</h1>
                    <p className="text-sm text-gray-500 mt-1">Items requiring immediate attention and replenishment.</p>
                </div>
                <button
                    onClick={() => navigate('/inventory')}
                    className="btn-secondary flex items-center gap-2"
                >
                    <Package className="h-4 w-4" />
                    <span>View All Inventory</span>
                </button>
            </div>

            {lowStockItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lowStockItems.map((item) => (
                        <div key={item.id} className="card group hover:shadow-lg transition-all border-l-4 border-red-500 overflow-hidden relative">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{item.sku}</p>
                                    </div>
                                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                        Critical
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Current Stock:</span>
                                        <span className="font-bold text-red-600">{item.quantity} {item.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Min Level:</span>
                                        <span className="font-medium text-gray-700">{item.minStockLevel} {item.unit}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                                        <button
                                            onClick={() => handleUpdateStock(item)}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Update Inventory
                                        </button>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</span>
                                            <button
                                                onClick={() => navigate('/inventory')}
                                                className="text-gray-400 hover:text-blue-600 text-xs font-medium flex items-center gap-1 group"
                                            >
                                                Details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-20 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">All Stocked Up!</h3>
                    <p className="text-gray-500 max-w-xs mt-1">No items are currently running low on stock.</p>
                </div>
            )}

            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                title="Replenish Stock"
            >
                {selectedItem && (
                    <UpdateStockModal
                        item={selectedItem}
                        onClose={() => setIsUpdateModalOpen(false)}
                        onSuccess={fetchLowStock}
                    />
                )}
            </Modal>
        </div>
    );
};

export default LowStockPage;
