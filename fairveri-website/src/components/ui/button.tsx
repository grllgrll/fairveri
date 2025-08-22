import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "touch";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const buttonClasses = cn(
      // Base styles with mobile-first approach
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Mobile-friendly touch interactions
      "touch-manipulation select-none active:scale-95",
      // Minimum touch target size
      "min-h-touch min-w-touch",
      // Responsive text sizing
      "text-xs sm:text-sm",
      // Variant styles
      {
        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm hover:shadow-md": variant === "default",
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-sm hover:shadow-md": variant === "destructive",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80": variant === "outline",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70": variant === "secondary",
        "hover:bg-accent hover:text-accent-foreground active:bg-accent/80": variant === "ghost",
        "text-primary underline-offset-4 hover:underline active:no-underline": variant === "link",
      },
      // Size styles with mobile-first approach
      {
        "h-10 px-3 py-2 sm:h-11 sm:px-4": size === "default",
        "h-8 px-2 py-1 sm:h-9 sm:px-3": size === "sm",
        "h-11 px-6 py-2 sm:h-12 sm:px-8": size === "lg",
        "h-10 w-10 sm:h-11 sm:w-11": size === "icon",
        "h-12 px-4 py-3 sm:h-12 sm:px-6": size === "touch", // Extra large for mobile touch
      },
      className
    );

    if (asChild) {
      return React.cloneElement(props.children as React.ReactElement, {
        className: buttonClasses,
        ref,
        ...props,
      });
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };