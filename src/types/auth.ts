export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  USER = 'user',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}
