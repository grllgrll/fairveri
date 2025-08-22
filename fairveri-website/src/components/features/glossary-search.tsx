'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { Search, Filter, X, ExternalLink, BookOpen, Tag, Link2, History } from 'lucide-react'
import glossaryData from '@/data/glossary.json'

interface GlossaryTerm {
  id: string
  term: string
  category: string
  definition: string
  detailedDefinition?: string
  etymology?: string
  examples?: string[]
  relatedTerms?: string[]
  usage?: string
  references?: string[]
  subcategories?: string[]
  components?: string[]
  elements?: string[]
  technicalDetails?: {
    format?: string
    registry?: string
    resolver?: string
  }
  benefits?: string[]
  types?: Array<{
    name: string
    description: string
  }> | string[]
  principles?: string[]
}

interface GlossaryCategory {
  id: string
  title: string
  description: string
  color: string
  icon: string
}

const GlossarySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories: GlossaryCategory[] = glossaryData.glossary.categories
  const terms: GlossaryTerm[] = glossaryData.glossary.terms

  // Filter and search terms
  const filteredTerms = useMemo(() => {
    let filtered = terms

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory)
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(searchLower) ||
        term.definition.toLowerCase().includes(searchLower) ||
        term.detailedDefinition?.toLowerCase().includes(searchLower) ||
        term.examples?.some(example => example.toLowerCase().includes(searchLower)) ||
        term.relatedTerms?.some(related => {
          const relatedTerm = terms.find(t => t.id === related)
          return relatedTerm?.term.toLowerCase().includes(searchLower)
        })
      )
    }

    return filtered.sort((a, b) => a.term.localeCompare(b.term, 'tr'))
  }, [searchTerm, selectedCategory, terms])

  const getCategoryColor = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#64748b'
  }, [categories])

  const getCategoryInfo = useCallback((categoryId: string) => {
    return categories.find(c => c.id === categoryId)
  }, [categories])

  const getRelatedTermDetails = useCallback((termId: string) => {
    return terms.find(t => t.id === termId)
  }, [terms])

  const handleTermClick = (termId: string) => {
    setSelectedTerm(selectedTerm === termId ? null : termId)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedTerm(null)
  }

  const selectedTermDetails = selectedTerm ? terms.find(t => t.id === selectedTerm) : null

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Terim Arama
          </CardTitle>
          <CardDescription>
            Aradığınız terimi bulun veya kategoriye göre filtreleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Terim ara... (örn: FAIR, metadata, DOI)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Kategoriler:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  Tümü ({terms.length})
                </Badge>
                {categories.map((category) => {
                  const count = terms.filter(term => term.category === category.id).length
                  return (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        backgroundColor: selectedCategory === category.id ? category.color : undefined,
                        borderColor: category.color
                      }}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.title} ({count})
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Active Filters and Results Count */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {filteredTerms.length} terim bulundu
                {searchTerm && ` "${searchTerm}" için`}
                {selectedCategory !== 'all' && ` (${getCategoryInfo(selectedCategory)?.title} kategorisinde)`}
              </div>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Display */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredTerms.map((term, index) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  selectedTerm === term.id && "ring-2 ring-blue-500 shadow-lg"
                )}
                onClick={() => handleTermClick(term.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant="secondary"
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${getCategoryColor(term.category)}15`,
                            color: getCategoryColor(term.category),
                            borderColor: `${getCategoryColor(term.category)}30`
                          }}
                        >
                          {getCategoryInfo(term.category)?.icon} {getCategoryInfo(term.category)?.title}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-slate-900">
                        {term.term}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {term.definition}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <AnimatePresence>
                  {selectedTerm === term.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Detaylar</TabsTrigger>
                            <TabsTrigger value="examples">Örnekler</TabsTrigger>
                            <TabsTrigger value="related">İlgili Terimler</TabsTrigger>
                            <TabsTrigger value="technical">Teknik</TabsTrigger>
                          </TabsList>

                          <TabsContent value="details" className="space-y-4 mt-4">
                            {term.detailedDefinition && (
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Detaylı Açıklama
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {term.detailedDefinition}
                                </p>
                              </div>
                            )}

                            {term.etymology && (
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <History className="h-4 w-4" />
                                  Etimoloji
                                </h4>
                                <p className="text-sm text-slate-600 italic">
                                  {term.etymology}
                                </p>
                              </div>
                            )}

                            {term.usage && (
                              <div>
                                <h4 className="font-semibold mb-2">Kullanım Örneği</h4>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                  <p className="text-sm italic">"{term.usage}"</p>
                                </div>
                              </div>
                            )}

                            {(term.components || term.elements || term.principles) && (
                              <div>
                                <h4 className="font-semibold mb-2">Bileşenler</h4>
                                <div className="flex flex-wrap gap-1">
                                  {(term.components || term.elements || term.principles)?.map((item, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="examples" className="space-y-4 mt-4">
                            {term.examples && term.examples.length > 0 ? (
                              <div>
                                <h4 className="font-semibold mb-3">Örnekler</h4>
                                <div className="space-y-3">
                                  {term.examples.map((example, index) => (
                                    <div key={index} className="bg-slate-50 p-3 rounded-lg">
                                      <p className="text-sm font-mono">{example}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 italic">Bu terim için henüz örnek eklenmemiş.</p>
                            )}

                            {term.types && (
                              <div>
                                <h4 className="font-semibold mb-3">Türleri</h4>
                                <div className="space-y-2">
                                  {term.types.map((type, index) => (
                                    <div key={index} className="border-l-4 border-blue-200 pl-3">
                                      {typeof type === 'string' ? (
                                        <p className="text-sm">{type}</p>
                                      ) : (
                                        <div>
                                          <p className="font-medium text-sm">{type.name}</p>
                                          <p className="text-xs text-slate-600">{type.description}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="related" className="space-y-4 mt-4">
                            {term.relatedTerms && term.relatedTerms.length > 0 ? (
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Link2 className="h-4 w-4" />
                                  İlgili Terimler
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {term.relatedTerms.map((relatedId) => {
                                    const relatedTerm = getRelatedTermDetails(relatedId)
                                    if (!relatedTerm) return null
                                    
                                    return (
                                      <div
                                        key={relatedId}
                                        className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleTermClick(relatedId)
                                        }}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h5 className="font-medium text-sm">{relatedTerm.term}</h5>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                              {relatedTerm.definition}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-xs ml-2"
                                            style={{
                                              borderColor: getCategoryColor(relatedTerm.category),
                                              color: getCategoryColor(relatedTerm.category)
                                            }}
                                          >
                                            {getCategoryInfo(relatedTerm.category)?.icon}
                                          </Badge>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 italic">Bu terimle ilişkili başka terim bulunmuyor.</p>
                            )}
                          </TabsContent>

                          <TabsContent value="technical" className="space-y-4 mt-4">
                            {term.technicalDetails && (
                              <div>
                                <h4 className="font-semibold mb-3">Teknik Detaylar</h4>
                                <div className="space-y-2">
                                  {Object.entries(term.technicalDetails).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-sm font-medium capitalize">{key}:</span>
                                      <span className="text-sm text-slate-600">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {term.benefits && (
                              <div>
                                <h4 className="font-semibold mb-3">Avantajları</h4>
                                <ul className="space-y-1">
                                  {term.benefits.map((benefit, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {term.references && (
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Referanslar
                                </h4>
                                <div className="space-y-2">
                                  {term.references.map((reference, index) => (
                                    <div key={index} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                      {reference}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <Search className="h-12 w-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Sonuç bulunamadı</h3>
                <p className="text-slate-600 mt-2">
                  Aradığınız kriterlere uygun terim bulunamadı. Farklı anahtar kelimeler deneyebilir 
                  veya filtreleri değiştirebilirsiniz.
                </p>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GlossarySearch