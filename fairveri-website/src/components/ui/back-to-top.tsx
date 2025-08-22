'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  showProgressRing?: boolean;
}

export function BackToTop({ 
  threshold = 400, 
  smooth = true, 
  className,
  showProgressRing = true
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate scroll progress
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > threshold);
    };

    const throttledToggleVisibility = throttle(toggleVisibility, 100);
    
    window.addEventListener('scroll', throttledToggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', throttledToggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    };

    // Fallback for browsers that don't support smooth scrolling
    if (smooth && !('scrollBehavior' in document.documentElement.style)) {
      smoothScrollToTop();
    } else {
      window.scrollTo(scrollOptions);
    }
  };

  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 800;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 transition-all duration-300',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      className
    )}>
      <Button
        onClick={scrollToTop}
        size="icon"
        className={cn(
          'relative h-12 w-12 rounded-full shadow-lg hover:shadow-xl',
          'bg-blue-600 hover:bg-blue-700 text-white',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200',
          showProgressRing && 'p-0'
        )}
        aria-label="Sayfanın üstüne dön"
        title="Sayfanın üstüne dön"
      >
        {showProgressRing && (
          <svg
            className="absolute inset-0 h-12 w-12 -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-blue-300 opacity-25"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
              className="text-white transition-all duration-100"
              strokeLinecap="round"
            />
          </svg>
        )}
        
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </Button>
    </div>
  );
}

// Throttle utility function
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Progress indicator component
export function ScrollProgress({ 
  className,
  position = 'top'
}: {
  className?: string;
  position?: 'top' | 'bottom';
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    const throttledUpdate = throttle(updateScrollProgress, 10);
    window.addEventListener('scroll', throttledUpdate);
    
    return () => {
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Sticky navigation enhancement
export function StickyNavigation({ 
  children,
  className 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if navigation should be sticky
      setIsSticky(currentScrollY > 100);
      
      // Hide/show navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down - hide nav
        setNavVisible(false);
      } else {
        // Scrolling up - show nav
        setNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isSticky && 'shadow-md',
        navVisible ? 'translate-y-0' : '-translate-y-full',
        className
      )}
    >
      {children}
    </div>
  );
}