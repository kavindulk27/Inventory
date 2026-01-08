import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StockReport = () => {
    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Current Stock Valuation</h3>
                <select className="input-field w-auto py-1">
                    <option>This Month</option>
                    <option>Last Month</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Asset Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">$45,231.89</p>
                    <div className="flex items-center text-sm text-green-600 mt-2">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>+12.5%</span>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-500">Top Category</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Meat & Poultry</p>
                    <p className="text-xs text-gray-500 mt-2">35% of total value</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-500">Stock Turnover</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4.2 Days</p>
                    <div className="flex items-center text-sm text-red-600 mt-2">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        <span>-0.8%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category Breakdown</h4>
                {['Meat & Poultry', 'Dairy & Eggs', 'Produce', 'Beverages', 'Dry Goods'].map((cat, i) => (
                    <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-700">{cat}</span>
                            <span className="text-gray-900">${(Math.random() * 10000).toFixed(2)}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'][i]}`}
                                style={{ width: `${Math.random() * 80 + 10}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockReport;
