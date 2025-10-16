import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]",
  {
    variants: {
      variant: {
        default: "text-black bg-green-400 border border-green-400 hover:bg-green-300 hover:-translate-y-0.5 focus:ring-green-400/30",
        destructive: "text-red-400 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:-translate-y-0.5 focus:ring-red-400/30",
        outline: "text-green-400 bg-transparent border border-green-400/20 hover:bg-green-400/10 hover:-translate-y-0.5 focus:ring-green-400/30",
        secondary: "text-white bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-black/80 hover:border-green-400/20 hover:-translate-y-0.5 focus:ring-green-400/30",
        ghost: "text-white/70 bg-transparent border border-transparent hover:bg-green-400/10 hover:text-green-400 hover:-translate-y-0.5 focus:ring-green-400/30",
        link: "text-green-400 underline-offset-4 hover:underline bg-transparent border-none p-0 min-h-auto",
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-xs min-h-[36px]",
        lg: "px-8 py-4 text-base min-h-[52px]",
        xl: "px-10 py-5 text-lg min-h-[60px]",
        icon: "w-11 h-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }