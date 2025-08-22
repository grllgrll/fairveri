'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  searchContent, 
  getSearchSuggestions, 
  SearchResult, 
  SearchHistory,
  trackSearchAnalytics,
  getPopularSearches,
  SearchFilters
} from '@/lib/search-utils';
import { createSafeHTMLProps } from '@/lib/html-sanitizer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  defaultFilters?: SearchFilters;
}

interface SearchSuggestion {
  text: string;
  type: 'suggestion' | 'history' | 'popular';
}

export default function GlobalSearch({ 
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
  const [totalResults, setTotalResults] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Load search history and popular searches
  useEffect(() => {
    if (isOpen) {
      setSearchHistory(SearchHistory.getHistory());
      setPopularSearches(getPopularSearches());
    }
  }, [isOpen]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, autoFocus]);
  
  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        
        try {
          const searchResults = searchContent(searchQuery, {
            limit: 8,
            includeHighlights: true,
            filters,
            sortBy
          });
          
          setResults(searchResults.results);
          setTotalResults(searchResults.totalCount);
          
          // Update suggestions
          const searchSuggestions = getSearchSuggestions(searchQuery, 5);
          const allSuggestions: SearchSuggestion[] = [
            ...searchSuggestions.map(text => ({ text, type: 'suggestion' as const }))
          ];
          
          setSuggestions(allSuggestions);
          
        } catch (error) {
          // Search error occurred during global search
          setResults([]);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        // Show history and popular searches when query is empty
        const historySuggestions: SearchSuggestion[] = searchHistory
          .slice(0, 5)
          .map(text => ({ text, type: 'history' as const }));
        
        const popularSuggestions: SearchSuggestion[] = popularSearches
          .slice(0, 5)
          .map(text => ({ text, type: 'popular' as const }));
        
        setSuggestions([...historySuggestions, ...popularSuggestions]);
      }
    }, 300);
  }, [searchHistory, popularSearches, filters, sortBy]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
    debouncedSearch(value);
  };
  
  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    const finalQuery = searchQuery.trim();
    
    // Add to history
    SearchHistory.addToHistory(finalQuery);
    
    // Track analytics
    trackSearchAnalytics(finalQuery, totalResults);
    
    // Navigate to search results page with filters
    const params = new URLSearchParams({ q: finalQuery });
    if (filters.category?.length) {
      params.set('category', filters.category.join(','));
    }
    if (filters.type?.length) {
      params.set('type', filters.type.join(','));
    }
    if (sortBy !== 'relevance') {
      params.set('sort', sortBy);
    }
    
    router.push(`/search?${params.toString()}`);
    onClose();
  };
  
  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    trackSearchAnalytics(query, results.length, result);
    SearchHistory.addToHistory(query.trim());
    
    if (result.url.startsWith('/')) {
      router.push(result.url);
    } else {
      window.open(result.url, '_blank');
    }
    
    onClose();
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          } else {
            const suggestionIndex = selectedIndex - results.length;
            handleSuggestionClick(suggestions[suggestionIndex]);
          }
        } else {
          handleSearch();
        }
        break;
        
      case 'Escape':
        if (showSuggestions) {
          setShowSuggestions(false);
        } else {
          onClose();
        }
        break;
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedIndex(-1);
    setShowSuggestions(false);
    setTotalResults(0);
    inputRef.current?.focus();
  };
  
  // Handle filter change
  const handleFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentFilter = prev[filterType] || [];
      const updatedFilter = checked 
        ? [...currentFilter, value]
        : currentFilter.filter(item => item !== value);
      
      return {
        ...prev,
        [filterType]: updatedFilter.length > 0 ? updatedFilter : undefined
      };
    });
    
    // Re-run search with new filters if we have a query
    if (query.trim()) {
      debouncedSearch(query);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    if (query.trim()) {
      debouncedSearch(query);
    }
  };
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.type?.length) count += filters.type.length;
    if (filters.difficulty?.length) count += filters.difficulty.length;
    return count;
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'principles': '📚',
      'tools': '🔧',
      'examples': '💡',
      'faq': '❓',
      'resources': '📖',
      'pages': '📄'
    };
    return icons[category] || '📄';
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'principles': 'bg-blue-100 text-blue-800',
      'tools': 'bg-green-100 text-green-800',
      'examples': 'bg-purple-100 text-purple-800',
      'faq': 'bg-orange-100 text-orange-800',
      'resources': 'bg-indigo-100 text-indigo-800',
      'pages': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  // Get suggestion icon
  const getSuggestionIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'suggestion': '🔍',
      'history': '🕒',
      'popular': '🔥'
    };
    return icons[type] || '🔍';
  };
  
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} className="max-w-4xl">
      <div className="relative">
        {/* Search Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <div className="flex-1 relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-3 pl-12 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                autoComplete="off"
              />
              
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Clear Button */}
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute right-16 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          
          {/* Search Actions */}
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${showFilters ? 'bg-blue-50 text-blue-600' : ''}`}
              aria-label="Filtreleri aç/kapat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              {getActiveFilterCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-600 text-white">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
            
            {/* Sort Dropdown - Simple implementation */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'title' | 'date')}
              className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
            >
              <option value="relevance">İlgili</option>
              <option value="title">A-Z</option>
              <option value="date">Tarih</option>
            </select>
            
            {/* Keyboard Shortcut Hint */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd>
            </div>
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Filtreler</h3>
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Tümünü Temizle
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Filters */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Kategori</h4>
                <div className="space-y-2">
                  {['principles', 'tools', 'examples', 'faq', 'resources'].map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.category?.includes(category) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('category', category, checked as boolean)
                        }
                      />
                      <span className="text-xs text-gray-600 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Type Filters */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Tür</h4>
                <div className="space-y-2">
                  {['assessment', 'metadata', 'repository', 'standard'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.type?.includes(type) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('type', type, checked as boolean)
                        }
                      />
                      <span className="text-xs text-gray-600 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Filters */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Zorluk</h4>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                    <label key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.difficulty?.includes(difficulty) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('difficulty', difficulty, checked as boolean)
                        }
                      />
                      <span className="text-xs text-gray-600 capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Results */}
        <div 
          ref={resultsRef}
          className="max-h-96 overflow-y-auto"
        >
          {/* Results */}
          {results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Arama Sonuçları ({results.length}{totalResults > results.length ? ` / ${totalResults}` : ''})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch()}
                  className="text-sm"
                >
                  Tümünü Gör ({totalResults})
                </Button>
              </div>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Card
                    key={result.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedIndex === index ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {getCategoryIcon(result.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            className="font-medium text-gray-900 truncate"
                            {...createSafeHTMLProps(result.highlightedTitle || result.title)}
                          />
                          <Badge className={`text-xs ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </Badge>
                        </div>
                        
                        <p 
                          className="text-sm text-gray-600 line-clamp-2"
                          {...createSafeHTMLProps(result.highlightedDescription || result.description)}
                        />
                        
                        {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.matchedKeywords.slice(0, 3).map((keyword, i) => (
                              <Badge 
                                key={i} 
                                variant="secondary"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {Math.round(result.score)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggestions */}
          {(showSuggestions || query.length < 2) && suggestions.length > 0 && (
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {query.length >= 2 ? 'Öneriler' : 'Önceki Aramalar & Popüler'}
              </h3>
              
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => {
                  const globalIndex = results.length + index;
                  return (
                    <div
                      key={`${suggestion.type}-${suggestion.text}`}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedIndex === globalIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="text-sm">
                        {getSuggestionIcon(suggestion.type)}
                      </span>
                      <span className="text-sm text-gray-700">
                        {suggestion.text}
                      </span>
                      {suggestion.type === 'history' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            SearchHistory.removeFromHistory(suggestion.text);
                            setSearchHistory(SearchHistory.getHistory());
                          }}
                          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {query.length >= 2 && results.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                "<strong>{query}</strong>" için sonuç bulunamadı.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Yazım hatası olup olmadığını kontrol edin</p>
                <p>• Daha genel kelimeler kullanmayı deneyin</p>
                <p>• Farklı anahtar kelimeler deneyin</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">↑</kbd>
              <kbd className="px-2 py-1 bg-white border rounded text-xs">↓</kbd>
              <span>Gezinme</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Enter</kbd>
              <span>Seç</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd>
              <span>Kapat</span>
            </div>
          </div>
          
          {searchHistory.length > 0 && (
            <button
              onClick={() => {
                SearchHistory.clearHistory();
                setSearchHistory([]);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Geçmişi Temizle
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// Search trigger component for navbar
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-w-0"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline truncate">Ara...</span>
      <div className="hidden sm:flex items-center gap-1 ml-auto">
        <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">⌘</kbd>
        <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">K</kbd>
      </div>
    </button>
  );
}