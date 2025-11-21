import { HTMLAttributes, forwardRef } from 'react';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
    ({ value, className = '', ...props }, ref) => (
        <div
            ref={ref}
            className={`h-2 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}
            {...props}
        >
            <div
                className="h-full bg-primary-500 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    )
);

Progress.displayName = 'Progress';
