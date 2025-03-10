import React from 'react'
import { Table } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useHorizontalScrollIndicator } from '@/hooks/useHorizontalScrollIndicator'

interface ScrollableTableProps
  extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapperClassName?: string
  showScrollIndicators?: boolean
  dependencies?: any[]
}

export const ScrollableTable = React.forwardRef<
  HTMLTableElement,
  ScrollableTableProps
>(
  (
    {
      className,
      wrapperClassName,
      showScrollIndicators = true,
      dependencies = [],
      ...props
    },
    ref
  ) => {
    const { scrollContainerRef, hasHorizontalScroll } =
      useHorizontalScrollIndicator({
        dependencies,
      })

    return (
      <div className={cn('relative', wrapperClassName)}>
        <div
          ref={scrollContainerRef}
          className="w-full overflow-auto scrollbar-thin"
        >
          <Table ref={ref} className={className} {...props} />
        </div>

        {showScrollIndicators && hasHorizontalScroll && (
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>
    )
  }
)

ScrollableTable.displayName = 'ScrollableTable'
