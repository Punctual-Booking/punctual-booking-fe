export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  createdAt: string
  status: CustomerStatus
}

export interface CustomerPartial {
  id: string
  name?: string
  email?: string
  phone?: string
  createdAt?: string
  status?: CustomerStatus
}
