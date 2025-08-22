'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookOpen, ExternalLink } from 'lucide-react'
import glossaryData from '@/data/glossary.json'
import Link from 'next/link'

interface GlossaryTooltipProps {
  term: string
  children: React.ReactNode
  className?: string
  showIcon?: boolean
  variant?: 'inline' | 'underline' | 'dotted'
}

interface GlossaryTerm {
  id: string
  term: string
  category: string
  definition: string
  detailedDefinition?: string
  examples?: string[]
  relatedTerms?: string[]
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  children,
  className,
  showIcon = false,
  variant = 'underline'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Find the term in glossary data
  const glossaryTerm: GlossaryTerm | undefined = glossaryData.glossary.terms.find(
    (t: any) => t.term.toLowerCase() === term.toLowerCase() || t.id === term.toLowerCase()
  )

  const categories = glossaryData.glossary.categories

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (triggerRef.current && isVisible) {
        const rect = triggerRef.current.getBoundingClientRect()
        const tooltipWidth = 320 // Estimated width
        const tooltipHeight = 200 // Estimated height
        
        let x = e.clientX + 10
        let y = e.clientY + 10
        
        // Adjust position if tooltip would go off screen
        if (x + tooltipWidth > window.innerWidth) {
          x = e.clientX - tooltipWidth - 10
        }
        
        if (y + tooltipHeight > window.innerHeight) {
          y = e.clientY - tooltipHeight - 10
        }
        
        setPosition({ x, y })
      }
    }

    if (isVisible) {
      document.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isVisible])

  const handleMouseEnter = () => {
    if (glossaryTerm) {
      setIsVisible(true)
    }
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat: any) => cat.id === categoryId)
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'inline'
      case 'dotted':
        return 'border-b border-dotted border-blue-500 cursor-help'
      case 'underline':
      default:
        return 'border-b border-blue-500 cursor-help hover:border-blue-700 transition-colors'
    }
  }

  if (!glossaryTerm) {
    // If term not found, render children as-is
    return <>{children}</>
  }

  const categoryInfo = getCategoryInfo(glossaryTerm.category)

  return (
    <>
      <span
        ref={triggerRef}
        className={cn(
          getVariantClasses(),
          "text-blue-600 hover:text-blue-800 transition-colors duration-200",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {showIcon && <BookOpen className="inline h-3 w-3 ml-1" />}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            <Card className="w-80 shadow-lg border-2 bg-white">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-slate-900">
                      {glossaryTerm.term}
                    </h4>
                    {categoryInfo && (
                      <Badge 
                        variant="secondary"
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${categoryInfo.color}15`,
                          color: categoryInfo.color,
                          borderColor: `${categoryInfo.color}30`
                        }}
                      >
                        {categoryInfo.icon} {categoryInfo.title}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Definition */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {glossaryTerm.definition}
                  </p>
                </div>

                {/* Examples */}
                {glossaryTerm.examples && glossaryTerm.examples.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm text-slate-800">Örnekler:</h5>
                    <div className="space-y-1">
                      {glossaryTerm.examples.slice(0, 2).map((example, index) => (
                        <div key={index} className="text-xs bg-slate-50 p-2 rounded border-l-2 border-blue-200">
                          <code className="text-slate-700">{example}</code>
                        </div>
                      ))}
                      {glossaryTerm.examples.length > 2 && (
                        <p className="text-xs text-slate-500 italic">
                          +{glossaryTerm.examples.length - 2} daha fazla örnek...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Related Terms */}
                {glossaryTerm.relatedTerms && glossaryTerm.relatedTerms.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm text-slate-800">İlgili Terimler:</h5>
                    <div className="flex flex-wrap gap-1">
                      {glossaryTerm.relatedTerms.slice(0, 4).map((relatedId, index) => {
                        const relatedTerm = glossaryData.glossary.terms.find((t: any) => t.id === relatedId)
                        return relatedTerm ? (
                          <Badge key={index} variant="outline" className="text-xs">
                            {relatedTerm.term}
                          </Badge>
                        ) : null
                      })}
                      {glossaryTerm.relatedTerms.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{glossaryTerm.relatedTerms.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="pt-2 border-t border-slate-200">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs pointer-events-auto"
                    asChild
                  >
                    <Link href={`/glossary#${glossaryTerm.id}`}>
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Detaylı Görüntüle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GlossaryTooltip