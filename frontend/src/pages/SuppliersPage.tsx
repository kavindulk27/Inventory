import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Filter, MoreVertical, Phone, Mail, MapPin, Star, Edit2, Trash2, ExternalLink, ChevronLeft, ChevronRight, Building } from 'lucide-react';
import Loader from '../components/common/Loader';
import supplierService from '@/features/suppliers/supplierService';
import Modal from '../components/common/Modal';
import AddSupplier from '../features/suppliers/AddSupplier';

interface Supplier {
    id: string;
    name: string;
    contact: string;
    email: string;
    phone: string;
    category: string;
    rating: number;
    status: 'Active' | 'Inactive';
    location: string;
}

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await supplierService.getAll();
            const mappedSuppliers = response.data.map((s: any) => ({
                id: s.id.toString(),
                name: s.name,
                contact: s.contact_person,
                email: s.email,
                phone: s.phone,
                category: s.category || 'N/A',
                rating: s.rating || 0,
                status: s.status as 'Active' | 'Inactive',
                location: s.location || 'N/A'
            }));
            setSuppliers(mappedSuppliers);
        } catch (error) {
            console.error('Failed to fetch suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (id: string, name: string) => {
        toast(`Edit functionality for ${name} coming in next update.`, { icon: 'ℹ️' });
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to remove ${name} from your suppliers?`)) {
            try {
                await supplierService.delete(id);
                toast.success('Supplier deleted successfully!');
                fetchSuppliers();
            } catch (error) {
                console.error('Failed to delete supplier:', error);
                toast.error('Failed to delete supplier.');
            }
        }
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true : supplier.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Suppliers</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your vendor relationships and orders.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 group"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>Add Supplier</span>
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Supplier"
            >
                <AddSupplier
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchSuppliers}
                />
            </Modal>

            {/* Controls */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search suppliers, contacts, categories..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative">
                        <select
                            className="input-field appearance-none pr-8 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Grid Layout for Suppliers (More Professional than simple table for rich data) */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="card group hover:shadow-glow-hover transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500">
                        <div className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Building className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{supplier.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-3 w-3" /> {supplier.location}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${supplier.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    {supplier.status}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Contact</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{supplier.contact}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                                    <div className="flex items-center gap-1">
                                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">{supplier.category}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Rating</span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span className="text-gray-900 dark:text-gray-100 font-bold">{supplier.rating}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 flex gap-2">
                                <button
                                    onClick={() => handleCall(supplier.phone)}
                                    className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                >
                                    <Phone className="h-3.5 w-3.5" /> Call
                                </button>
                                <button
                                    onClick={() => handleEmail(supplier.email)}
                                    className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                >
                                    <Mail className="h-3.5 w-3.5" /> Email
                                </button>
                                <div className="flex gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                                    <button
                                        onClick={() => handleEdit(supplier.id, supplier.name)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier.id, supplier.name)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empy State */}
            {filteredSuppliers.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No suppliers found</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default SuppliersPage;
