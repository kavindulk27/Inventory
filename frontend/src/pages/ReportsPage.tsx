import React from 'react';
import StockReport from '../features/reports/StockReport';
import UsageReport from '../features/reports/UsageReport';

const ReportsPage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Reports</h1>
            <StockReport />
            <UsageReport />
        </div>
    );
};

export default ReportsPage;
