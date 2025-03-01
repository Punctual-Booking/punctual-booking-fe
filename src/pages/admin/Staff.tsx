import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Plus, Mail, BadgeCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StaffModal } from '@/components/admin/StaffModal'
import { ScrollableTable } from '@/components/ui/scrollable-table'
import { StaffMember } from '@/types/staff'

// Extend the StaffMember type with additional properties needed for the UI
interface StaffMemberWithUI extends StaffMember {
  role: 'admin' | 'staff'
  joinDate?: string
  status?: 'active' | 'inactive'
}

export const StaffPage = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMemberWithUI | null>(
    null
  )

  // Mock data with additional fields
  const [staffMembers, setStaffMembers] = useState<StaffMemberWithUI[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      phone: '+351 912 345 678',
      specialties: ['Hair', 'Makeup'],
      services: ['Haircut', 'Styling'],
      yearsOfExperience: 5,
      isActive: true,
      joinDate: '2021-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'staff',
      phone: '+351 923 456 789',
      specialties: ['Nails', 'Skincare'],
      services: ['Manicure', 'Facial'],
      yearsOfExperience: 3,
      isActive: true,
      joinDate: '2022-03-10',
      status: 'active',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'staff',
      phone: '+351 934 567 890',
      specialties: ['Massage', 'Skincare'],
      services: ['Swedish Massage', 'Deep Tissue'],
      yearsOfExperience: 7,
      isActive: false,
      joinDate: '2020-06-22',
      status: 'inactive',
    },
    {
      id: '4',
      name: 'Robert Williams',
      email: 'robert@example.com',
      role: 'staff',
      phone: '+351 945 678 901',
      specialties: ['Hair', 'Beard'],
      services: ['Haircut', 'Beard Trim'],
      yearsOfExperience: 4,
      isActive: true,
      joinDate: '2021-11-05',
      status: 'active',
    },
    {
      id: '5',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'staff',
      phone: '+351 956 789 012',
      specialties: ['Makeup', 'Nails'],
      services: ['Wedding Makeup', 'Gel Nails'],
      yearsOfExperience: 6,
      isActive: true,
      joinDate: '2019-08-17',
      status: 'active',
    },
    {
      id: '6',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'staff',
      phone: '+351 967 890 123',
      specialties: ['Hair', 'Coloring'],
      services: ['Hair Coloring', 'Highlights'],
      yearsOfExperience: 8,
      isActive: false,
      joinDate: '2018-04-30',
      status: 'inactive',
    },
  ])

  const handleEdit = (staff: StaffMemberWithUI) => {
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
        <ScrollableTable dependencies={[staffMembers]}>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                {t('admin.staff.name')}
              </TableHead>
              <TableHead className="min-w-[200px]">
                {t('admin.staff.email')}
              </TableHead>
              <TableHead className="min-w-[120px]">
                {t('admin.staff.role')}
              </TableHead>
              <TableHead className="min-w-[250px]">
                {t('admin.staff.services')}
              </TableHead>
              <TableHead className="min-w-[120px]">
                {t('admin.customers.status')}
              </TableHead>
              <TableHead className="min-w-[100px] text-center">
                {t('admin.staff.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map(staff => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{staff.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="capitalize">{staff.role}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {staff.services?.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        staff.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                      }`}
                    >
                      <BadgeCheck
                        className={`h-3 w-3 ${
                          staff.status === 'active'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      />
                      {staff.status === 'active'
                        ? t('admin.customers.status_active')
                        : t('admin.customers.status_inactive')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
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
        </ScrollableTable>
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
