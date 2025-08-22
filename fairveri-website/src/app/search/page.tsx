'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  searchContent, 
  SearchResult, 
  SearchFilters, 
  SearchHistory,
  trackSearchAnalytics,
  getRelatedContent,
  getPopularSearches
} from '@/lib/search-utils';
import { createSafeHTMLProps } from '@/lib/html-sanitizer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import Link from 'next/link';

function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'date'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [relatedContent, setRelatedContent] = useState<SearchResult[]>([]);
  
  const resultsPerPage = 10;

  // Get query from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
    setPopularSearches(getPopularSearches());
  }, [searchParams]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults = searchContent(searchQuery, {
        limit: resultsPerPage,
        offset: (page - 1) * resultsPerPage,
        filters,
        sortBy,
        includeHighlights: true
      });

      setResults(searchResults.results);
      setTotalCount(searchResults.totalCount);
      setSearchSuggestions(searchResults.suggestions);
      
      // Track search analytics
      trackSearchAnalytics(searchQuery, searchResults.totalCount);
      
    } catch (error) {
      // Search error occurred during content search
      setResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Update URL without triggering navigation
    const newUrl = new URL(window.location.href);
    if (value) {
      newUrl.searchParams.set('q', value);
    } else {
      newUrl.searchParams.delete('q');
    }
    window.history.replaceState({}, '', newUrl.toString());
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      SearchHistory.addToHistory(query.trim());
      setCurrentPage(1);
      performSearch(query.trim(), 1);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues.length > 0 ? newValues : undefined
      };
    });
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: 'relevance' | 'title' | 'date') => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(query, page);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    trackSearchAnalytics(query, totalCount, result);
    
    // Get related content
    const related = getRelatedContent(result.id);
    setRelatedContent(related);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
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

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / resultsPerPage);
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalCount);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Arama Sonuçları
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="FAIR prensipleri, araçlar, örnekler ara..."
                className="w-full px-4 py-3 pl-12 pr-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>

          {/* Search Stats */}
          {query && (
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <span>Aranıyor...</span>
                ) : (
                  <span>
                    <strong>{totalCount}</strong> sonuç bulundu 
                    {query && <span> "<strong>{query}</strong>" için</span>}
                    {totalCount > 0 && (
                      <span> ({startResult}-{endResult} arası gösteriliyor)</span>
                    )}
                  </span>
                )}
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sıralama:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="relevance">İlgililik</option>
                  <option value="title">Alfabetik</option>
                  <option value="date">Tarih</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtreler</h3>
                {Object.keys(filters).length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Temizle
                  </Button>
                )}
              </div>

              {/* Category Filters */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Kategori</h4>
                <div className="space-y-2">
                  {[
                    { value: 'principles', label: 'FAIR Prensipleri', count: 5 },
                    { value: 'tools', label: 'Araçlar', count: 12 },
                    { value: 'examples', label: 'Örnekler', count: 8 },
                    { value: 'faq', label: 'SSS', count: 18 },
                    { value: 'resources', label: 'Kaynaklar', count: 25 },
                    { value: 'pages', label: 'Sayfalar', count: 6 }
                  ].map((category) => (
                    <label key={category.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category.value) || false}
                        onChange={() => handleFilterChange('category', category.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category.label}</span>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language Filters */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Dil</h4>
                <div className="space-y-2">
                  {[
                    { value: 'tr', label: 'Türkçe', count: 75 }
                  ].map((language) => (
                    <label key={language.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.language?.includes(language.value) || false}
                        onChange={() => handleFilterChange('language', language.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{language.label}</span>
                      <span className="text-xs text-gray-500">({language.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              {popularSearches.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Popüler Aramalar</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.slice(0, 8).map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search, 1);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Aranıyor...</p>
              </div>
            ) : query && results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sonuç bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  "<strong>{query}</strong>" için sonuç bulunamadı.
                </p>
                
                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3">Bunları deneyin:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {searchSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setQuery(suggestion);
                            performSearch(suggestion, 1);
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 space-y-1">
                  <p>• Yazım hatası olup olmadığını kontrol edin</p>
                  <p>• Daha genel kelimeler kullanmayı deneyin</p>
                  <p>• Farklı anahtar kelimeler deneyin</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {/* Results */}
                {results.map((result) => (
                  <Card key={result.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">
                        {getCategoryIcon(result.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            href={result.url}
                            onClick={() => handleResultClick(result)}
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <span
                              {...createSafeHTMLProps(result.highlightedTitle || result.title)}
                            />
                          </Link>
                          <Badge className={`text-xs ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </Badge>
                        </div>
                        
                        <p 
                          className="text-gray-700 mb-3 leading-relaxed"
                          {...createSafeHTMLProps(result.highlightedDescription || result.description)}
                        />
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {result.url}
                          </span>
                          <span>İlgililik: {Math.round(result.score)}</span>
                        </div>
                        
                        {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {result.matchedKeywords.slice(0, 5).map((keyword, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Önceki
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Sonraki
                    </Button>
                  </div>
                )}
              </div>
            ) : !query ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Arama yapın
                </h3>
                <p className="text-gray-600 mb-6">
                  FAIR prensipleri, araçlar, örnekler ve daha fazlası için arama yapın.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Popüler Aramalar</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.slice(0, 10).map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search, 1);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Arama yükleniyor...</div>}>
      <SearchComponent />
    </Suspense>
  );
}