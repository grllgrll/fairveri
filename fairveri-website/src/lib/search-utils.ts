import searchData from '@/data/search-index.json';

const searchIndex = searchData.searchIndex;

// Search result interface
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory: string;
  url: string;
  keywords: string[];
  tags: string[];
  weight: number;
  language: string;
  score: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
  highlightedContent?: string;
  matchedKeywords?: string[];
}

// Search filters interface
export interface SearchFilters {
  category?: string[];
  difficulty?: string[];
  type?: string[];
  language?: string[];
}

// Search options interface
export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'title' | 'date';
  includeHighlights?: boolean;
}

// Turkish character mapping for normalization
const turkishCharMap: { [key: string]: string } = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ü': 'u', 'ö': 'o',
  'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ş': 'S', 'Ü': 'U', 'Ö': 'O'
};

// Normalize Turkish characters for better search
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çğışüöÇĞIŞÜÖ]/g, (char) => turkishCharMap[char] || char)
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate Levenshtein distance for fuzzy matching
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate fuzzy match score (0-1, higher is better)
export function fuzzyMatchScore(query: string, target: string, threshold = 0.7): number {
  const normalizedQuery = normalizeText(query);
  const normalizedTarget = normalizeText(target);
  
  if (normalizedQuery === normalizedTarget) return 1;
  if (normalizedTarget.includes(normalizedQuery)) return 0.9;
  
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget);
  const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
  
  if (maxLength === 0) return 0;
  
  const similarity = 1 - (distance / maxLength);
  return similarity >= threshold ? similarity : 0;
}

// Calculate relevance score for search results
export function calculateRelevanceScore(
  query: string,
  item: any,
  weights: { [key: string]: number } = {}
): number {
  const defaultWeights = {
    title: 10,
    description: 5,
    content: 3,
    keywords: 8,
    tags: 6,
    category: 2,
    weight: 1,
    ...weights
  };
  
  let score = 0;
  const queryTerms = normalizeText(query).split(' ').filter(term => term.length > 0);
  
  queryTerms.forEach(term => {
    // Title matching
    const titleScore = fuzzyMatchScore(term, item.title);
    score += titleScore * defaultWeights.title;
    
    // Description matching
    const descriptionScore = fuzzyMatchScore(term, item.description);
    score += descriptionScore * defaultWeights.description;
    
    // Content matching
    const contentScore = fuzzyMatchScore(term, item.content);
    score += contentScore * defaultWeights.content;
    
    // Keywords matching
    item.keywords?.forEach((keyword: string) => {
      const keywordScore = fuzzyMatchScore(term, keyword);
      score += keywordScore * defaultWeights.keywords;
    });
    
    // Tags matching
    item.tags?.forEach((tag: string) => {
      const tagScore = fuzzyMatchScore(term, tag);
      score += tagScore * defaultWeights.tags;
    });
    
    // Category matching
    const categoryScore = fuzzyMatchScore(term, item.category);
    score += categoryScore * defaultWeights.category;
  });
  
  // Apply item weight bonus
  score *= (1 + (item.weight || 0) * 0.1);
  
  return score;
}

// Highlight search terms in text
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) return text;
  
  const queryTerms = normalizeText(query).split(' ').filter(term => term.length > 0);
  let highlightedText = text;
  
  queryTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$&</mark>');
  });
  
  return highlightedText;
}

// Get search suggestions based on query
export function getSearchSuggestions(query: string, limit = 5): string[] {
  if (!query || query.length < 2) {
    return searchIndex.searchSuggestions.slice(0, limit);
  }
  
  const normalizedQuery = normalizeText(query);
  const suggestions = searchIndex.searchSuggestions
    .filter(suggestion => {
      const normalizedSuggestion = normalizeText(suggestion);
      return normalizedSuggestion.includes(normalizedQuery) ||
             fuzzyMatchScore(normalizedQuery, normalizedSuggestion, 0.6) > 0;
    })
    .sort((a, b) => {
      const scoreA = fuzzyMatchScore(normalizedQuery, normalizeText(a));
      const scoreB = fuzzyMatchScore(normalizedQuery, normalizeText(b));
      return scoreB - scoreA;
    })
    .slice(0, limit);
  
  return suggestions;
}

// Apply filters to search results
export function applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  if (!filters) return results;
  
  return results.filter(result => {
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(result.category)) return false;
    }
    
    if (filters.language && filters.language.length > 0) {
      if (!filters.language.includes(result.language)) return false;
    }
    
    // Additional filter logic can be added here
    return true;
  });
}

