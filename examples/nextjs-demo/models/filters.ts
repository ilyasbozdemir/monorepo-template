export interface CarFilters {
  priceRange?: [number, number]
  yearRange?: [number, number]
  mileageRange?: [number, number]
  damageTypes?: string[]
  transmissionTypes?: string[]
  vehicleTypes?: string[]
  sellerTypes?: string[]
  listingDates?: string[]
  specialListings?: string[]
  fuelTypes?: string[]
  search?: string
}

export interface SortOption {
  value: string
  label: string
}
