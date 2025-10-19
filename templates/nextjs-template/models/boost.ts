// Boost paketi modeli
export interface Boost {
    id: string
    name: string
    description: string
    price: number
    currency: string
    icon: string
    type: "standard" | "premium" | "urgent" | "spotlight"
    features: string[]
    duration?: string
    badge?: string
    color?: string
  }
  
  // Kullanıcı boost paketi modeli
  export interface UserBoost extends Boost {
    purchaseDate: string
    expiryDate: string
    isActive: boolean
    usedOn?: string[] // Uygulandığı ilan ID'leri
  }
  