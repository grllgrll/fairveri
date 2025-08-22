'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
  animated?: boolean
  striped?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    showLabel = false, 
    showPercentage = false, 
    size = 'md', 
    variant = 'default', 
    animated = true, 
    striped = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    }
    
    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      destructive: 'bg-red-500',
      info: 'bg-blue-500',
    }

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {(showLabel || showPercentage) && (
          <div className="flex justify-between items-center mb-2">
            {showLabel && <span className="text-sm font-medium">Progress</span>}
            {showPercentage && <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizeClasses[size])}>
          <motion.div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              variantClasses[variant],
              striped && "bg-gradient-to-r from-current via-transparent to-current bg-[length:1rem_1rem] animate-pulse"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"

// Circular Progress Component
export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    size = 120, 
    strokeWidth = 8, 
    showLabel = true, 
    variant = 'default',
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const variantClasses = {
      default: 'text-primary',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      destructive: 'text-red-500',
      info: 'text-blue-500',
    }

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)} ref={ref} {...props}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-secondary"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            className={cn("transition-all duration-500", variantClasses[variant])}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)

CircularProgress.displayName = "CircularProgress"

// Multi-step Progress Component
export interface MultiStepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Array<{
    id: string
    title: string
    completed: boolean
    current?: boolean
  }>
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
}

export const MultiStepProgress = React.forwardRef<HTMLDivElement, MultiStepProgressProps>(
  ({ className, steps, variant = 'default', ...props }, ref) => {
    const completedSteps = steps.filter(step => step.completed).length
    const totalSteps = steps.length
    
    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      destructive: 'bg-red-500',
      info: 'bg-blue-500',
    }

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            Step {completedSteps + 1} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((completedSteps / totalSteps) * 100)}% Complete
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    step.completed
                      ? cn(variantClasses[variant], "text-white")
                      : step.current
                      ? cn("border-2", `border-${variant === 'default' ? 'primary' : variant}-500`, "text-primary")
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.completed ? "✓" : index + 1}
                </div>
                <span className="text-xs mt-1 text-center max-w-16 truncate">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-300",
                    step.completed ? variantClasses[variant] : "bg-secondary"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
)

MultiStepProgress.displayName = "MultiStepProgress"

export { Progress }