// Main search function
export function searchContent(
  query: string,
  options: SearchOptions = {}
): {
  results: SearchResult[];
  totalCount: number;
  suggestions: string[];
  filters: typeof searchIndex.searchFilters;
} {
  const {
    limit = 10,
    offset = 0,
    filters,
    sortBy = 'relevance',
    includeHighlights = true
  } = options;
  
  if (!query || query.length < 2) {
    return {
      results: [],
      totalCount: 0,
      suggestions: getSearchSuggestions(query),
      filters: searchIndex.searchFilters
    };
  }
  
  // Search through all items
  let results: SearchResult[] = searchIndex.items.map(item => {
    const score = calculateRelevanceScore(query, item);
    
    if (score === 0) return null;
    
    const result: SearchResult = {
      ...item,
      score,
      matchedKeywords: item.keywords.filter(keyword => 
        fuzzyMatchScore(normalizeText(query), normalizeText(keyword), 0.6) > 0
      )
    };
    
    if (includeHighlights) {
      result.highlightedTitle = highlightSearchTerms(item.title, query);
      result.highlightedDescription = highlightSearchTerms(item.description, query);
      result.highlightedContent = highlightSearchTerms(item.content, query);
    }
    
    return result;
  }).filter(Boolean) as SearchResult[];
  
  // Apply filters
  if (filters) {
    results = applyFilters(results, filters);
  }
  
  // Sort results
  results.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title, 'tr');
      case 'date':
        // Add date sorting logic if needed
        return b.score - a.score;
      case 'relevance':
      default:
        return b.score - a.score;
    }
  });
  
  const totalCount = results.length;
  const paginatedResults = results.slice(offset, offset + limit);
  
  return {
    results: paginatedResults,
    totalCount,
    suggestions: getSearchSuggestions(query),
    filters: searchIndex.searchFilters
  };
}

// Get related content based on keywords and tags
export function getRelatedContent(
  currentItemId: string,
  limit = 5
): SearchResult[] {
  const currentItem = searchIndex.items.find(item => item.id === currentItemId);
  
  if (!currentItem) return [];
  
  const relatedItems = searchIndex.items
    .filter(item => item.id !== currentItemId)
    .map(item => {
      let score = 0;
      
      // Score based on shared keywords
      const sharedKeywords = item.keywords.filter(keyword => 
        currentItem.keywords.includes(keyword)
      );
      score += sharedKeywords.length * 3;
      
      // Score based on shared tags
      const sharedTags = item.tags.filter(tag => 
        currentItem.tags.includes(tag)
      );
      score += sharedTags.length * 2;
      
      // Score based on same category
      if (item.category === currentItem.category) {
        score += 5;
      }
      
      // Score based on same subcategory
      if (item.subcategory === currentItem.subcategory) {
        score += 3;
      }
      
      return {
        ...item,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return relatedItems as SearchResult[];
}

// Track search analytics
export function trackSearchAnalytics(query: string, resultCount: number, selectedResult?: SearchResult) {
  // This would integrate with your analytics service
  // Search Analytics: query, resultCount, selectedResult?.id, timestamp logged
}

// Get popular searches (mock implementation)
export function getPopularSearches(limit = 10): string[] {
  // This would come from your analytics data
  return [
    'fair prensipleri',
    'metadata',
    'zenodo',
    'değerlendirme',
    'lisans',
    'veri deposu',
    'doi',
    'anket verisi',
    'açık veri',
    'tubitak'
  ].slice(0, limit);
}

// Search history management
export class SearchHistory {
  private static readonly STORAGE_KEY = 'fairveri_search_history';
  private static readonly MAX_HISTORY = 20;
  
  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }
  
  static addToHistory(query: string) {
    if (typeof window === 'undefined' || !query.trim()) return;
    
    const history = this.getHistory();
    const normalizedQuery = query.trim().toLowerCase();
    
    // Remove existing occurrence
    const filteredHistory = history.filter(
      item => item.toLowerCase() !== normalizedQuery
    );
    
    // Add to beginning
    const newHistory = [query.trim(), ...filteredHistory].slice(0, this.MAX_HISTORY);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore storage errors
    }
  }
  
  static clearHistory() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  
  static removeFromHistory(query: string) {
    if (typeof window === 'undefined') return;
    
    const history = this.getHistory();
    const newHistory = history.filter(
      item => item.toLowerCase() !== query.toLowerCase()
    );
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore storage errors
    }
  }
}