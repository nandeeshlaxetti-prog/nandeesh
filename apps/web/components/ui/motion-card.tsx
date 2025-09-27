"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/cn"

interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutId?: string
  onClick?: () => void
  children: React.ReactNode
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, layoutId, onClick, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layoutId={layoutId}
        className={cn(
          "rounded-lg border bg-card text-foreground shadow-sm transition-colors hover:shadow-md cursor-pointer",
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionCard.displayName = "MotionCard"

const MotionCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
MotionCardHeader.displayName = "MotionCardHeader"

const MotionCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
MotionCardTitle.displayName = "MotionCardTitle"

const MotionCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
MotionCardDescription.displayName = "MotionCardDescription"

const MotionCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
MotionCardContent.displayName = "MotionCardContent"

const MotionCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
MotionCardFooter.displayName = "MotionCardFooter"

export { 
  MotionCard, 
  MotionCardHeader, 
  MotionCardFooter, 
  MotionCardTitle, 
  MotionCardDescription, 
  MotionCardContent 
}