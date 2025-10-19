export interface Car {
  id: string
  title: string
  price: number
  image: string
  year: number
  fuel: string
  km: number
  location: string
  isNew?: boolean
  isUrgent?: boolean
  hasDiscount?: boolean
  discountAmount?: string
  brand: string
  model: string
  publishDate: string
  listingDate: string
  seller: Seller
  images: string[]
  features: string[]
  description: string
  transmission: string
  seats: number
  engineSize: number
}

export interface Seller {
 uid: string; // Satıcının benzersiz kimliği
    name: string; // Satıcının adı
    type: string; // Satıcı tipi (bireysel, kurumsal)
    phone?: string; // Satıcının telefon numarası
    location?: string; // Satıcının konumu
    memberSince?: string; // Satıcının üye olduğu tarih
    verifiedSeller?: boolean; // Satıcının doğrulanmış olup olmadığı
    badges?: string[]; // Satıcının rozetleri (örneğin: "Yeni Üye", "Doğrulanmış")
    contactPreferences?: {
      allowDirectPhone: boolean; // Doğrudan telefonla iletişim izni
      allowPhoneMessaging: boolean; // Telefon mesajı ile iletişim izni
      allowWebsiteMessaging: boolean; // Web sitesi mesajı ile iletişim izni
    };
}

export interface CarFilters {
  priceRange?: [number, number]
  yearRange?: [number, number]
  transmissionTypes?: string[]
  fuelTypes?: string[]
  sellerTypes?: string[]
}

export interface SortOption {
  value: string
  label: string
}
