import { UserRole } from '@/types/auth'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: Extract<UserRole, 'admin' | 'staff'>
  image?: string
}
