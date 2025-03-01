export interface Service {
  id: string
  name: string
  description: string
  price: number
  image?: string
}

export interface ServicePartial {
  id: string
  name?: string
  description?: string
  price?: number
  image?: string
}
