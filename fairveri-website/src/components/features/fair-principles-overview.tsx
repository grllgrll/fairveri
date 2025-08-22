'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import fairPrinciplesData from '@/data/fair-principles.json'

interface FairPrinciplesOverviewProps {
  className?: string
  interactive?: boolean
  showProgress?: boolean
}

const FairPrinciplesOverview: React.FC<FairPrinciplesOverviewProps> = ({ 
  className, 
  interactive = true, 
  showProgress = true 
}) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('F')
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const principles = fairPrinciplesData.principles.items
  const summary = fairPrinciplesData.summary.items

  const toggleComplete = (itemId: string) => {
    if (!interactive) return
    
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const getCompletionPercentage = (principleId: string) => {
    const principle = principles.find(p => p.letter === principleId)
    if (!principle) return 0
    
    const totalItems = principle.principles.length
    const completedCount = principle.principles.filter(p => 
      completedItems.has(p.id)
    ).length
    
    return Math.round((completedCount / totalItems) * 100)
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {fairPrinciplesData.principles.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {fairPrinciplesData.principles.description}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item, index) => (
          <motion.div
            key={item.principle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedPrinciple === item.principle && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedPrinciple(item.principle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ 
                        backgroundColor: principles.find(p => p.letter === item.principle)?.color 
                      }}
                    >
                      {item.principle}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {principles.find(p => p.letter === item.principle)?.titleEn}
                      </Badge>
                    </div>
                  </div>
                </div>
                {showProgress && (
                  <div className="mt-3">
                    <Progress 
                      value={getCompletionPercentage(item.principle)}
                      className="h-2"
                      showPercentage={false}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {getCompletionPercentage(item.principle)}% tamamlandı
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed View */}
      <Tabs value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
        <TabsList className="grid w-full grid-cols-4">
          {principles.map((principle) => (
            <TabsTrigger 
              key={principle.letter} 
              value={principle.letter}
              className="flex items-center gap-2"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: principle.color }}
              >
                {principle.letter}
              </span>
              {principle.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {principles.map((principle) => (
          <TabsContent key={principle.letter} value={principle.letter}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: principle.color }}
                  >
                    {principle.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{principle.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {principle.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {principle.principles.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger 
                        className={cn(
                          "text-left hover:no-underline",
                          interactive && "cursor-pointer"
                        )}
                        onClick={() => interactive && toggleComplete(item.id)}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {interactive && (
                            <div 
                              className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5",
                                completedItems.has(item.id) 
                                  ? "bg-green-500 border-green-500 text-white" 
                                  : "border-gray-300"
                              )}
                            >
                              {completedItems.has(item.id) && "✓"}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {item.id}
                              </Badge>
                              <span className="font-semibold">{item.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 space-y-4">
                          {item.example && (
                            <div className="bg-muted p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">
                                {item.example.title}
                              </h4>
                              {item.example.code && (
                                <pre className="bg-background p-3 rounded border text-sm overflow-x-auto">
                                  <code>{item.example.code}</code>
                                </pre>
                              )}
                              {item.example.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {item.example.description}
                                </p>
                              )}
                              {item.example.fields && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Gerekli Alanlar:</h5>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {item.example.fields.map((field, index) => (
                                      <li key={index}>{field}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.example.platforms && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Platformlar:</h5>
                                  <div className="space-y-2">
                                    {Object.entries(item.example.platforms).map(([key, platforms]) => (
                                      <div key={key}>
                                        <span className="font-medium capitalize">{key}:</span>
                                        <span className="ml-2 text-sm">{platforms.join(', ')}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.example.protocols && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Protokoller:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {item.example.protocols.map((protocol, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {protocol}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.example.levels && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Erişim Seviyeleri:</h5>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {item.example.levels.map((level, index) => (
                                      <li key={index}>{level}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.example.formats && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Önerilen Formatlar:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {item.example.formats.map((format, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {format}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.example.vocabularies && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Kontrollü Kelime Dağarcıkları:</h5>
                                  <div className="space-y-2">
                                    {item.example.vocabularies.map((vocab, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {vocab.name}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          {vocab.description}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Overall Progress */}
      {showProgress && interactive && (
        <Card>
          <CardHeader>
            <CardTitle>Genel İlerleme</CardTitle>
            <CardDescription>
              FAIR prensiplerini uygulama konusundaki ilerlemeniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {principles.map((principle) => {
                const percentage = getCompletionPercentage(principle.letter)
                return (
                  <div key={principle.letter} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                          style={{ backgroundColor: principle.color }}
                        >
                          {principle.letter}
                        </div>
                        <span className="font-medium">{principle.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FairPrinciplesOverview