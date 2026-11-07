import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-amber-500 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] active:scale-[0.98]',
        crimson:
          'bg-red-600 text-white font-semibold shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-500 active:scale-[0.98]',
        studio:
          'bg-[#131519] text-zinc-100 border border-white/10 hover:border-amber-500/50 hover:bg-[#1A1D24] shadow-inner',
        outline:
          'border border-white/15 bg-transparent text-zinc-200 hover:bg-white/5 hover:border-white/25',
        ghost:
          'text-zinc-400 hover:text-zinc-100 hover:bg-white/5',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
