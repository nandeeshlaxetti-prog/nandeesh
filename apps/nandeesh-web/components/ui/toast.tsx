"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/cn"
import { useAnim } from "../anim/MotionProvider"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps extends Toast {
  onRemove: (id: string) => void
}

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
}

const iconStyles = {
  success: "text-green-500 dark:text-green-400",
  error: "text-red-500 dark:text-red-400",
  warning: "text-yellow-500 dark:text-yellow-400",
  info: "text-blue-500 dark:text-blue-400",
}

export function ToastComponent({ id, type, title, description, duration = 5000, onRemove }: ToastProps) {
  const { enabled } = useAnim()
  const Icon = toastIcons[type]

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onRemove])

  if (!enabled) {
    return (
      <div className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-lg",
        toastStyles[type]
      )}>
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[type])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2,
      }}
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        toastStyles[type]
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[type])} />
      <div className="flex-1 min-w-0">
        <motion.p
          className="text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.p>
        {description && (
          <motion.p
            className="mt-1 text-sm opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.15 }}
          >
            {description}
          </motion.p>
        )}
      </div>
      <motion.button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <XMarkIcon className="h-4 w-4" />
      </motion.button>
      
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  )
}

// Toast container
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const { enabled } = useAnim()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast hook
export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: "success", title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: "error", title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: "warning", title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: "info", title, description, duration }),
  }

  return {
    toasts,
    toast,
    removeToast,
  }
}
