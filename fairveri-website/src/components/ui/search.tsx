'use client'

import * as React from "react"
import { Search, X, Filter, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { createSafeHTMLProps } from '@/lib/html-sanitizer'
import { Button } from "./button"
import { Badge } from "./badge"

export interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  showClearButton?: boolean
  disabled?: boolean
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ 
    className, 
    value, 
    onValueChange, 
    placeholder = "Search...", 
    showClearButton = true,
    disabled = false,
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value ?? '')
    
    const currentValue = value ?? internalValue
    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    }

    const variantClasses = {
      default: 'border-input bg-background',
      ghost: 'border-transparent bg-transparent hover:bg-accent',
      outline: 'border-border bg-transparent',
    }

    return (
      <div className={cn("relative flex items-center", className)} {...props}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex w-full rounded-md border pl-10 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {showClearButton && currentValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 h-8 w-8 p-0 hover:bg-transparent"
            onClick={() => handleValueChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

// Advanced Search with Filters
export interface SearchFilter {
  id: string
  label: string
  type: 'select' | 'checkbox' | 'range'
  options?: Array<{ value: string; label: string }>
  value?: any
  onChange?: (value: any) => void
}

export interface AdvancedSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  filters?: SearchFilter[]
  showFilters?: boolean
  onToggleFilters?: () => void
  placeholder?: string
  sortOptions?: Array<{ value: string; label: string }>
  sortValue?: string
  onSortChange?: (value: string) => void
  sortDirection?: 'asc' | 'desc'
  onSortDirectionChange?: (direction: 'asc' | 'desc') => void
  activeFilters?: Array<{ id: string; label: string; value: string }>
  onRemoveFilter?: (filterId: string) => void
}

export const AdvancedSearch = React.forwardRef<HTMLDivElement, AdvancedSearchProps>(
  ({
    className,
    value,
    onValueChange,
    filters = [],
    showFilters = false,
    onToggleFilters,
    placeholder = "Search...",
    sortOptions = [],
    sortValue,
    onSortChange,
    sortDirection = 'asc',
    onSortDirectionChange,
    activeFilters = [],
    onRemoveFilter,
    ...props
  }, ref) => {
    return (
      <div className={cn("w-full space-y-4", className)} ref={ref} {...props}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput 
              value={value}
              onValueChange={onValueChange}
              placeholder={placeholder}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {sortOptions.length > 0 && (
              <div className="flex items-center gap-1">
                <select
                  value={sortValue || ''}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Sort by...</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortDirectionChange?.(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.id} variant="outline" className="flex items-center gap-1">
                {filter.label}: {filter.value}
                <button
                  onClick={() => onRemoveFilter?.(filter.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      <label className="text-sm font-medium">
                        {filter.label}
                      </label>
                      
                      {filter.type === 'select' && (
                        <select
                          value={filter.value || ''}
                          onChange={(e) => filter.onChange?.(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">All</option>
                          {filter.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {filter.type === 'checkbox' && (
                        <div className="space-y-2">
                          {filter.options?.map((option) => (
                            <label key={option.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={Array.isArray(filter.value) ? filter.value.includes(option.value) : false}
                                onChange={(e) => {
                                  const currentValues = Array.isArray(filter.value) ? filter.value : []
                                  const newValues = e.target.checked
                                    ? [...currentValues, option.value]
                                    : currentValues.filter(v => v !== option.value)
                                  filter.onChange?.(newValues)
                                }}
                                className="rounded border-input"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {filter.type === 'range' && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={filter.options?.[0]?.value || 0}
                            max={filter.options?.[1]?.value || 100}
                            value={filter.value || 0}
                            onChange={(e) => filter.onChange?.(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{filter.options?.[0]?.label || 'Min'}</span>
                            <span>{filter.value || 0}</span>
                            <span>{filter.options?.[1]?.label || 'Max'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AdvancedSearch.displayName = "AdvancedSearch"

// Search Results Component
export interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  results: Array<{
    id: string
    title: string
    description: string
    category?: string
    url?: string
    metadata?: Record<string, any>
  }>
  loading?: boolean
  query?: string
  onResultClick?: (result: any) => void
  emptyMessage?: string
}

export const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
  ({ 
    className, 
    results, 
    loading = false, 
    query = '',
    onResultClick,
    emptyMessage = "No results found.",
    ...props 
  }, ref) => {
    const highlightText = (text: string, query: string) => {
      if (!query) return text
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
    }

    if (loading) {
      return (
        <div className={cn("space-y-4", className)} ref={ref} {...props}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div className={cn("text-center py-8", className)} ref={ref} {...props}>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className={cn("space-y-4", className)} ref={ref} {...props}>
        {results.map((result) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onResultClick?.(result)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 
                  className="font-semibold text-lg mb-2"
                  {...createSafeHTMLProps(highlightText(result.title, query))}
                />
                <p 
                  className="text-muted-foreground text-sm mb-2"
                  {...createSafeHTMLProps(highlightText(result.description, query))}
                />
                {result.category && (
                  <Badge variant="outline" className="text-xs">
                    {result.category}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
)

SearchResults.displayName = "SearchResults"