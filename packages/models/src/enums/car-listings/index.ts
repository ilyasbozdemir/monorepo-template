export enum ListingType {
  Sale = "sale", // Satılık
  Rent = "rent", // Kiralık
  Auction = "auction", // Açık artırma
  Lease = "lease", // Uzun dönem kiralama (leasa)
  Exchange = "exchange", // Takasa açık ilan
  Service = "service", // filo, servis vs.
  DailyRent = "daily_rent", // Günlük kiralama
  Other = "other", // Diğer
}

export type ListingStatus =
  | "active"
  | "inactive"
  | "draft"
  | "pending"
  | "awaiting_approval"
  | "sold"
  | "expired"
  | "rejected"
  | "removed";