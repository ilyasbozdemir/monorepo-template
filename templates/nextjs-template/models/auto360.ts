export interface ServiceCategory {
  id: string
  title: string
  description: string
  icon: string
  slug: string
  image?: string
  featured?: boolean
}

export interface ServicePackage {
  id: string
  categoryId: string
  title: string
  description: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
}

export interface ServiceProvider {
  id: string
  name: string
  description: string
  logo?: string
  address: string
  phone: string
  email: string
  website?: string
  rating: number
  reviewCount: number
  categories: string[]
  workingHours: {
    days: string
    hours: string
  }[]
  featured?: boolean
}

export interface Product {
  id: string
  categoryId: string
  name: string
  description: string
  brand: string
  price: number
  currency: string
  image?: string
  rating: number
  reviewCount: number
  inStock: boolean
  featured?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Appointment {
  id: string
  serviceId: string
  providerId: string
  date: string
  time: string
  customerName: string
  customerPhone: string
  customerEmail: string
  vehicleMake: string
  vehicleModel: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}
