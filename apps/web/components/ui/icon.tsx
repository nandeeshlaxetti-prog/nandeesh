import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon
  size?: number | string
  className?: string
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 20, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        size={size}
        className={cn("shrink-0", className)}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon }
