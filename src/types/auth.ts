export type UserRole = 'admin' | 'staff' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}
