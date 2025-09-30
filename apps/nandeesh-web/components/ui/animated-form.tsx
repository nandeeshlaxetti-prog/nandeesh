"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/cn"
import { useAnim } from "../anim/MotionProvider"

interface AnimatedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  hasError?: boolean
  className?: string
}

export const AnimatedForm = React.forwardRef<HTMLFormElement, AnimatedFormProps>(
  ({ className, hasError = false, children, ...props }, ref) => {
    const { enabled } = useAnim()

    if (!enabled) {
      return (
        <form
          ref={ref}
          className={cn("space-y-6", className)}
          {...props}
        >
          {children}
        </form>
      )
    }

    return (
      <motion.form
        ref={ref}
        className={cn("space-y-6", className)}
        animate={hasError ? {
          x: [0, -6, 6, -3, 3, 0],
        } : {
          x: 0,
        }}
        transition={{
          duration: 0.28,
          ease: "easeInOut",
        }}
        {...props}
      >
        {children}
      </motion.form>
    )
  }
)
AnimatedForm.displayName = "AnimatedForm"

// Animated input with focus glide
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const { enabled } = useAnim()
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)

    React.useEffect(() => {
      setHasValue(!!props.value)
    }, [props.value])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    if (!enabled) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            className="text-sm font-medium text-gray-700 dark:text-gray-300 block"
            animate={{
              y: isFocused || hasValue ? -2 : 0,
              opacity: isFocused || hasValue ? 0.8 : 1,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
          >
            {label}
          </motion.label>
        )}
        <motion.input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{
            scale: 1.01,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          {...props}
        />
        {error && (
          <motion.p
            className="text-sm text-red-600 dark:text-red-400"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)
AnimatedInput.displayName = "AnimatedInput"
