import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-wts-green text-black hover:bg-green-400 font-bold uppercase tracking-wide',
        secondary: 'bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wide',
        outline: 'border border-white/20 text-white hover:bg-white/10 uppercase tracking-wide',
        ghost: 'text-gray-400 hover:text-white uppercase tracking-wide font-medium text-xs',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 italic',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
