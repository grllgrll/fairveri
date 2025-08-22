'use client'

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        pink: "border-transparent bg-pink-500 text-white hover:bg-pink-600",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// Category-specific badges
export function CategoryBadge({ category }: { category: string }) {
  const getVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'findable':
        return 'info'
      case 'accessible':
        return 'success'
      case 'interoperable':
        return 'warning'
      case 'reusable':
        return 'purple'
      case 'tool':
        return 'secondary'
      case 'resource':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getVariant(category)} className="capitalize">
      {category}
    </Badge>
  )
}

// Priority badges
export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const variants = {
    high: 'destructive',
    medium: 'warning',
    low: 'success',
  } as const

  return (
    <Badge variant={variants[priority]} className="capitalize">
      {priority}
    </Badge>
  )
}

// Status badges
export function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' | 'completed' }) {
  const variants = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    completed: 'info',
  } as const

  return (
    <Badge variant={variants[status]} className="capitalize">
      {status}
    </Badge>
  )
}

export { Badge, badgeVariants }