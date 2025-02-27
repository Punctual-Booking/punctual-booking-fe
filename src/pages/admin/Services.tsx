import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { ServiceModal } from '@/components/admin/ServiceModal'
import { Image } from '@/components/ui/image'
import { Service } from '@/types/services'
import { formatPrice } from '@/utils/format'

export const ServicesPage = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // TODO: Replace with actual data from API
  const services: Service[] = [
    {
      id: '1',
      name: 'Haircut',
      description: 'Basic haircut service',
      price: 30,
      image: 'https://placehold.co/100x100',
    },
  ]

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleDelete = (serviceId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete service:', serviceId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('admin.services.title')}
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.services.addService')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.services.image')}</TableHead>
              <TableHead>{t('admin.services.name')}</TableHead>
              <TableHead>{t('admin.services.description')}</TableHead>
              <TableHead>{t('admin.services.price')}</TableHead>
              <TableHead className="w-[100px]">
                {t('admin.services.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map(service => (
              <TableRow key={service.id}>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ServiceModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingService(null)
        }}
        service={editingService}
      />
    </div>
  )
}

export default ServicesPage
