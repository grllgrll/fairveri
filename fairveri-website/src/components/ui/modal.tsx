'use client'

import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  isOpen?: boolean // Backward compatibility
  onOpenChange?: (open: boolean) => void
  onClose?: () => void // Backward compatibility
  title?: string // Support for title prop
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const ModalContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    children,
    open,
    isOpen,
    onOpenChange,
    onClose,
    title,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    ...props
  }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    
    // Support both open/isOpen props for backward compatibility
    const modalOpen = open ?? isOpen ?? internalOpen
    
    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (open === undefined && isOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
      if (!newOpen) {
        onClose?.()
      }
    }, [open, isOpen, onOpenChange, onClose])

    // Handle escape key
    React.useEffect(() => {
      if (!closeOnEscape) return
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && modalOpen) {
          handleOpenChange(false)
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [modalOpen, handleOpenChange, closeOnEscape])

    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (modalOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [modalOpen])

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full m-4',
    }

    return (
      <ModalContext.Provider value={{ open: modalOpen, onOpenChange: handleOpenChange }}>
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeOnOverlayClick ? () => handleOpenChange(false) : undefined}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className={cn(
                  "relative w-full mx-4 bg-background rounded-lg shadow-lg border",
                  sizeClasses[size],
                  className
                )}
                ref={ref}
                {...props}
              >
                {title && (
                  <div className="p-6 pb-4">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </h2>
                  </div>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 z-10 h-8 w-8 p-0"
                    onClick={() => handleOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div className={title ? "p-6 pt-0" : "p-6"}>
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModalContext.Provider>
    )
  }
)

Modal.displayName = "Modal"

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col space-y-1.5 p-6 pb-4",
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

ModalHeader.displayName = "ModalHeader"

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        className={cn(
          "text-lg font-semibold leading-none tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

ModalTitle.displayName = "ModalTitle"

export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn(
          "text-sm text-muted-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)

ModalDescription.displayName = "ModalDescription"

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-6 pt-0",
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

ModalContent.displayName = "ModalContent"

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4",
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

ModalFooter.displayName = "ModalFooter"

// Predefined Modal Variants
export interface ConfirmModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export interface AlertModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  buttonText?: string
  variant?: 'default' | 'destructive' | 'warning'
}

export const AlertModal = ({
  open,
  onOpenChange,
  title,
  description,
  buttonText = "OK",
  variant = 'default',
}: AlertModalProps) => {
  const variantClasses = {
    default: 'text-foreground',
    destructive: 'text-red-600',
    warning: 'text-yellow-600',
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalHeader>
        <ModalTitle className={variantClasses[variant]}>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button 
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={() => onOpenChange?.(false)}
        >
          {buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// Custom hook for modal state
export const useModal = (initialOpen: boolean = false) => {
  const [open, setOpen] = React.useState(initialOpen)
  
  const openModal = React.useCallback(() => setOpen(true), [])
  const closeModal = React.useCallback(() => setOpen(false), [])
  const toggleModal = React.useCallback(() => setOpen(prev => !prev), [])
  
  return {
    open,
    openModal,
    closeModal,
    toggleModal,
    setOpen,
  }
}