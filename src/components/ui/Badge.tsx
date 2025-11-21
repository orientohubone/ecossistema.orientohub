import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ variant = 'default', className = '', ...props }, ref) => {
        const variants = {
            default: 'bg-gray-800 text-gray-300 border border-gray-700',
            success: 'bg-green-500/20 text-green-400 border border-green-500/30',
            warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            destructive: 'bg-red-500/20 text-red-400 border border-red-500/30'
        };

        return (
            <div
                ref={ref}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
