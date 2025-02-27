import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Table } from '@/components/ui/table'

interface TableWrapperProps {
  children: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export const TableWrapper = ({
  children,
  title,
  description,
  action,
}: TableWrapperProps) => {
  return (
    <Card>
      {(title || action) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <Table>{children}</Table>
    </Card>
  )
}
