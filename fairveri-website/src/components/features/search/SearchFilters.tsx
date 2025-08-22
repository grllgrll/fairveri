'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { SearchFilters as SearchFiltersType } from '@/lib/search-utils';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onReset: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const contentTypes = [
  { value: 'principle', label: 'FAIR Prensipleri' },
  { value: 'tool', label: 'Araçlar' },
  { value: 'example', label: 'Örnekler' },
  { value: 'faq', label: 'SSS' },
  { value: 'resource', label: 'Kaynaklar' },
  { value: 'glossary', label: 'Sözlük' }
];

const difficultyLevels = [
  { value: 'beginner', label: 'Başlangıç' },
  { value: 'intermediate', label: 'Orta' },
  { value: 'advanced', label: 'İleri' }
];

const categories = [
  { value: 'findable', label: 'Bulunabilirlik' },
  { value: 'accessible', label: 'Erişilebilirlik' },
  { value: 'interoperable', label: 'Birlikte Çalışabilirlik' },
  { value: 'reusable', label: 'Yeniden Kullanılabilirlik' }
];

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isVisible, 
  onToggle 
}: SearchFiltersProps) {
  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onFiltersChange({ ...filters, types: updatedTypes });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const updatedCategories = checked 
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.types?.length) count += filters.types.length;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.difficulty) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sm"
        >
          🔍 Filtreler
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Temizle
          </Button>
        )}
      </div>

      {isVisible && (
        <div className="space-y-6 p-4 bg-muted/20 rounded-lg">
          {/* Content Types */}
          <div>
            <h4 className="font-medium text-sm mb-3">İçerik Türü</h4>
            <div className="space-y-2">
              {contentTypes.map(type => (
                <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.types?.includes(type.value) || false}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* FAIR Categories */}
          <div>
            <h4 className="font-medium text-sm mb-3">FAIR Kategorisi</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.categories?.includes(category.value) || false}
                    onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                  />
                  <span className="text-sm">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <h4 className="font-medium text-sm mb-3">Zorluk Seviyesi</h4>
            <Select
              value={filters.difficulty || ''}
              onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value || undefined })}
            >
              <option value="">Tümü</option>
              {difficultyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Aktif Filtreler</h4>
              <div className="flex flex-wrap gap-1">
                {filters.types?.map(type => (
                  <Badge 
                    key={type} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleTypeChange(type, false)}
                  >
                    {contentTypes.find(t => t.value === type)?.label} ×
                  </Badge>
                ))}
                {filters.categories?.map(category => (
                  <Badge 
                    key={category} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleCategoryChange(category, false)}
                  >
                    {categories.find(c => c.value === category)?.label} ×
                  </Badge>
                ))}
                {filters.difficulty && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onFiltersChange({ ...filters, difficulty: undefined })}
                  >
                    {difficultyLevels.find(d => d.value === filters.difficulty)?.label} ×
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}