import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'soft';
type Size = 'default' | 'lg';

const baseStyles =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'border-0 bg-ink text-bg hover:-translate-y-px hover:shadow-md dark:bg-brand dark:text-[#042417]',
  ghost:
    'border border-line bg-transparent text-ink hover:bg-bg-2',
  soft: 'border-0 bg-brand-soft text-brand-deep hover:brightness-95',
};

const sizes: Record<Size, string> = {
  default: 'px-4 py-2.5 text-sm',
  lg: 'px-[22px] py-[13px] text-[15px]',
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(baseStyles, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export const FvButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className, ...props }, ref) => (
    <button ref={ref} className={classes(variant, size, className)} {...props} />
  )
);
FvButton.displayName = 'FvButton';

type LinkButtonProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, keyof CommonProps>;

export const FvLinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'default', className, ...props }, ref) => (
    <Link
      ref={ref as any}
      className={cn(classes(variant, size, className), 'no-underline')}
      {...props}
    />
  )
);
FvLinkButton.displayName = 'FvLinkButton';
