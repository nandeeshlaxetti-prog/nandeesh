"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAnim } from "./MotionProvider";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enabled } = useAnim();
  
  if (!enabled) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ 
          duration: 0.18, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

