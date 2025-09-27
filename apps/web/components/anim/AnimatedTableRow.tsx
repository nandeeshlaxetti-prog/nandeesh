"use client";
import { MDiv, fadeInUp } from "@/components/anim/motion";

interface AnimatedTableRowProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export default function AnimatedTableRow({ children, className = "", index = 0 }: AnimatedTableRowProps) {
  return (
    <tr className={className}>
      <td colSpan={100}>
        <MDiv 
          {...fadeInUp} 
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          {children}
        </MDiv>
      </td>
    </tr>
  );
}

