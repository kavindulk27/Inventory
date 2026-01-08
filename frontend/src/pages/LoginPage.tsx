import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import api from '../services/api'; // 👈 backend axios instance

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 🔗 REAL BACKEND LOGIN (DJANGO JWT)
            const res = await api.post('login/', {
                username: email,   // ⚠️ Django default = username
                password: password,
            });

            // Save tokens
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);

            // Auth context update
            login(
                {
                    email,
                    role: 'admin',
                } as any,
                res.data.access
            );

            navigate('/');
        } catch (err: any) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Section - Form */}
            <div className="flex w-full flex-col justify-center px-12 sm:px-24 lg:w-[45%] xl:px-32 relative z-10 bg-white">
                <div className="max-w-sm w-full mx-auto">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="h-9 w-9 bg-blue-700 rounded-lg flex items-center justify-center">
                            <div className="h-4 w-4 border-2 border-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            ChefStock
                        </span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to platform
                        </h1>
                        <p className="mt-3 text-sm text-gray-500">
                            Welcome back. Please enter your details to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Email / Username
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600 block"></span>
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-slate-200 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <span className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    Sign in <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400">
                                    Secure Enterprise Login
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 grayscale opacity-60">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-xs font-medium">SOC2 Compliant</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Lock className="h-4 w-4" />
                                <span className="text-xs font-medium">256-bit Encryption</span>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-xs text-gray-400">
                        © 2025 ChefStock Inc. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex w-[55%] items-center justify-center bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10 w-full max-w-lg">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
                                    System Operational
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-white leading-tight">
                                "ChefStock has transformed how we manage our inventory."
                            </h2>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/10"></div>
                                <div>
                                    <p className="text-white font-medium">Admin User</p>
                                    <p className="text-blue-200 text-sm">System Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-4">
                        {[
                            'Real-time Tracking',
                            'Automated Orders',
                            'Supplier Management',
                            'Cost Analytics',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-blue-100/80">
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
