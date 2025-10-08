// Vehicle interfaces
export interface VehicleBase {
  id: string
  title: string
}

export interface SecondHandVehicle extends VehicleBase {
  year: number
  price: string
  km: number
}

export interface NewVehicle extends VehicleBase {
  price: string
}

// Category interfaces
export interface VehicleCategory {
  id: string
  name: string
  count: number
}

// Dealership interfaces
export interface Dealership {
  id: string
  name: string
  location: string
  rating: number
}

// Search data interface
export interface SearchData {
  secondHand: SecondHandVehicle[]
  categories: VehicleCategory[]
  newVehicles: NewVehicle[]
  dealerships: Dealership[]
}
