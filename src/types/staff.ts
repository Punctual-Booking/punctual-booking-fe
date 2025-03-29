export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  image?: string
  specialties: string[]
  services: string[]
  yearsOfExperience: number
  isActive: boolean
  businessId: string
}

export interface StaffMemberPartial {
  id: string
  name?: string
  email?: string
  phone?: string
  image?: string
  specialties?: string[]
  services?: string[]
  yearsOfExperience?: number
  isActive?: boolean
  businessId?: string
}
