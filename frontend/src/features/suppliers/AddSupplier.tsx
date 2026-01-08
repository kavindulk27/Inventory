import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import supplierService from './supplierService';

interface AddSupplierProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        category: '',
        location: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await supplierService.create(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add supplier:', error);
            alert('Failed to add supplier. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Fresh Farms Ltd"
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Contact Person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
                <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Produce, Meat, etc."
                />
            </div>
            <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@company.com"
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                />
                <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Supplier'}
                </Button>
            </div>
        </form>
    );
};

export default AddSupplier;
