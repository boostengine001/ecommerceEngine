
import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.ComponentProps<"input"> & {
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50",
          className
        )}
      >
        {startAdornment}
        <input
          type={type}
          className={cn(
            "h-full w-full bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "aria-[invalid=true]:!ring-destructive"
          )}
          ref={ref}
          {...props}
        />
        {endAdornment}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
