'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Check, X, Minus, Filter, SortAsc, SortDesc } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchInput } from '@/components/ui/search'
import { cn } from '@/lib/utils'
import toolsData from '@/data/tools.json'

interface ToolComparisonProps {
  className?: string
  showFilters?: boolean
  defaultCategory?: string
}

const ToolComparison: React.FC<ToolComparisonProps> = ({ 
  className, 
  showFilters = true, 
  defaultCategory = 'assessment' 
}) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'cost'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState({
    cost: 'all',
    type: 'all',
    language: 'all'
  })

  const categories = toolsData.tools.categories
  const comparison = toolsData.comparison

  const filteredTools = categories.find(cat => cat.id === activeCategory)?.tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCost = filters.cost === 'all' || tool.cost === filters.cost
    const matchesType = filters.type === 'all' || tool.type === filters.type
    const matchesLanguage = filters.language === 'all' || tool.language === filters.language

    return matchesSearch && matchesCost && matchesType && matchesLanguage
  }) || []

  const sortedTools = [...filteredTools].sort((a, b) => {
    let aValue = ''
    let bValue = ''
    
    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'type':
        aValue = a.type || ''
        bValue = b.type || ''
        break
      case 'cost':
        aValue = a.cost || ''
        bValue = b.cost || ''
        break
    }
    
    const comparison = aValue.localeCompare(bValue)
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const toggleSort = (field: 'name' | 'type' | 'cost') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const renderFeatureIcon = (feature: string) => {
    if (feature.includes('🤖') || feature.includes('Otomatik')) return '🤖'
    if (feature.includes('📊') || feature.includes('metrik')) return '📊'
    if (feature.includes('🌐') || feature.includes('Web')) return '🌐'
    if (feature.includes('🆓') || feature.includes('Ücretsiz')) return '🆓'
    return '✨'
  }

  const getCostBadgeVariant = (cost: string) => {
    switch (cost) {
      case 'free': return 'success'
      case 'freemium': return 'warning'
      case 'commercial': return 'destructive'
      case 'paid': return 'destructive'
      default: return 'secondary'
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'automated': return 'info'
      case 'manual': return 'outline'
      case 'semi-automated': return 'purple'
      default: return 'secondary'
    }
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {toolsData.tools.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {toolsData.tools.description}
        </p>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Arama ve Filtreleme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Araç adı veya açıklama ile ara..."
            />
            
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Maliyet</label>
                <select
                  value={filters.cost}
                  onChange={(e) => setFilters({...filters, cost: e.target.value})}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="free">Ücretsiz</option>
                  <option value="freemium">Freemium</option>
                  <option value="commercial">Ticari</option>
                  <option value="paid">Ücretli</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tip</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="automated">Otomatik</option>
                  <option value="manual">Manuel</option>
                  <option value="semi-automated">Yarı-otomatik</option>
                  <option value="web-based">Web tabanlı</option>
                  <option value="desktop">Masaüstü</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Dil</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({...filters, language: e.target.value})}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="en">İngilizce</option>
                  <option value="tr">Türkçe</option>
                  <option value="multi">Çok dilli</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-center"
            >
              <div>
                <div className="font-semibold">{category.title}</div>
                <div className="text-xs text-muted-foreground">
                  {category.tools.length} araç
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-4">
              {/* Sort Controls */}
              <div className="flex items-center gap-2 justify-between">
                <p className="text-sm text-muted-foreground">
                  {sortedTools.length} araç bulundu
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sırala:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1"
                  >
                    Ad
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('type')}
                    className="flex items-center gap-1"
                  >
                    Tip
                    {sortBy === 'type' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSort('cost')}
                    className="flex items-center gap-1"
                  >
                    Maliyet
                    {sortBy === 'cost' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{tool.name}</CardTitle>
                            {tool.fullName && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {tool.fullName}
                              </p>
                            )}
                            <CardDescription className="mt-2">
                              {tool.description}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant={getCostBadgeVariant(tool.cost)}>
                            {tool.cost === 'free' ? 'Ücretsiz' : 
                             tool.cost === 'freemium' ? 'Freemium' : 
                             tool.cost === 'commercial' ? 'Ticari' : 
                             tool.cost === 'paid' ? 'Ücretli' : tool.cost}
                          </Badge>
                          <Badge variant={getTypeBadgeVariant(tool.type)}>
                            {tool.type === 'automated' ? 'Otomatik' :
                             tool.type === 'manual' ? 'Manuel' :
                             tool.type === 'semi-automated' ? 'Yarı-otomatik' : tool.type}
                          </Badge>
                          {tool.discipline && (
                            <Badge variant="outline">
                              {tool.discipline === 'general' ? 'Genel' : 
                               tool.discipline === 'biomedical' ? 'Biyomedikal' : tool.discipline}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Features */}
                        <div>
                          <h4 className="font-semibold mb-2">Özellikler</h4>
                          <div className="space-y-1">
                            {tool.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{renderFeatureIcon(feature)}</span>
                                {feature.replace(/🤖|📊|🌐|🆓|📝|👥|📚|🏢|🔬|🏅|🤝|🇦🇺|📋|🎯|📈|🧹|🔄|🤖|☁️|🏛️|🔐|🔍|🔗|📚|🗂️|🔗|🔄|💼/g, '').trim()}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How to Use */}
                        {tool.howToUse && (
                          <div>
                            <h4 className="font-semibold mb-2">Nasıl Kullanılır</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                              {tool.howToUse.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Sample Results */}
                        {tool.sampleResult && (
                          <div>
                            <h4 className="font-semibold mb-2">Örnek Sonuçlar</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span>Bulunabilirlik:</span>
                                <span className="font-medium">{tool.sampleResult.findability}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Erişilebilirlik:</span>
                                <span className="font-medium">{tool.sampleResult.accessibility}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Birlikte Çalışabilirlik:</span>
                                <span className="font-medium">{tool.sampleResult.interoperability}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Yeniden Kullanılabilirlik:</span>
                                <span className="font-medium">{tool.sampleResult.reusability}%</span>
                              </div>
                              <div className="flex justify-between col-span-2 pt-2 border-t">
                                <span className="font-semibold">Genel Skor:</span>
                                <span className="font-bold">{tool.sampleResult.overall}%</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Suitable For */}
                        {tool.suitableFor && (
                          <div>
                            <h4 className="font-semibold mb-2">Uygun Olduğu Durumlar</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {tool.suitableFor.map((situation, situationIndex) => (
                                <li key={situationIndex}>{situation}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-4 border-t">
                          <Button 
                            asChild 
                            className="w-full"
                            variant="outline"
                          >
                            <a 
                              href={tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Aracı Kullan
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {sortedTools.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Arama kriterlerinize uygun araç bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>{comparison.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {comparison.headers.map((header, index) => (
                    <th key={index} className="text-left p-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{row.tool}</td>
                    <td className="p-3">
                      {row.automated === true ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : row.automated === false ? (
                        <X className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-yellow-600" />
                      )}
                    </td>
                    <td className="p-3">
                      {row.manual === true ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </td>
                    <td className="p-3">
                      {row.free ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </td>
                    <td className="p-3">
                      {row.turkish ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{row.discipline}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ToolComparison