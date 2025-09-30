"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useAnim } from "./MotionProvider"

interface StaggeredListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right"
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 8 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } },
}

export function StaggeredList({ 
  children, 
  className = "",
  staggerDelay = 0.06,
  direction = "up"
}: StaggeredListProps) {
  const { enabled } = useAnim()

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = directionVariants[direction]

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      transition={{
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Specialized components for common use cases
export function StaggeredGrid({ children, className = "", ...props }: Omit<StaggeredListProps, "direction">) {
  return (
    <StaggeredList className={`grid gap-4 ${className}`} {...props}>
      {children}
    </StaggeredList>
  )
}

export function StaggeredCards({ children, className = "", ...props }: Omit<StaggeredListProps, "direction">) {
  return (
    <StaggeredList className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
      {children}
    </StaggeredList>
  )
}
