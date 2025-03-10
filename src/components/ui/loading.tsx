import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  /**
   * Optional text to display next to the spinner
   */
  text?: string
  /**
   * Size variant of the loading spinner
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Optional additional className
   */
  className?: string
  /**
   * Whether to center the loading spinner in its container
   */
  centered?: boolean
}

export function Loading({
  text = 'Loading...',
  size = 'md',
  className,
  centered = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const containerClasses = cn(
    'flex items-center gap-3',
    centered && 'justify-center',
    className
  )

  return (
    <div className={containerClasses}>
      <Loader2
        className={cn('animate-spin text-muted-foreground', sizeClasses[size])}
      />
      {text && (
        <p
          className={cn(
            'text-muted-foreground',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg font-medium'
          )}
        >
          {text}
        </p>
      )}
    </div>
  )
}
