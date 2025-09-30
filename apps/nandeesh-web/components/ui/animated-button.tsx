"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button, ButtonProps, buttonVariants } from "./button"
import { cn } from "@/lib/cn"
import { useAnim } from "../anim/MotionProvider"

interface AnimatedButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const { enabled } = useAnim()

    if (!enabled) {
      return (
        <Button
          ref={ref}
          className={className}
          variant={variant}
          size={size}
          {...props}
        >
          {children}
        </Button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

// Icon button with rotation animation
interface AnimatedIconButtonProps extends AnimatedButtonProps {
  icon: React.ReactNode
  rotateOnHover?: boolean
}

export const AnimatedIconButton = React.forwardRef<HTMLButtonElement, AnimatedIconButtonProps>(
  ({ className, icon, rotateOnHover = false, children, ...props }, ref) => {
    const { enabled } = useAnim()

    if (!enabled) {
      return (
        <Button
          ref={ref}
          className={className}
          size="icon"
          {...props}
        >
          {icon}
        </Button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant: "ghost", size: "icon", className }))}
        whileHover={{ 
          scale: 1.02,
          rotate: rotateOnHover ? 2 : 0,
          y: rotateOnHover ? -1 : 0
        }}
        whileTap={{ 
          scale: 0.98,
          rotate: rotateOnHover ? -1 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {icon}
      </motion.button>
    )
  }
)
AnimatedIconButton.displayName = "AnimatedIconButton"

// Success button that morphs to checkmark
interface SuccessButtonProps extends AnimatedButtonProps {
  onSuccess?: () => void
  successDuration?: number
}

export const SuccessButton = React.forwardRef<HTMLButtonElement, SuccessButtonProps>(
  ({ className, children, onSuccess, successDuration = 800, ...props }, ref) => {
    const { enabled } = useAnim()
    const [isSuccess, setIsSuccess] = React.useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) {
        props.onClick(e)
      }
      
      if (enabled && onSuccess) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          onSuccess()
        }, successDuration)
      } else if (onSuccess) {
        onSuccess()
      }
    }

    if (!enabled) {
      return (
        <Button
          ref={ref}
          className={className}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ className }))}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isSuccess ? { 
          backgroundColor: "rgb(34, 197, 94)", // green-500
          color: "white"
        } : {}}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        <motion.div
          animate={isSuccess ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isSuccess ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, delay: isSuccess ? 0.1 : 0 }}
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={isSuccess ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.4, delay: isSuccess ? 0.2 : 0 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
      </motion.button>
    )
  }
)
SuccessButton.displayName = "SuccessButton"
