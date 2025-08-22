import { useState, useEffect } from 'react';

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  deltaThreshold?: number;
}

export const useSwipe = (input: SwipeInput) => {
  const [touchStart, setTouchStart] = useState<Touch | null>(null);
  const [touchEnd, setTouchEnd] = useState<Touch | null>(null);

  const threshold = input.threshold || 50;
  const deltaThreshold = input.deltaThreshold || 10;

  useEffect(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.clientX - touchEnd.clientX;
    const distanceY = touchStart.clientY - touchEnd.clientY;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);

    const isHorizontalSwipe = absDistanceX > absDistanceY;
    const isVerticalSwipe = absDistanceY > absDistanceX;

    if (isHorizontalSwipe) {
      if (absDistanceX > threshold) {
        if (distanceX > 0) {
          input.onSwipeLeft?.();
        } else {
          input.onSwipeRight?.();
        }
      }
    } else if (isVerticalSwipe) {
      if (absDistanceY > threshold) {
        if (distanceY > 0) {
          input.onSwipeUp?.();
        } else {
          input.onSwipeDown?.();
        }
      }
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, threshold, input]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.changedTouches[0]);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useSwipe;