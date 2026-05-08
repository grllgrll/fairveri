import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  id?: string;
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: 'start' | 'center';
  bg?: 'default' | 'soft';
  containerClassName?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}

export function Section({
  id,
  kicker,
  title,
  description,
  align = 'start',
  bg = 'default',
  className,
  containerClassName,
  headerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-y',
        bg === 'soft' && 'bg-bg-2',
        className
      )}
      {...rest}
    >
      <div className={cn('wrap', containerClassName)}>
        {(kicker || title || description) && (
          <header
            className={cn(
              'mb-6 flex flex-col gap-2 lg:mb-10',
              align === 'center' && 'items-center text-center',
              headerClassName
            )}
          >
            {kicker && (
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                {kicker}
              </p>
            )}
            {title && (
              <h2 className="text-balance text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-[640px] text-pretty text-[clamp(15px,1.4vw,17px)] leading-relaxed text-ink-2">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
