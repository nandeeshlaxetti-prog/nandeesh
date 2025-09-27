"use client";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { createContext, useContext, useMemo } from "react";

const AnimCtx = createContext({ enabled: true });
export function useAnim() { return useContext(AnimCtx); }

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  
  // Check environment variable for animations
  const envEnabled = process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS !== 'false';
  const active = envEnabled && !prefersReduced;
  
  const value = useMemo(() => ({ enabled: active }), [active]);

  return (
    <AnimCtx.Provider value={value}>
      <MotionConfig 
        reducedMotion={active ? "never" : "always"} 
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </AnimCtx.Provider>
  );
}

