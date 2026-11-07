import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        crimson: 'border-red-500/40 bg-red-500/15 text-red-300',
        studio: 'border-white/10 bg-[#1A1D24] text-zinc-300',
        outline: 'border-white/15 text-zinc-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
