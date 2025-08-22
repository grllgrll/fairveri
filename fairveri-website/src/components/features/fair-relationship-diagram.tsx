'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Info, Lightbulb, Target, Zap } from 'lucide-react'

interface FairRelationshipDiagramProps {
  className?: string
  interactive?: boolean
  showDetails?: boolean
}

const FairRelationshipDiagram: React.FC<FairRelationshipDiagramProps> = ({
  className,
  interactive = true,
  showDetails = true
}) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [showAllConnections, setShowAllConnections] = useState(false)

  const principles = [
    {
      id: 'F',
      title: 'Findable',
      titleTr: 'Bulunabilirlik',
      color: '#3B82F6',
      position: { x: 200, y: 100 },
      icon: '🔍',
      description: 'Verilerin insanlar ve makineler tarafından kolayca bulunabilir olması',
      keyPoints: ['Benzersiz tanımlayıcılar', 'Zengin metadata', 'Aranabilir kayıtlar']
    },
    {
      id: 'A',
      title: 'Accessible',
      titleTr: 'Erişilebilirlik',
      color: '#10B981',
      position: { x: 400, y: 100 },
      icon: '🔓',
      description: 'Verilere güvenli ve sürdürülebilir erişim sağlanması',
      keyPoints: ['Standart protokoller', 'Kimlik doğrulama', 'Kalıcı metadata']
    },
    {
      id: 'I',
      title: 'Interoperable',
      titleTr: 'Birlikte Çalışabilirlik',
      color: '#8B5CF6',
      position: { x: 200, y: 300 },
      icon: '🔗',
      description: 'Verilerin diğer sistemlerle entegre edilebilir olması',
      keyPoints: ['Standart formatlar', 'Kontrollü kelime dağarcıkları', 'İlişkili veriler']
    },
    {
      id: 'R',
      title: 'Reusable',
      titleTr: 'Yeniden Kullanılabilirlik',
      color: '#F59E0B',
      position: { x: 400, y: 300 },
      icon: '♻️',
      description: 'Verilerin farklı ortamlarda yeniden kullanılabilir olması',
      keyPoints: ['Zengin dokümantasyon', 'Açık lisanslar', 'Köken bilgisi']
    }
  ]

  const connections = [
    {
      id: 'F-A',
      from: 'F',
      to: 'A',
      relationship: 'Bulunabilir veriler erişilebilir olmalıdır',
      description: 'Veriler bulunduktan sonra uygun protokoller ve yetkilendirme ile erişilebilir hale getirilmelidir.',
      strength: 'strong',
      examples: ['DOI ile erişim sağlama', 'API endpoint\'leri', 'Kalıcı URL\'ler']
    },
    {
      id: 'A-I',
      from: 'A',
      to: 'I',
      relationship: 'Erişilebilir veriler birlikte çalışabilir olmalıdır',
      description: 'Erişilen veriler standart formatlar ve protokoller kullanarak diğer sistemlerle entegre edilebilmelidir.',
      strength: 'strong',
      examples: ['JSON-LD formatı', 'REST API\'ler', 'Standart ontolojiler']
    },
    {
      id: 'I-R',
      from: 'I',
      to: 'R',
      relationship: 'Birlikte çalışabilen veriler yeniden kullanılabilir olmalıdır',
      description: 'Standart formatlar ve kelime dağarcıkları kullanılan veriler farklı bağlamlarda yeniden kullanılabilir.',
      strength: 'strong',
      examples: ['Açık standartlar', 'Metadata şemaları', 'Lisans bilgileri']
    },
    {
      id: 'R-F',
      from: 'R',
      to: 'F',
      relationship: 'Yeniden kullanılabilir veriler daha iyi bulunabilir olur',
      description: 'İyi dokümante edilmiş ve lisanslanmış veriler arama motorları tarafından daha kolay indekslenir.',
      strength: 'medium',
      examples: ['Schema.org markup', 'Kalite skorları', 'Kullanım örnekleri']
    },
    {
      id: 'F-I',
      from: 'F',
      to: 'I',
      relationship: 'Bulunabilirlik birlikte çalışabilirliği destekler',
      description: 'Standart metadata formatları hem bulunabilirliği hem de birlikte çalışabilirliği artırır.',
      strength: 'medium',
      examples: ['Dublin Core metadata', 'DataCite şeması', 'ORCID entegrasyonu']
    },
    {
      id: 'A-R',
      from: 'A',
      to: 'R',
      relationship: 'Erişilebilirlik yeniden kullanımı kolaylaştırır',
      description: 'Açık erişim politikaları ve uygun lisanslar verinin yeniden kullanımını teşvik eder.',
      strength: 'medium',
      examples: ['CC lisansları', 'Açık erişim politikaları', 'API dokümantasyonu']
    }
  ]

  const getConnectionPath = (from: string, to: string) => {
    const fromPrinciple = principles.find(p => p.id === from)
    const toPrinciple = principles.find(p => p.id === to)
    
    if (!fromPrinciple || !toPrinciple) return ''
    
    const fromX = fromPrinciple.position.x + 60
    const fromY = fromPrinciple.position.y + 60
    const toX = toPrinciple.position.x + 60
    const toY = toPrinciple.position.y + 60
    
    // Create curved path
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const curveOffset = 30
    
    return `M ${fromX} ${fromY} Q ${midX + curveOffset} ${midY - curveOffset} ${toX} ${toY}`
  }

  const handlePrincipleClick = (principleId: string) => {
    if (!interactive) return
    setSelectedPrinciple(selectedPrinciple === principleId ? null : principleId)
  }

  const getVisibleConnections = () => {
    if (showAllConnections) return connections
    if (selectedPrinciple) {
      return connections.filter(c => c.from === selectedPrinciple || c.to === selectedPrinciple)
    }
    return connections.filter(c => c.strength === 'strong')
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          FAIR Prensipleri İlişki Diyagramı
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          FAIR prensiplerinin birbirleriyle nasıl etkileşime girdiğini ve birbirlerini nasıl desteklediğini keşfedin
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            variant={showAllConnections ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllConnections(!showAllConnections)}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            {showAllConnections ? 'Temel İlişkiler' : 'Tüm İlişkiler'}
          </Button>
          <Badge variant="info" className="px-4 py-2">
            <Info className="h-4 w-4 mr-2" />
            İnteraktif Diyagram
          </Badge>
        </div>
      </div>

      {/* Diagram */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50">
        <CardContent className="p-8">
          <div className="relative">
            {/* SVG for connections */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ minHeight: '400px' }}
              viewBox="0 0 600 400"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#64748b"
                    opacity="0.6"
                  />
                </marker>
              </defs>
              
              <AnimatePresence>
                {getVisibleConnections().map((connection) => (
                  <motion.g
                    key={connection.id}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    exit={{ opacity: 0, pathLength: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <motion.path
                      d={getConnectionPath(connection.from, connection.to)}
                      stroke={connection.strength === 'strong' ? '#3b82f6' : '#64748b'}
                      strokeWidth={connection.strength === 'strong' ? 3 : 2}
                      fill="none"
                      opacity={hoveredConnection === connection.id ? 1 : 0.6}
                      markerEnd="url(#arrowhead)"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredConnection(connection.id)}
                      onMouseLeave={() => setHoveredConnection(null)}
                      style={{ pointerEvents: 'stroke' }}
                    />
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>

            {/* Principle nodes */}
            <div className="relative" style={{ minHeight: '400px' }}>
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.id}
                  className="absolute"
                  style={{
                    left: principle.position.x,
                    top: principle.position.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className={cn(
                      "relative group cursor-pointer",
                      interactive && "hover:scale-105 transition-transform duration-200"
                    )}
                    onClick={() => handlePrincipleClick(principle.id)}
                  >
                    <div
                      className={cn(
                        "w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-lg relative z-10",
                        selectedPrinciple === principle.id && "ring-4 ring-offset-2 ring-blue-500"
                      )}
                      style={{ backgroundColor: principle.color }}
                    >
                      <div className="text-2xl mb-1">{principle.icon}</div>
                      <div className="text-lg font-bold">{principle.id}</div>
                    </div>
                    
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                      <div className="font-semibold text-sm text-slate-900">
                        {principle.titleTr}
                      </div>
                      <div className="text-xs text-slate-600">
                        {principle.title}
                      </div>
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg max-w-xs text-center">
                        <div className="font-semibold mb-1">{principle.titleTr}</div>
                        <div className="text-xs">{principle.description}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected principle details */}
      <AnimatePresence>
        {selectedPrinciple && showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{ 
                      backgroundColor: principles.find(p => p.id === selectedPrinciple)?.color 
                    }}
                  >
                    {principles.find(p => p.id === selectedPrinciple)?.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">
                      {principles.find(p => p.id === selectedPrinciple)?.titleTr}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {principles.find(p => p.id === selectedPrinciple)?.title}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-slate-700">
                    {principles.find(p => p.id === selectedPrinciple)?.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                      <Target className="h-4 w-4" />
                      Temel Noktalar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {principles.find(p => p.id === selectedPrinciple)?.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                      <ArrowRight className="h-4 w-4" />
                      İlişkiler
                    </h4>
                    <div className="space-y-3">
                      {connections
                        .filter(c => c.from === selectedPrinciple || c.to === selectedPrinciple)
                        .map((connection) => (
                          <div key={connection.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant={connection.strength === 'strong' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {connection.from} → {connection.to}
                              </Badge>
                              <span className="text-sm font-medium text-slate-700">
                                {connection.relationship}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {connection.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {connection.examples.map((example, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection details */}
      <AnimatePresence>
        {hoveredConnection && showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="max-w-sm bg-slate-900 text-white border-slate-700">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <Badge variant="secondary" className="text-xs">
                      {connections.find(c => c.id === hoveredConnection)?.from} → {connections.find(c => c.id === hoveredConnection)?.to}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">
                    {connections.find(c => c.id === hoveredConnection)?.relationship}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {connections.find(c => c.id === hoveredConnection)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FairRelationshipDiagram