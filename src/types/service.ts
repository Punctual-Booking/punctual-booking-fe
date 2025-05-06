export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image?: string
  businessId: string
}

export interface ServicePartial {
  id: string
  name?: string
  description?: string
  price?: number
  duration?: number
  image?: string
  businessId?: string
}
