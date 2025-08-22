'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  );
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg p-4 space-y-3', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

// Text skeleton
export function TextSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Button skeleton
export function ButtonSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton 
      className={cn('h-9 w-20 rounded-md', className)} 
    />
  );
}

// Avatar skeleton
export function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton 
      className={cn('h-10 w-10 rounded-full', className)} 
    />
  );
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// List skeleton
export function ListSkeleton({ 
  items = 5, 
  className 
}: { 
  items?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <AvatarSkeleton />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Search results skeleton
export function SearchResultsSkeleton({ 
  results = 5, 
  className 
}: { 
  results?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: results }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-1 mt-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Navigation skeleton
export function NavigationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-between p-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-24" />
        <div className="hidden md:flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

// Form skeleton
export function FormSkeleton({ 
  fields = 4, 
  className 
}: { 
  fields?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="flex space-x-2 pt-4">
        <ButtonSkeleton />
        <ButtonSkeleton className="w-16" />
      </div>
    </div>
  );
}

// Page skeleton with header and content
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <TextSkeleton lines={4} />
          <CardSkeleton />
          <TextSkeleton lines={3} />
        </div>
        <div className="space-y-4">
          <CardSkeleton />
          <ListSkeleton items={3} />
        </div>
      </div>
    </div>
  );
}

// Enhanced loading skeleton with shimmer effect
export function ShimmerSkeleton({ 
  className, 
  width = "100%", 
  height = "1rem" 
}: { 
  className?: string; 
  width?: string | number;
  height?: string | number;
}) {
  return (
    <div
      className={cn(
        'fairveri-skeleton',
        className
      )}
      style={{ width, height }}
    />
  );
}

// Assessment tool skeleton
export function AssessmentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <ShimmerSkeleton width="80px" height="16px" />
          <ShimmerSkeleton width="40px" height="16px" />
        </div>
        <ShimmerSkeleton width="100%" height="8px" className="rounded-full" />
      </div>
      
      {/* Question card */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <ShimmerSkeleton width="60px" height="20px" className="rounded-full" />
          <ShimmerSkeleton width="100%" height="24px" />
          <ShimmerSkeleton width="80%" height="16px" />
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border rounded-md">
              <ShimmerSkeleton width="20px" height="20px" className="rounded-full" />
              <ShimmerSkeleton width="100%" height="16px" />
            </div>
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <ShimmerSkeleton width="80px" height="40px" className="rounded-md" />
          <ShimmerSkeleton width="80px" height="40px" className="rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Research paper skeleton
export function ResearchSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ShimmerSkeleton width="48px" height="48px" className="rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <ShimmerSkeleton width="200px" height="18px" />
                <ShimmerSkeleton width="60px" height="20px" className="rounded-full" />
              </div>
              <ShimmerSkeleton width="120px" height="14px" />
              <ShimmerSkeleton width="100%" height="14px" />
              <ShimmerSkeleton width="80%" height="14px" />
              <div className="flex gap-1 mt-2">
                <ShimmerSkeleton width="50px" height="20px" className="rounded-full" />
                <ShimmerSkeleton width="60px" height="20px" className="rounded-full" />
                <ShimmerSkeleton width="40px" height="20px" className="rounded-full" />
              </div>
            </div>
            <ShimmerSkeleton width="60px" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading state with animated spinner
export function LoadingSpinner({ 
  size = "md", 
  text = "Yükleniyor...",
  className 
}: { 
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn('fairveri-loading-container', className)}>
      <div className="text-center space-y-4">
        <div className={cn('fairveri-loading-spinner mx-auto', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    </div>
  );
}