import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    return (
        <button
            className={cn(
                'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
                    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
                    'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
                    'px-2 py-1 text-sm': size === 'sm',
                    'px-4 py-2': size === 'md',
                    'px-6 py-3 text-lg': size === 'lg',
                },
                className
            )}
            {...props}
        />
    );
};

export default Button;
