'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/lib/search-utils';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

export function SearchResults({ results, query, isLoading, onResultClick }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>"{query}" için sonuç bulunamadı.</p>
        <p className="text-sm mt-2">Farklı anahtar kelimeler deneyin veya filtreleri kontrol edin.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        {results.length} sonuç bulundu
      </div>
      
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={result.url}>
            <Card 
              className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onResultClick(result)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {result.type === 'principle' ? 'Prensip' :
                       result.type === 'tool' ? 'Araç' :
                       result.type === 'example' ? 'Örnek' :
                       result.type === 'faq' ? 'SSS' :
                       result.type === 'resource' ? 'Kaynak' :
                       result.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {result.description}
                  </p>
                  
                  {result.matches && result.matches.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Eşleşen: {result.matches.join(', ')}
                    </div>
                  )}
                </div>
                
                {result.score && (
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      %{Math.round(result.score * 100)}
                    </Badge>
                    {result.category && (
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary" 
                      className="text-xs px-2 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {result.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{result.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}