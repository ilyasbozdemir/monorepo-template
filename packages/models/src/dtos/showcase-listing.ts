import type { CarListingDTO } from "./car-listing"

export interface ShowcaseListing {
  id: string
  carId: string
  carListing?: CarListingDTO
  priority: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  packageType: "basic" | "premium" | "platinum"
  price: {
    amount: number
    currency: string
  }
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentId?: string
  notes?: string
}
