import { memo } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Image } from '@/components/ui/image'
import { Service } from '@/types/services'
import { formatPrice } from '@/utils/format'

interface ServiceTableRowProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export const ServiceTableRow = memo(
  ({ service, onEdit, onDelete }: ServiceTableRowProps) => {
    return (
      <TableRow>
        <TableCell>
          <Image
            src={service.image}
            alt={service.name}
            className="h-10 w-10 rounded-md object-cover"
            aspectRatio="square"
          />
        </TableCell>
        <TableCell className="font-medium">{service.name}</TableCell>
        <TableCell>{service.description}</TableCell>
        <TableCell>{formatPrice(service.price)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(service)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(service.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }
)

ServiceTableRow.displayName = 'ServiceTableRow'
