import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-cyan-500 hover:bg-cyan-600 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/50",
                destructive: "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]",
                outline: "border border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300",
                secondary: "bg-violet-600 text-white hover:bg-violet-700 shadow-[0_0_15px_rgba(139,92,246,0.4)]",
                ghost: "hover:bg-white/10 hover:text-white",
                link: "text-primary underline-offset-4 hover:underline",
                emergency: "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse-slow font-bold uppercase tracking-widest",
                glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-lg px-10 text-base",
                icon: "h-10 w-10",
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
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
