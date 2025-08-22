'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Tag, Clock, User, HelpCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SearchInput } from '@/components/ui/search'
import { cn } from '@/lib/utils'
import faqData from '@/data/faq.json'

// Helper function for tag colors - moved outside components for reusability
const getTagColor = (tag: string) => {
  const colors = {
    'fair': 'info',
    'open-data': 'success',
    'metadata': 'purple',
    'license': 'warning',
    'privacy': 'destructive',
    'technical': 'secondary',
    'cost': 'outline',
    'training': 'info'
  }
  return colors[tag as keyof typeof colors] || 'outline'
}

interface FAQSectionProps {
  className?: string
  showSearch?: boolean
  showCategories?: boolean
  maxItems?: number
  featured?: boolean
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  className, 
  showSearch = true, 
  showCategories = true, 
  maxItems,
  featured = false
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = faqData.faq.categories
  const allQuestions = categories.flatMap(category => 
    category.questions.map(q => ({ ...q, categoryId: category.id, categoryTitle: category.title }))
  )

  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = activeCategory === 'all' || question.categoryId === activeCategory
    
    return matchesSearch && matchesCategory
  }).slice(0, maxItems)

  const popularQuestions = allQuestions.filter(q => 
    ['fair-vs-open', 'minimum-requirements', 'benefits', 'license-choice', 'file-formats'].includes(q.id)
  )

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedItems(newExpanded)
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'general': return '❓'
      case 'technical': return '🔧'
      case 'legal': return '⚖️'
      case 'institutional': return '🏛️'
      default: return '📝'
    }
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {faqData.faq.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {faqData.faq.description}
        </p>
      </div>

      {/* Search */}
      {showSearch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Soru Ara
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Soru, cevap veya etiket ile ara..."
            />
          </CardContent>
        </Card>
      )}

      {/* Popular Questions */}
      {featured && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Popüler Sorular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {question.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant={getTagColor(tag)}
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {question.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories and Questions */}
      {showCategories ? (
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <span>{getCategoryIcon(category.id)}</span>
                  {category.title}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {filteredQuestions.length} soru bulundu
            </div>
            <Accordion type="single" collapsible>
              {filteredQuestions.map((question, index) => (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex-1">
                      <div className="font-semibold">{question.question}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {question.categoryTitle}
                        </Badge>
                        {question.tags?.slice(0, 2).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant={getTagColor(tag)}
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <QuestionContent question={question} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getCategoryIcon(category.id)}</span>
                <div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.questions.length} soru
                  </p>
                </div>
              </div>
              
              <Accordion type="single" collapsible>
                {category.questions.map((question, index) => (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex-1">
                        <div className="font-semibold">{question.question}</div>
                        {question.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {question.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant={getTagColor(tag)}
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <QuestionContent question={question} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} soru bulundu
          </div>
          <Accordion type="single" collapsible>
            {filteredQuestions.map((question, index) => (
              <AccordionItem key={question.id} value={question.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex-1">
                    <div className="font-semibold">{question.question}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {question.categoryTitle}
                      </Badge>
                      {question.tags?.slice(0, 2).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant={getTagColor(tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <QuestionContent question={question} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Arama kriterlerinize uygun soru bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}

// Question Content Component
const QuestionContent: React.FC<{ question: any }> = ({ question }) => {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <p>{question.answer}</p>
      </div>

      {/* Tips */}
      {question.tips && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-blue-800">💡 İpuçları</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {question.tips.map((tip: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist */}
      {question.checklist && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-green-800">✅ Kontrol Listesi</h4>
          <ul className="space-y-1 text-sm text-green-700">
            {question.checklist.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {question.benefits && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-purple-800">🎯 Faydalar</h4>
          <ul className="space-y-1 text-sm text-purple-700">
            {question.benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Costs */}
      {question.costs && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-yellow-800">💰 Maliyetler</h4>
          <div className="space-y-2 text-sm text-yellow-700">
            {Object.entries(question.costs).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Licenses */}
      {question.licenses && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-gray-800">📜 Lisanslar</h4>
          <div className="space-y-3 text-sm">
            {question.licenses.map((license: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">
                  {license.name}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{license.description}</p>
                  <p className="text-muted-foreground mt-1">{license.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {question.requirements && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-red-800">📋 Gereksinimler</h4>
          <ul className="space-y-1 text-sm text-red-700">
            {question.requirements.map((requirement: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tools */}
      {question.tools && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-indigo-800">🔧 Araçlar</h4>
          <div className="flex flex-wrap gap-2">
            {question.tools.map((tool: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recommended/Avoid Lists */}
      {question.recommended && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-green-800">✅ Önerilen</h4>
            <ul className="space-y-1 text-sm text-green-700">
              {question.recommended.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {question.avoid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-800">❌ Kaçınılacak</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {question.avoid.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Related Questions */}
      {question.relatedQuestions && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">İlgili Sorular</h4>
          <div className="flex flex-wrap gap-2">
            {question.relatedQuestions.map((relatedId: string, index: number) => (
              <Button key={index} variant="outline" size="sm" className="text-xs">
                {relatedId}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {question.tags && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Etiketler</h4>
          <div className="flex flex-wrap gap-1">
            {question.tags.map((tag: string, index: number) => (
              <Badge key={index} variant={getTagColor(tag)} className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FAQSection