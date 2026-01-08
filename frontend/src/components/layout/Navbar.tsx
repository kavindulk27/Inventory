
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Bell, LogOut, Moon, Sun, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Extract first character safely
    const getUserInitial = () => {
        if (!user?.name) return '';
        return user.name.charAt(0);
    };

    return (
        <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 px-6 backdrop-blur-xl transition-all">
            <div className="md:hidden text-lg font-bold flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <span className="text-xs">CS</span>
                </div>
                ChefStock
            </div>
            <div className="flex-1"></div> {/* Spacer */}

            <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Sun className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-gray-700 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Moon className="h-4 w-4" />
                    </button>
                </div>

                <button className="relative text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                </button>

                {user ? (
                    <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4 lg:pl-6">
                        <div className="flex flex-col text-right hidden sm:block">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                                {user.role || 'user'}
                            </span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 ring-2 ring-white dark:ring-gray-800 shadow-sm flex items-center justify-center text-blue-700 dark:text-blue-200 font-medium">
                            {getUserInitial() || <UserIcon className="h-5 w-5" />}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors group"
                            title="Logout"
                        >
                            <LogOut className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <span className="text-sm text-gray-500 font-medium dark:text-gray-400">Guest Mode</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
