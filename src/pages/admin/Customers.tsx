import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Customer {
  id: string
  name: string
  email: string
  createdAt: string
  status: 'active' | 'inactive'
}

export const CustomersPage = () => {
  const { t } = useTranslation()

  // TODO: Replace with actual data from API
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-03-20',
      status: 'active',
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('admin.customers.title')}
      </h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                {t('admin.customers.name')}
              </TableHead>
              <TableHead>{t('admin.customers.email')}</TableHead>
              <TableHead>{t('admin.customers.status')}</TableHead>
              <TableHead className="text-right">
                {t('admin.customers.createdAt')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{customer.name}</span>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {t(`admin.customers.status_${customer.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CustomersPage
