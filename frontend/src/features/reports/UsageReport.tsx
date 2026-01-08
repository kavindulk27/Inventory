import React from 'react';
import Table from '../../components/common/Table';

const UsageReport = () => {
    const usageData = [
        { item: 'Burger Buns', consumed: 1200, unit: 'pcs', cost: 450.00, trend: 'High' },
        { item: 'Tomatoes', consumed: 85, unit: 'kg', cost: 120.50, trend: 'Normal' },
        { item: 'Cheddar Cheese', consumed: 40, unit: 'kg', cost: 320.00, trend: 'High' },
        { item: 'Olive Oil', consumed: 12, unit: 'L', cost: 180.00, trend: 'Low' },
    ];

    return (
        <div className="card overflow-hidden">
            <div className="border-b border-gray-100 bg-white px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">Weekly Usage Report</h3>
            </div>
            <Table
                headers={['Item', 'Consumed Qty', 'Total Cost', 'Usage Trend']}
                data={usageData}
                renderRow={(row) => (
                    <tr key={row.item} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.item}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{row.consumed} {row.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${row.cost.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${row.trend === 'High' ? 'bg-red-100 text-red-800' :
                                    row.trend === 'Low' ? 'bg-green-100 text-green-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}>
                                {row.trend}
                            </span>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};

export default UsageReport;
