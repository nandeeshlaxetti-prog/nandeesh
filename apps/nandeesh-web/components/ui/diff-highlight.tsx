"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/cn"
import { useAnim } from "../anim/MotionProvider"

interface DiffHighlightProps {
  children: React.ReactNode
  className?: string
  highlightColor?: string
  duration?: number
}

export const DiffHighlight = React.forwardRef<HTMLDivElement, DiffHighlightProps>(
  ({ children, className, highlightColor = "rgb(59, 130, 246)", duration = 300 }, ref) => {
    const { enabled } = useAnim()
    const [shouldHighlight, setShouldHighlight] = React.useState(false)

    React.useEffect(() => {
      if (enabled) {
        setShouldHighlight(true)
        const timer = setTimeout(() => {
          setShouldHighlight(false)
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [enabled, duration])

    if (!enabled) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        animate={{
          backgroundColor: shouldHighlight 
            ? `${highlightColor}20` // 20% opacity
            : "transparent",
        }}
        transition={{
          duration: duration / 1000,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    )
  }
)
DiffHighlight.displayName = "DiffHighlight"

// Table cell wrapper with diff highlight
interface AnimatedTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  highlightOnChange?: boolean
  highlightColor?: string
}

export const AnimatedTableCell = React.forwardRef<HTMLTableCellElement, AnimatedTableCellProps>(
  ({ className, children, highlightOnChange = false, highlightColor, ...props }, ref) => {
    const { enabled } = useAnim()
    const [prevChildren, setPrevChildren] = React.useState(children)

    React.useEffect(() => {
      if (enabled && highlightOnChange && prevChildren !== children) {
        setPrevChildren(children)
      }
    }, [children, prevChildren, enabled, highlightOnChange])

    if (!enabled || !highlightOnChange) {
      return (
        <td ref={ref} className={className} {...props}>
          {children}
        </td>
      )
    }

    return (
      <td ref={ref} className={className} {...props}>
        <DiffHighlight highlightColor={highlightColor}>
          {children}
        </DiffHighlight>
      </td>
    )
  }
)
AnimatedTableCell.displayName = "AnimatedTableCell"

// Row animation for add/remove
interface AnimatedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isNew?: boolean
  isRemoving?: boolean
}

export const AnimatedTableRow = React.forwardRef<HTMLTableRowElement, AnimatedTableRowProps>(
  ({ className, children, isNew = false, isRemoving = false, ...props }, ref) => {
    const { enabled } = useAnim()

    if (!enabled) {
      return (
        <tr ref={ref} className={className} {...props}>
          {children}
        </tr>
      )
    }

    return (
      <motion.tr
        ref={ref}
        className={className}
        initial={isNew ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={isRemoving ? { opacity: 0, y: -6 } : false}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        layout
        {...props}
      >
        {children}
      </motion.tr>
    )
  }
)
AnimatedTableRow.displayName = "AnimatedTableRow"
