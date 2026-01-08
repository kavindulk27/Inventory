import React from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
                <form className="space-y-4">
                    <Input label="Name" placeholder="John Doe" />
                    <Input label="Email" type="email" placeholder="you@example.com" />
                    <Input label="Password" type="password" placeholder="********" />
                    <Button className="w-full">Sign Up</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;
