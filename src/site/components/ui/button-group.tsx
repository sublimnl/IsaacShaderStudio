import * as React from "react"
import { cn } from "@/site/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex rounded-md shadow-sm",
          "[&>button]:rounded-none [&>button]:border-r-0",
          "[&>button:first-child]:rounded-l-md",
          "[&>button:last-child]:rounded-r-md [&>button:last-child]:border-r",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
