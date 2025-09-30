"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/cn"

export interface MotionButtonProps extends ButtonProps {
  children: React.ReactNode
  className?: string
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          ref={ref}
          className={cn(className)}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }
)
MotionButton.displayName = "MotionButton"

export { MotionButton }
