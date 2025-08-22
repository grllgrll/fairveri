import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  className, 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-primary border-t-transparent',
        sizeClasses[size]
      )} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ 
  className?: string;
  lines?: number;
}> = ({ className, lines = 3 }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export const LoadingCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-4 sm:p-6 border rounded-lg', className)}>
      <div className="animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const LoadingButton: React.FC<{ 
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}> = ({ className, children, isLoading = true }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isLoading}
    >
      {isLoading && <Loading size="sm" className="text-current" />}
      {children}
    </button>
  );
};