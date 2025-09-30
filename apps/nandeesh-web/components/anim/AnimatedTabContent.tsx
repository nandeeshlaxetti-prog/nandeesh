"use client";
import { MDiv, fadeInUp } from "@/components/anim/motion";

interface AnimatedTabContentProps {
  children: React.ReactNode;
  className?: string;
  key?: string | number;
}

export default function AnimatedTabContent({ children, className = "", key }: AnimatedTabContentProps) {
  return (
    <MDiv 
      key={key}
      {...fadeInUp} 
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </MDiv>
  );
}





