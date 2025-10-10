export interface Branch {
  id: string
  name: string
  city: string
  address: string
  phone: string
  workingHours: string
  services: Service[]
  coordinates: {
    lat: number
    lng: number
  }
  isActive: boolean
  description?: string
  images?: string[]
  staff?: Staff[]
  equipment?: Equipment[]
  reviews?: Review[]
  rating?: number
}

export interface City {
  id: string
  name: string
  branchCount: number
}

export interface Service {
  id: string
  name: string
  description?: string
  price?: number
  duration?: string
  isAvailable: boolean
}

export interface Staff {
  id: string
  name: string
  position: string
  image?: string
  experience?: string
}

export interface Equipment {
  id: string
  name: string
  description?: string
  image?: string
}

export interface Review {
  id: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  date: string
}

export interface Package {
  id: string
  title: string
  price: string
  originalPrice: string
  popular?: boolean
  services: string[]
  warranty: {
    months: number
    km: number
  }
}
