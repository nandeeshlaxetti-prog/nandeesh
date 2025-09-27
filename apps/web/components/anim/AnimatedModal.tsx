"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useAnim } from "./MotionProvider";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedModal({ isOpen, onClose, children, className = "" }: AnimatedModalProps) {
  const { enabled } = useAnim();
  
  if (!enabled) {
    return isOpen ? (
      <div className="fixed inset-0 bg-black/30" onClick={onClose}>
        <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl ${className}`} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/30" 
          onClick={onClose}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl ${className}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 40, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

