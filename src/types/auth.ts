export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}
