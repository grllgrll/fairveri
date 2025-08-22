'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { 
  Search, Filter, Grid, List, Star, ExternalLink, 
  CheckCircle, X, ArrowUpDown, Zap, Globe, 
  DollarSign, Users, Clock, Award, BookOpen 
} from 'lucide-react'
import toolsData from '@/data/tools.json'

interface Tool {
  id: string
  name: string
  fullName?: string
  description: string
  url: string
  features: string[]
  howToUse?: string[]
  sampleResult?: {
    findability: number
    accessibility: number
    interoperability: number
    reusability: number
    overall: number
  }
  type: string
  cost: string
  language: string
  discipline?: string
  suitableFor?: string[]
  technicalDetails?: {
    format?: string
    registry?: string
    resolver?: string
  }
  components?: string[]
  advantages?: string[]
  disadvantages?: string[]
  uploadProcess?: string[]
}

interface ToolCategory {
  id: string
  title: string
  description: string
  tools: Tool[]
}

interface EnhancedToolDirectoryProps {
  className?: string
  showComparison?: boolean
  defaultView?: 'grid' | 'list'
}

const EnhancedToolDirectory: React.FC<EnhancedToolDirectoryProps> = ({
  className,
  showComparison = true,
  defaultView = 'grid'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCost, setSelectedCost] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'comparison'>(defaultView)
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'popularity'>('name')
  const [comparisonTools, setComparisonTools] = useState<Set<string>>(new Set())
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})

  const categories: ToolCategory[] = toolsData.tools.categories
  const allTools: Tool[] = categories.flatMap(cat => cat.tools)

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(allTools.map(tool => tool.type)))
  const uniqueCosts = Array.from(new Set(allTools.map(tool => tool.cost)))
  const uniqueLanguages = Array.from(new Set(allTools.map(tool => tool.language)))

  // Filter and search tools
  const filteredTools = useMemo(() => {
    let filtered = allTools

    // Category filter
    if (selectedCategory !== 'all') {
      const category = categories.find(cat => cat.id === selectedCategory)
      filtered = category ? category.tools : []
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(tool => tool.type === selectedType)
    }

    // Cost filter
    if (selectedCost !== 'all') {
      filtered = filtered.filter(tool => tool.cost === selectedCost)
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(tool => tool.language === selectedLanguage)
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchLower)) ||
        tool.suitableFor?.some(suitable => suitable.toLowerCase().includes(searchLower))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          const ratingA = userRatings[a.id] || 0
          const ratingB = userRatings[b.id] || 0
          return ratingB - ratingA
        case 'popularity':
          return b.features.length - a.features.length
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, selectedType, selectedCost, selectedLanguage, sortBy, userRatings, allTools, categories])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedType('all')
    setSelectedCost('all')
    setSelectedLanguage('all')
  }

  const toggleComparison = (toolId: string) => {
    const newComparison = new Set(comparisonTools)
    if (newComparison.has(toolId)) {
      newComparison.delete(toolId)
    } else if (newComparison.size < 3) {
      newComparison.add(toolId)
    }
    setComparisonTools(newComparison)
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200'
      case 'freemium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'commercial': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'paid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'automated': return '🤖'
      case 'manual': return '📝'
      case 'semi-automated': return '⚡'
      case 'web-based': return '🌐'
      case 'desktop': return '💻'
      case 'cloud': return '☁️'
      case 'software': return '⚙️'
      default: return '🛠️'
    }
  }

  const renderStarRating = (toolId: string, interactive: boolean = false) => {
    const rating = userRatings[toolId] || 0
    const stars = []
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            interactive && "cursor-pointer",
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )}
          onClick={interactive ? () => setUserRatings(prev => ({ ...prev, [toolId]: i })) : undefined}
        />
      )
    }
    
    return <div className="flex items-center gap-1">{stars}</div>
  }

  const ToolCard: React.FC<{ tool: Tool; index: number }> = ({ tool, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getTypeIcon(tool.type)}</span>
                <Badge className={getCostColor(tool.cost)}>
                  {tool.cost === 'free' ? 'Ücretsiz' : 
                   tool.cost === 'freemium' ? 'Freemium' : 
                   tool.cost === 'commercial' ? 'Ticari' : 'Ücretli'}
                </Badge>
                {tool.language === 'tr' && (
                  <Badge variant="outline" className="text-xs">
                    🇹🇷 Türkçe
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mb-2">{tool.name}</CardTitle>
              {tool.fullName && (
                <p className="text-xs text-slate-500 mb-2">{tool.fullName}</p>
              )}
              <CardDescription className="line-clamp-2">
                {tool.description}
              </CardDescription>
            </div>
            {showComparison && (
              <Button
                variant={comparisonTools.has(tool.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleComparison(tool.id)}
                disabled={!comparisonTools.has(tool.id) && comparisonTools.size >= 3}
                className="ml-2"
              >
                {comparisonTools.has(tool.id) ? <CheckCircle className="h-4 w-4" /> : "Karşılaştır"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Features */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Özellikler</h4>
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {tool.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.features.length - 3} daha
                </Badge>
              )}
            </div>
          </div>

          {/* Sample Results */}
          {tool.sampleResult && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Örnek FAIR Skoru</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>F:</span>
                  <span className="font-medium">{tool.sampleResult.findability}%</span>
                </div>
                <div className="flex justify-between">
                  <span>A:</span>
                  <span className="font-medium">{tool.sampleResult.accessibility}%</span>
                </div>
                <div className="flex justify-between">
                  <span>I:</span>
                  <span className="font-medium">{tool.sampleResult.interoperability}%</span>
                </div>
                <div className="flex justify-between">
                  <span>R:</span>
                  <span className="font-medium">{tool.sampleResult.reusability}%</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Genel:</span>
                  <span>{tool.sampleResult.overall}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Suitable For */}
          {tool.suitableFor && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Uygun Olduğu Kişiler</h4>
              <ul className="text-xs space-y-1">
                {tool.suitableFor.slice(0, 2).map((suitable, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {suitable}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Değerlendirin:</span>
              {renderStarRating(tool.id, true)}
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Ziyaret Et
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ToolListItem: React.FC<{ tool: Tool; index: number }> = ({ tool, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(tool.type)}</span>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-1">{tool.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={getCostColor(tool.cost)}>
                  {tool.cost === 'free' ? 'Ücretsiz' : 
                   tool.cost === 'freemium' ? 'Freemium' : 
                   tool.cost === 'commercial' ? 'Ticari' : 'Ücretli'}
                </Badge>
                
                {tool.sampleResult && (
                  <div className="text-sm">
                    <span className="font-medium">FAIR: </span>
                    <span>{tool.sampleResult.overall}%</span>
                  </div>
                )}
                
                {renderStarRating(tool.id)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {showComparison && (
                <Button
                  variant={comparisonTools.has(tool.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleComparison(tool.id)}
                  disabled={!comparisonTools.has(tool.id) && comparisonTools.size >= 3}
                >
                  {comparisonTools.has(tool.id) ? <CheckCircle className="h-4 w-4" /> : "Karşılaştır"}
                </Button>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" aria-label={`${tool.title} - Aracı ziyaret et`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="sr-only">Ziyaret Et</span>
                  Ziyaret Et
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ComparisonView: React.FC = () => {
    const comparisonToolsList = Array.from(comparisonTools).map(id => 
      allTools.find(tool => tool.id === id)!
    ).filter(Boolean)

    if (comparisonToolsList.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <Award className="h-12 w-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Karşılaştırma için araç seçin</h3>
                <p className="text-slate-600 mt-2">
                  Araçları karşılaştırmak için "Karşılaştır" butonunu kullanarak 
                  en fazla 3 araç seçebilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Araç Karşılaştırması ({comparisonToolsList.length}/3)
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setComparisonTools(new Set())}
            disabled={comparisonToolsList.length === 0}
          >
            <X className="h-4 w-4 mr-2" />
            Temizle
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 p-3 text-left font-semibold">Özellik</th>
                {comparisonToolsList.map(tool => (
                  <th key={tool.id} className="border border-slate-200 p-3 text-center min-w-[200px]">
                    <div className="space-y-2">
                      <div className="font-semibold">{tool.name}</div>
                      <Badge className={getCostColor(tool.cost)}>
                        {tool.cost === 'free' ? 'Ücretsiz' : 
                         tool.cost === 'freemium' ? 'Freemium' : 
                         tool.cost === 'commercial' ? 'Ticari' : 'Ücretli'}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-3 font-medium">Açıklama</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3 text-sm">
                    {tool.description}
                  </td>
                ))}
              </tr>
              
              <tr className="bg-slate-25">
                <td className="border border-slate-200 p-3 font-medium">Tür</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getTypeIcon(tool.type)}
                      <span className="text-sm capitalize">{tool.type}</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border border-slate-200 p-3 font-medium">Dil</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3 text-center">
                    {tool.language === 'tr' ? '🇹🇷 Türkçe' : 
                     tool.language === 'en' ? '🇺🇸 İngilizce' : 
                     'Çoklu dil'}
                  </td>
                ))}
              </tr>

              {comparisonToolsList.some(tool => tool.sampleResult) && (
                <tr className="bg-slate-25">
                  <td className="border border-slate-200 p-3 font-medium">FAIR Skoru</td>
                  {comparisonToolsList.map(tool => (
                    <td key={tool.id} className="border border-slate-200 p-3">
                      {tool.sampleResult ? (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>F:</span><span>{tool.sampleResult.findability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>A:</span><span>{tool.sampleResult.accessibility}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>I:</span><span>{tool.sampleResult.interoperability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>R:</span><span>{tool.sampleResult.reusability}%</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-1 border-t">
                            <span>Genel:</span><span>{tool.sampleResult.overall}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Veri yok</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}

              <tr>
                <td className="border border-slate-200 p-3 font-medium">Özellikler</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3">
                    <div className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-25">
                <td className="border border-slate-200 p-3 font-medium">Değerlendirme</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3 text-center">
                    {renderStarRating(tool.id, true)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border border-slate-200 p-3 font-medium">Bağlantı</td>
                {comparisonToolsList.map(tool => (
                  <td key={tool.id} className="border border-slate-200 p-3 text-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ziyaret Et
                      </a>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Araç Arama ve Filtreleme
          </CardTitle>
          <CardDescription>
            FAIR değerlendirme araçlarını arayın ve filtreleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Araç ara... (örn: F-UJI, FAIR-Aware, otomatik)"
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

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      <span className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCost} onValueChange={setSelectedCost}>
                <SelectTrigger>
                  <SelectValue placeholder="Maliyet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Maliyetler</SelectItem>
                  {uniqueCosts.map(cost => (
                    <SelectItem key={cost} value={cost}>
                      {cost === 'free' ? 'Ücretsiz' : 
                       cost === 'freemium' ? 'Freemium' : 
                       cost === 'commercial' ? 'Ticari' : 'Ücretli'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Dil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Diller</SelectItem>
                  {uniqueLanguages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language === 'tr' ? '🇹🇷 Türkçe' : 
                       language === 'en' ? '🇺🇸 İngilizce' : 
                       'Çoklu dil'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">İsim</SelectItem>
                  <SelectItem value="rating">Değerlendirme</SelectItem>
                  <SelectItem value="popularity">Popülerlik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters and Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {filteredTools.length} araç bulundu
                {searchTerm && ` "${searchTerm}" için`}
              </div>
              
              <div className="flex items-center gap-2">
                {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || 
                  selectedCost !== 'all' || selectedLanguage !== 'all') && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Filtreleri Temizle
                  </Button>
                )}
                
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  {showComparison && (
                    <Button
                      variant={viewMode === 'comparison' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('comparison')}
                      className="rounded-l-none"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison Tools Indicator */}
            {comparisonTools.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {comparisonTools.size} araç karşılaştırma için seçildi
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('comparison')}
                  className="ml-auto"
                >
                  Karşılaştır
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tools Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'comparison' ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ComparisonView />
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredTools.map((tool, index) => (
              <ToolListItem key={tool.id} tool={tool} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {filteredTools.length === 0 && viewMode !== 'comparison' && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <Search className="h-12 w-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Sonuç bulunamadı</h3>
                <p className="text-slate-600 mt-2">
                  Aradığınız kriterlere uygun araç bulunamadı. Farklı filtreler deneyebilirsiniz.
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

export default EnhancedToolDirectory