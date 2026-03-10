"use client"

import * as React from "react"

export function useToast() {
  const [toasts, setToasts] = React.useState<any[]>([])

  const toast = React.useCallback(({ ...props }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, ...props, open: true }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return {
    toast,
    toasts,
    dismiss: (id?: string) => setToasts((prev) => id ? prev.filter((t) => t.id !== id) : []),
  }
}