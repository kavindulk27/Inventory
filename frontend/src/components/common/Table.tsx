import React from 'react';

interface TableProps {
    headers: string[];
    data: any[];
    renderRow: (item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((item, index) => (
                        <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
