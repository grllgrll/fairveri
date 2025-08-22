'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserPreferences {
  bookmarks: string[];
  recentSearches: string[];
  favoriteTools: string[];
  contentRatings: { [key: string]: number };
  viewPreferences: {
    itemsPerPage: number;
    sortBy: 'relevance' | 'title' | 'date';
    viewMode: 'grid' | 'list';
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    updates: boolean;
    newContent: boolean;
    reminders: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  bookmarks: [],
  recentSearches: [],
  favoriteTools: [],
  contentRatings: {},
  viewPreferences: {
    itemsPerPage: 10,
    sortBy: 'relevance',
    viewMode: 'grid'
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  },
  notifications: {
    updates: true,
    newContent: true,
    reminders: false
  }
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  rateContent: (id: string, rating: number) => void;
  getContentRating: (id: string) => number | undefined;
  addFavoriteTool: (toolId: string) => void;
  removeFavoriteTool: (toolId: string) => void;
  isFavoriteTool: (toolId: string) => boolean;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export function UserPreferencesProvider({
  children,
  storageKey = 'fairveri-user-preferences'
}: UserPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      // Failed to load user preferences from localStorage
    }
  }, [storageKey]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      // Failed to save user preferences to localStorage
    }
  }, [preferences, storageKey]);

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${preferences.accessibility.fontSize}`);
    
    // High contrast
    root.classList.toggle('high-contrast', preferences.accessibility.highContrast);
    
    // Reduced motion
    if (preferences.accessibility.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  }, [preferences.accessibility]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addBookmark = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id) 
        ? prev.bookmarks
        : [...prev.bookmarks, id]
    }));
  };

  const removeBookmark = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(bookmark => bookmark !== id)
    }));
  };

  const isBookmarked = (id: string) => {
    return preferences.bookmarks.includes(id);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    setPreferences(prev => {
      const filtered = prev.recentSearches.filter(search => 
        search.toLowerCase() !== query.toLowerCase()
      );
      return {
        ...prev,
        recentSearches: [query, ...filtered].slice(0, 10) // Keep last 10 searches
      };
    });
  };

  const clearRecentSearches = () => {
    setPreferences(prev => ({
      ...prev,
      recentSearches: []
    }));
  };

  const rateContent = (id: string, rating: number) => {
    if (rating < 1 || rating > 5) return;
    
    setPreferences(prev => ({
      ...prev,
      contentRatings: {
        ...prev.contentRatings,
        [id]: rating
      }
    }));
  };

  const getContentRating = (id: string) => {
    return preferences.contentRatings[id];
  };

  const addFavoriteTool = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTools: prev.favoriteTools.includes(toolId)
        ? prev.favoriteTools
        : [...prev.favoriteTools, toolId]
    }));
  };

  const removeFavoriteTool = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTools: prev.favoriteTools.filter(tool => tool !== toolId)
    }));
  };

  const isFavoriteTool = (toolId: string) => {
    return preferences.favoriteTools.includes(toolId);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setPreferences({ ...defaultPreferences, ...parsed });
      return true;
    } catch (error) {
      // Failed to import preferences - invalid JSON format
      return false;
    }
  };

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addRecentSearch,
    clearRecentSearches,
    rateContent,
    getContentRating,
    addFavoriteTool,
    removeFavoriteTool,
    isFavoriteTool,
    resetPreferences,
    exportPreferences,
    importPreferences
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

// Content rating component
export function ContentRating({ 
  contentId, 
  onRate 
}: { 
  contentId: string; 
  onRate?: (rating: number) => void; 
}) {
  const { rateContent, getContentRating } = useUserPreferences();
  const currentRating = getContentRating(contentId);

  const handleRate = (rating: number) => {
    rateContent(contentId, rating);
    onRate?.(rating);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground mr-2">Değerlendirin:</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className={`text-lg transition-colors ${
            currentRating && star <= currentRating
              ? 'text-yellow-500'
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          aria-label={`${star} yıldız verin`}
        >
          ★
        </button>
      ))}
      {currentRating && (
        <span className="text-sm text-muted-foreground ml-2">
          ({currentRating}/5)
        </span>
      )}
    </div>
  );
}

// Bookmark button component
export function BookmarkButton({ 
  contentId, 
  className = '' 
}: { 
  contentId: string; 
  className?: string; 
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useUserPreferences();
  const bookmarked = isBookmarked(contentId);

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(contentId);
    } else {
      addBookmark(contentId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors ${
        bookmarked
          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      } ${className}`}
      aria-label={bookmarked ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={bookmarked ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}