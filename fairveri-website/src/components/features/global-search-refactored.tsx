'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  searchContent, 
  getSearchSuggestions, 
  SearchResult, 
  trackSearchAnalytics,
  getPopularSearches,
  SearchFilters
} from '@/lib/search-utils';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';

// Import refactored components
import { SearchResults } from './search/SearchResults';
import { SearchFilters as SearchFiltersComponent } from './search/SearchFilters';
import { SearchSuggestions, SearchSuggestion } from './search/SearchSuggestions';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  defaultFilters?: SearchFilters;
}

export default function GlobalSearchRefactored({ 
  isOpen, 
  onClose, 
  placeholder = "FAIR prensipleri, araçlar, örnekler ara...",
  autoFocus = true,
  defaultFilters
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters || {});
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'date'>('relevance');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search history and popular searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('fairveri-search-history') || '[]');
      setSearchHistory(history);
      
      const popular = getPopularSearches();
      setPopularSearches(popular);
    }
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, autoFocus]);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults = await searchContent(searchQuery, {
        ...searchFilters,
        sortBy,
        limit: 20
      });
      
      setResults(searchResults);
      
      // Track analytics
      trackSearchAnalytics(searchQuery, searchResults.length);
      
    } catch (error) {
      // Search error occurred in refactored global search
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // Handle input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, filters);
        
        // Get suggestions
        const searchSuggestions = getSearchSuggestions(query, searchHistory);
        setSuggestions(searchSuggestions);
        setShowSuggestions(true);
      } else {
        setResults([]);
        setShowSuggestions(true);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, performSearch, searchHistory]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalItems = suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : -1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : totalItems - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex].text);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, query]);

  const handleSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // Add to search history
    const newHistory = [trimmedQuery, ...searchHistory.filter(h => h !== trimmedQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairveri-search-history', JSON.stringify(newHistory));
    }

    // Perform search
    setQuery(trimmedQuery);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    performSearch(trimmedQuery, filters);
  }, [searchHistory, filters, performSearch]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSearch(suggestion);
  }, [handleSearch]);

  const handleResultClick = useCallback((result: SearchResult) => {
    // Track click analytics
    trackSearchAnalytics(`${query}_click`, 1, result.type);
    onClose();
  }, [query, onClose]);

  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fairveri-search-history');
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="relative">
        {/* Search Header */}
        <div className="relative">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-3 pr-12 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-muted-foreground">⌘K</span>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <SearchSuggestions
                  suggestions={suggestions}
                  query={query}
                  selectedIndex={selectedIndex}
                  onSuggestionClick={handleSuggestionClick}
                  onClearHistory={handleClearHistory}
                  popularSearches={popularSearches}
                />
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <option value="relevance">İlgili</option>
                <option value="title">Başlık</option>
                <option value="date">Tarih</option>
              </Select>
            </div>
          </div>

          {/* Search Filters */}
          <SearchFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            isVisible={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            onResultClick={handleResultClick}
          />
        </div>

        {/* Search Footer */}
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>⏎ seç</span>
              <span>↑↓ gezin</span>
              <span>esc çık</span>
            </div>
            <div>
              Toplam {results.length} sonuç
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Search Trigger Component
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="w-64 justify-between text-muted-foreground"
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        🔍 Ara...
      </span>
      <span className="text-xs">⌘K</span>
    </Button>
  );
}