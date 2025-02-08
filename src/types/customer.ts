export interface Customer {
  id: string
  name: string
  email: string
  createdAt: string
  status: 'active' | 'inactive'
}
