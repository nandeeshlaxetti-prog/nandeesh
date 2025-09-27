"use client"

import * as React from "react"
import { ToastContainer, useToast } from "./toast"

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, removeToast } = useToast()

  return (
    <ToastContext.Provider value={{ toasts, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Create context for toast
const ToastContext = React.createContext<{
  toasts: any[]
  removeToast: (id: string) => void
}>({
  toasts: [],
  removeToast: () => {},
})

// Hook to use toast context
export function useToastContext() {
  return React.useContext(ToastContext)
}
