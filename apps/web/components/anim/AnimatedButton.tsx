"use client";
import { MButton, hoverScale } from "@/components/anim/motion";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function AnimatedButton({ className = "", ...props }: AnimatedButtonProps) {
  return (
    <MButton 
      {...hoverScale} 
      className={`rounded-lg px-3 py-2 transition-colors ${className}`} 
      {...props} 
    />
  );
}




