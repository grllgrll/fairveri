'use client'

import React from 'react'
import GlossaryTooltip from './glossary-tooltip'

interface GlossaryTextProps {
  children: string
  className?: string
  variant?: 'inline' | 'underline' | 'dotted'
}

/**
 * Automatically wraps glossary terms in text with tooltips
 * Usage: <GlossaryText>Bu metin FAIR prensipleri ve metadata hakkındadır.</GlossaryText>
 */
const GlossaryText: React.FC<GlossaryTextProps> = ({ 
  children, 
  className,
  variant = 'underline' 
}) => {
  // Common FAIR terms that should be automatically wrapped
  const glossaryTerms = [
    'FAIR',
    'metadata',
    'DOI',
    'ORCID',
    'ROR',
    'Dublin Core',
    'JSON-LD',
    'RDF',
    'SPARQL',
    'ontoloji',
    'ontology',
    'OWL',
    'Creative Commons',
    'CC0',
    'CC BY',
    'açık veri',
    'open data',
    'veri deposu',
    'repository',
    'API',
    'provenance',
    'köken bilgisi',
    'workflow',
    'iş akışı',
    'interoperability',
    'birlikte çalışabilirlik',
    'semantic web',
    'linked data',
    'kalıcı tanımlayıcı',
    'persistent identifier'
  ]

  const wrapGlossaryTerms = (text: string) => {
    const processedText = text
    const parts: (string | React.ReactElement)[] = []
    
    // Create a regex pattern for all glossary terms (case insensitive)
    const pattern = new RegExp(
      `\\b(${glossaryTerms.join('|')})\\b`,
      'gi'
    )
    
    let lastIndex = 0
    let match
    let keyIndex = 0

    while ((match = pattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add the glossary term wrapped in tooltip
      const term = match[0]
      parts.push(
        <GlossaryTooltip 
          key={`glossary-${keyIndex++}`}
          term={term.toLowerCase()}
          variant={variant}
        >
          {term}
        </GlossaryTooltip>
      )

      lastIndex = pattern.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const processedContent = wrapGlossaryTerms(children)

  return (
    <span className={className}>
      {processedContent}
    </span>
  )
}

export default GlossaryText