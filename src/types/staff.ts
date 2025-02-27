export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  image?: string
  specialties: string[]
  yearsOfExperience: number
  isActive: boolean
}

export interface StaffMemberPartial {
  id: string
  name?: string
  email?: string
  phone?: string
  image?: string
  specialties?: string[]
  yearsOfExperience?: number
  isActive?: boolean
}
