'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  delay?: number;
}

// Global announcement queue
const announcementQueue: Array<{ message: string; options: AnnouncementOptions }> = [];
let isProcessingQueue = false;

export function ScreenReaderAnnouncer() {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');
  const [atomic, setAtomic] = useState<boolean>(true);

  const processQueue = useCallback(async () => {
    if (isProcessingQueue || announcementQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (announcementQueue.length > 0) {
      const { message, options } = announcementQueue.shift()!;
      
      setPriority(options.priority || 'polite');
      setAtomic(options.atomic !== false);
      setCurrentMessage(message);
      
      // Wait for the announcement to be processed
      await new Promise(resolve => setTimeout(resolve, options.delay || 1000));
      
      // Clear the message
      setCurrentMessage('');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    isProcessingQueue = false;
  }, []);

  useEffect(() => {
    processQueue();
  }, [processQueue]);

  // Listen for custom announcement events
  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      const { message, options = {} } = event.detail;
      announcementQueue.push({ message, options });
      processQueue();
    };

    window.addEventListener('screen-reader-announce', handleAnnouncement as EventListener);
    
    return () => {
      window.removeEventListener('screen-reader-announce', handleAnnouncement as EventListener);
    };
  }, [processQueue]);

  return (
    <>
      {/* Main announcement region */}
      <div
        aria-live={priority}
        aria-atomic={atomic}
        className="sr-only"
        role="status"
      >
        {currentMessage}
      </div>
      
      {/* Secondary announcement region for urgent messages */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
        id="urgent-announcements"
      />
    </>
  );
}

// Hook for making announcements
export function useScreenReader() {
  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    if (!message.trim()) return;
    
    // Dispatch custom event
    const event = new CustomEvent('screen-reader-announce', {
      detail: { message, options }
    });
    
    window.dispatchEvent(event);
  }, []);

  const announceUrgent = useCallback((message: string) => {
    if (!message.trim()) return;
    
    const urgentRegion = document.getElementById('urgent-announcements');
    if (urgentRegion) {
      urgentRegion.textContent = message;
      setTimeout(() => {
        urgentRegion.textContent = '';
      }, 1000);
    }
  }, []);

  const announcePageChange = useCallback((pageTitle: string) => {
    announce(`Sayfa değişti: ${pageTitle}`, { 
      priority: 'assertive', 
      delay: 500 
    });
  }, [announce]);

  const announceFormError = useCallback((fieldName: string, error: string) => {
    announceUrgent(`${fieldName} alanında hata: ${error}`);
  }, [announceUrgent]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Başarılı: ${message}`, { 
      priority: 'polite', 
      delay: 500 
    });
  }, [announce]);

  const announceLoading = useCallback((action: string) => {
    announce(`${action} yükleniyor...`, { 
      priority: 'polite', 
      delay: 300 
    });
  }, [announce]);

  const announceLoadingComplete = useCallback((action: string) => {
    announce(`${action} tamamlandı`, { 
      priority: 'polite', 
      delay: 500 
    });
  }, [announce]);

  return {
    announce,
    announceUrgent,
    announcePageChange,
    announceFormError,
    announceSuccess,
    announceLoading,
    announceLoadingComplete,
  };
}

// Utility function for components to announce messages
export function announceToScreenReader(message: string, options: AnnouncementOptions = {}) {
  const event = new CustomEvent('screen-reader-announce', {
    detail: { message, options }
  });
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(event);
  }
}