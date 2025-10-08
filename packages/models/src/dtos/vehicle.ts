// Araç modeli
export interface Vehicle {
  id: number
  title: string
  price: string
  image: string
  year: string
  km: string
  fuel: string
  location: string
  featured?: boolean
  urgent?: boolean
  new?: boolean
  discount?: string | null
  dealerName?: string
  dealerLogo?: string
  sponsored?: boolean
}

// Galerici modeli
export interface Dealer {
  id: number
  name: string
  logo: string
  rating: number
  location: string
  phone: string
  website: string
  verified: boolean
  category?: string
  featured: boolean
}

// Yedek parça tedarikçisi modeli
export interface Supplier {
  id: number
  name: string
  logo: string
  rating: number
  location: string
  phone: string
  website: string
  verified: boolean
  category: string
  featured: boolean
}

// Blog yazısı modeli
export interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  category: string
}
