import { HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg ${className}`}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div ref={ref} className={`p-6 ${className}`} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = '', ...props }, ref) => (
        <h3 ref={ref} className={`text-xl font-bold text-white ${className}`} {...props} />
    )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
    )
);
CardContent.displayName = 'CardContent';
