'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline' | 'cards'
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'pills' | 'underline' | 'cards'
}>({
  value: '',
  onValueChange: () => {},
  orientation: 'horizontal',
  variant: 'default',
})

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className, 
    defaultValue = '', 
    value, 
    onValueChange,
    orientation = 'horizontal',
    variant = 'default',
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value ?? defaultValue)
    
    const handleValueChange = React.useCallback((newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [value, onValueChange])

    const currentValue = value ?? internalValue

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, orientation, variant }}>
        <div 
          className={cn(
            "w-full",
            orientation === 'vertical' && "flex gap-4",
            className
          )} 
          ref={ref} 
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = "Tabs"

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation, variant } = React.useContext(TabsContext)
    
    const baseClasses = "relative flex gap-1 p-1"
    
    const variantClasses = {
      default: "bg-muted rounded-lg",
      pills: "bg-transparent",
      underline: "bg-transparent border-b border-border",
      cards: "bg-transparent",
    }
    
    const orientationClasses = {
      horizontal: "w-full",
      vertical: "flex-col w-auto min-w-[200px]",
    }

    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          orientationClasses[orientation],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabsList.displayName = "TabsList"

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { value: currentValue, onValueChange, orientation, variant } = React.useContext(TabsContext)
    const isActive = currentValue === value

    const baseClasses = "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: isActive
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:bg-background/50",
      pills: isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted",
      underline: isActive
        ? "text-foreground border-b-2 border-primary"
        : "text-muted-foreground hover:text-foreground",
      cards: isActive
        ? "bg-background border border-border shadow-sm"
        : "text-muted-foreground hover:bg-muted",
    }

    const orientationClasses = {
      horizontal: "min-w-[80px]",
      vertical: "w-full justify-start",
    }

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          orientationClasses[orientation],
          variant === 'underline' && "rounded-none border-b-2 border-transparent",
          className
        )}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        ref={ref}
        {...props}
      >
        {children}
        {variant === 'underline' && isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            layoutId="underline"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    )
  }
)

TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, forceMount, ...props }, ref) => {
    const { value: currentValue } = React.useContext(TabsContext)
    const isActive = currentValue === value

    if (!forceMount && !isActive) {
      return null
    }

    return (
      <motion.div
        className={cn(
          "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !isActive && "hidden",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        ref={ref}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

TabsContent.displayName = "TabsContent"

// Predefined Tab Variants
export interface CategoryTabsProps {
  categories: Array<{
    id: string
    name: string
    count?: number
    icon?: React.ReactNode
  }>
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} variant="pills">
      <TabsList className="grid w-full grid-cols-auto">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
            {category.icon}
            <span>{category.name}</span>
            {category.count !== undefined && (
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                {category.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export interface VerticalTabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
    disabled?: boolean
  }>
  defaultValue?: string
}

export const VerticalTabs = ({ tabs, defaultValue }: VerticalTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} orientation="vertical" variant="cards">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="flex-1">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export interface UnderlineTabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
    badge?: string | number
  }>
  defaultValue?: string
}

export const UnderlineTabs = ({ tabs, defaultValue }: UnderlineTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} variant="underline">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}