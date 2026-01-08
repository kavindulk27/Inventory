import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
    const links = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/inventory', label: 'Inventory', icon: Package },
        { to: '/suppliers', label: 'Suppliers', icon: Users },
        { to: '/sales', label: 'Daily Sales', icon: TrendingUp },
        { to: '/low-stock', label: 'Low Stock', icon: AlertTriangle },
        { to: '/reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className="w-72 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hidden md:block z-20 transition-colors">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Package className="h-5 w-5" />
                    </div>
                    <span>ChefStock</span>
                </h1>
            </div>
            <div className="px-4 py-2">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 ml-1">Main Menu</p>
                <ul className="space-y-1.5">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-100 dark:ring-blue-800/30 translate-x-1'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:translate-x-1'
                                    )
                                }
                            >
                                <link.icon className={clsx("h-[1.15rem] w-[1.15rem] transition-colors", ({ isActive }: any) => isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400")} />
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

        </aside>
    );
};

export default Sidebar;
