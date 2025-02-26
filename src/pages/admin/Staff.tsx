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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StaffModal } from '@/components/admin/StaffModal'

interface StaffMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
  image?: string
}

export const StaffPage = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  // TODO: Replace with actual data from API
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    },
  ]

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff)
    setIsModalOpen(true)
  }

  const handleDelete = (staffId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete staff:', staffId)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('admin.staff.title')}
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.staff.addStaff')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                {t('admin.staff.name')}
              </TableHead>
              <TableHead>{t('admin.staff.email')}</TableHead>
              <TableHead>{t('admin.staff.role')}</TableHead>
              <TableHead className="w-[100px]">
                {t('admin.staff.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map(staff => (
              <TableRow key={staff.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.name}</span>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell className="capitalize">{staff.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(staff)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(staff.id)}
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

      <StaffModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStaff(null)
        }}
        staff={editingStaff}
      />
    </div>
  )
}

export default StaffPage
