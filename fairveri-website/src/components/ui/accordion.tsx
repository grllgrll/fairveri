'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const AccordionContext = React.createContext<{
  type: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (value: string | string[]) => void
}>({
  type: 'single',
  value: '',
  onValueChange: () => {},
})

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ 
    className, 
    type = 'single', 
    collapsible = false, 
    defaultValue = type === 'multiple' ? [] : '',
    value,
    onValueChange,
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value ?? defaultValue)
    
    const handleValueChange = React.useCallback((newValue: string | string[]) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [value, onValueChange])

    const currentValue = value ?? internalValue

    return (
      <AccordionContext.Provider value={{ type, value: currentValue, onValueChange: handleValueChange }}>
        <div className={cn("w-full", className)} ref={ref} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = "Accordion"

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "border-b border-border",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, disabled } as any)
          }
          return child
        })}
      </div>
    )
  }
)

AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value?: string
  disabled?: boolean
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { type, value: accordionValue, onValueChange } = React.useContext(AccordionContext)
    
    const isOpen = type === 'multiple' 
      ? Array.isArray(accordionValue) && accordionValue.includes(value!)
      : accordionValue === value

    const handleClick = () => {
      if (disabled || !value) return
      
      if (type === 'multiple') {
        const currentValues = Array.isArray(accordionValue) ? accordionValue : []
        const newValues = isOpen 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
        onValueChange(newValues)
      } else {
        onValueChange(isOpen ? '' : value)
      }
    }

    return (
      <button
        className={cn(
          "flex w-full items-center justify-between py-4 px-6 text-left font-medium transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 shrink-0" />
        </motion.div>
      </button>
    )
  }
)

AccordionTrigger.displayName = "AccordionTrigger"

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  disabled?: boolean
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { type, value: accordionValue } = React.useContext(AccordionContext)
    
    const isOpen = type === 'multiple' 
      ? Array.isArray(accordionValue) && accordionValue.includes(value!)
      : accordionValue === value

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "px-6 pb-4 pt-0 text-sm text-muted-foreground",
                className
              )}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

AccordionContent.displayName = "AccordionContent"

// Predefined Accordion Variants
export interface FAQAccordionProps {
  faqs: Array<{
    id: string
    question: string
    answer: string
    category?: string
  }>
  searchQuery?: string
}

export const FAQAccordion = ({ faqs, searchQuery = '' }: FAQAccordionProps) => {
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Accordion type="single" collapsible className="w-full">
      {filteredFaqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            <div>
              <div className="font-semibold">{faq.question}</div>
              {faq.category && (
                <div className="text-xs text-muted-foreground mt-1">
                  {faq.category}
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none">
              {faq.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export interface FeatureAccordionProps {
  features: Array<{
    id: string
    title: string
    description: string
    benefits: string[]
    icon?: React.ReactNode
  }>
}

export const FeatureAccordion = ({ features }: FeatureAccordionProps) => {
  return (
    <Accordion type="multiple" className="w-full">
      {features.map((feature) => (
        <AccordionItem key={feature.id} value={feature.id}>
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              {feature.icon}
              <div>
                <div className="font-semibold">{feature.title}</div>
                <div className="text-sm text-muted-foreground">
                  {feature.description}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm">{feature.description}</p>
              <div>
                <h4 className="font-medium mb-2">Benefits:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}