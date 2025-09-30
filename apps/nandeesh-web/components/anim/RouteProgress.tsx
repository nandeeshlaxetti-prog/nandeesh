"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Customize NProgress
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
})

export function RouteProgress() {
  const pathname = usePathname()

  useEffect(() => {
    // Start progress bar
    NProgress.start()

    // Complete progress bar after a short delay
    const timer = setTimeout(() => {
      NProgress.done()
    }, 100)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [pathname])

  return null
}

// CSS overrides for NProgress (add to globals.css)
export const nprogressStyles = `
  #nprogress .bar {
    background: rgb(var(--accent)) !important;
    height: 2px !important;
  }
  
  #nprogress .peg {
    box-shadow: 0 0 10px rgb(var(--accent)), 0 0 5px rgb(var(--accent)) !important;
  }
  
  #nprogress .spinner {
    display: none !important;
  }
  
  @media (prefers-reduced-motion: reduce) {
    #nprogress .bar {
      transition: none !important;
    }
  }
`
