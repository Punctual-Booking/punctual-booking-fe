export interface Service {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface ServiceModalProps {
  open: boolean
  onClose: () => void
  service?: Service | null
}
