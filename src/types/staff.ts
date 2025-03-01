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
}
