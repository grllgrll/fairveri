'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface SearchSuggestion {
  text: string;
  type: 'suggestion' | 'history' | 'popular';
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  query: string;
  selectedIndex: number;
  onSuggestionClick: (suggestion: string) => void;
  onClearHistory: () => void;
  popularSearches: string[];
}

export function SearchSuggestions({ 
  suggestions, 
  query, 
  selectedIndex, 
  onSuggestionClick, 
  onClearHistory,
  popularSearches 
}: SearchSuggestionsProps) {
  if (!query && suggestions.length === 0 && popularSearches.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
      >
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion.text}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
                  selectedIndex === index ? 'bg-muted' : ''
                }`}
                onClick={() => onSuggestionClick(suggestion.text)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {suggestion.type === 'history' ? '🕐' : 
                       suggestion.type === 'popular' ? '🔥' : '🔍'}
                    </span>
                    <span className="text-sm">
                      {query && suggestion.text.toLowerCase().includes(query.toLowerCase()) ? (
                        <span>
                          {suggestion.text.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === query.toLowerCase() ? 
                              <strong key={i} className="text-primary">{part}</strong> : 
                              part
                          )}
                        </span>
                      ) : (
                        suggestion.text
                      )}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type === 'history' ? 'Geçmiş' :
                     suggestion.type === 'popular' ? 'Popüler' : 'Öneri'}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Popular Searches (when no query) */}
        {!query && popularSearches.length > 0 && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Popüler Aramalar</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 6).map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSuggestionClick(search)}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  🔥 {search}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* History Actions */}
        {suggestions.some(s => s.type === 'history') && (
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Arama Geçmişini Temizle
            </Button>
          </div>
        )}

        {/* Quick Tips */}
        {!query && (
          <div className="p-3 border-t border-border bg-muted/20">
            <h4 className="text-sm font-medium mb-2">💡 Arama İpuçları</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• "FAIR prensipleri" - Temel bilgiler için</p>
              <p>• "metadata araçları" - Veri yönetimi araçları</p>
              <p>• "lisans seçimi" - Veri paylaşım rehberi</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}