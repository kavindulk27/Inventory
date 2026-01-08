import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Tag, DollarSign, Package } from 'lucide-react';
import salesService, { Sale, DailySummary } from '../features/sales/salesService';
import inventoryService from '../features/inventory/inventoryService';
import { InventoryItem } from '../types/inventory';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import RecordSale from '../features/sales/RecordSale';

const DailySalesPage = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [summary, setSummary] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [salesRes, summaryRes, invRes] = await Promise.all([
                salesService.getAll(),
                salesService.getDailySummary(),
                inventoryService.getAll()
            ]);

            const mappedInv = invRes.data.map((item: any) => ({
                ...item,
                id: item.id.toString(),
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 0,
                minStockLevel: parseInt(item.min_stock_level) || 0,
                supplierId: item.supplier ? item.supplier.toString() : '',
                category: item.category || 'general'
            }));

            setSales(salesRes.data);
            setSummary(summaryRes.data);
            setInventoryItems(mappedInv);
        } catch (error) {
            console.error('Failed to fetch sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaleRecord = () => {
        setIsSaleModalOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Daily Sales Log</h1>
                    <p className="text-sm text-gray-500 mt-1">Record and track daily item consumption and revenue.</p>
                </div>
                <button
                    onClick={handleSaleRecord}
                    className="btn-primary flex items-center gap-2 group shadow-lg shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>Record New Sale</span>
                </button>
            </div>

            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 border-l-4 border-green-500">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Today's Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900">Rs {summary?.total_revenue?.toFixed(2) || '0.00'}</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Tag className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Food Units</p>
                            <h3 className="text-2xl font-bold text-gray-900">{summary?.food || 0} Sold</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Beverage Units</p>
                            <h3 className="text-2xl font-bold text-gray-900">{summary?.beverage || 0} Sold</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales table */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Recent Sales History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Item</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(sale.date_sold).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{sale.item_details?.name || 'Unknown Item'}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{sale.item_details?.sku}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${sale.category === 'food' ? 'bg-orange-100 text-orange-700' :
                                                sale.category === 'beverage' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {sale.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                            {sale.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-gray-900">Rs {sale.total_price.toFixed(2)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Tag className="h-8 w-8 opacity-20" />
                                            <p>No sales recorded yet today.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isSaleModalOpen}
                onClose={() => setIsSaleModalOpen(false)}
                title="Record Item Sale"
            >
                <RecordSale
                    inventoryItems={inventoryItems}
                    onClose={() => setIsSaleModalOpen(false)}
                    onSuccess={fetchData}
                />
            </Modal>
        </div>
    );
};

export default DailySalesPage;
