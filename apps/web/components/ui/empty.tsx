import * as React from "react"
import { cn } from "@/lib/cn"
import { AlertCircle, FileText, Search } from "lucide-react"
import { Button } from "./button"

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon: Icon = FileText, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
        {...props}
      >
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} size="sm">
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
Empty.displayName = "Empty"

// Predefined empty states
const EmptySearch = React.forwardRef<HTMLDivElement, Omit<EmptyProps, 'icon' | 'title'>>(
  (props, ref) => (
    <Empty
      ref={ref}
      icon={Search}
      title="No results found"
      description="Try adjusting your search or filter criteria"
      {...props}
    />
  )
)
EmptySearch.displayName = "EmptySearch"

const EmptyError = React.forwardRef<HTMLDivElement, Omit<EmptyProps, 'icon' | 'title'>>(
  (props, ref) => (
    <Empty
      ref={ref}
      icon={AlertCircle}
      title="Something went wrong"
      description="There was an error loading the data. Please try again."
      {...props}
    />
  )
)
EmptyError.displayName = "EmptyError"

export { Empty, EmptySearch, EmptyError }
