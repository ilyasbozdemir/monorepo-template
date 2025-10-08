// New car specific interface that extends the base Car interface
export interface NewCar {
  id: string
  brand: string
  model: string
  title: string
  year: number
  price: number
  bodyType: BodyType
  colors: CarColor[]
  engineOptions: EngineOption[]
  dimensions: Dimensions
  features: CarFeatures
  images: string[]
  description: string
  publishDate: string
}

export interface EngineOption {
  id: string
  name: string
  type: string // TDI, TFSI, etc.
  fuelType: string
  power: number // HP
  torque: number // Nm
  displacement: number // cc
  cylinders: number
  transmissionType: string
  driveType: string
  fuelConsumption: FuelConsumption
  emissions: number // g/km
  acceleration: number // 0-100 km/h in seconds
  topSpeed: number // km/h
  trim: string // S Line, Advanced, etc.
  price: number
}

export interface FuelConsumption {
  urban: number // L/100km
  extraUrban: number // L/100km
  combined: number // L/100km
}

export interface Dimensions {
  length: number // mm
  width: number // mm
  height: number // mm
  wheelbase: number // mm
  trunkVolume: number // L
  fuelTankCapacity: number // L
  weight: number // kg
  doors: number
  seats: number
}

export interface CarColor {
  id: string
  name: string
  colorCode: string
  type: "metallic" | "solid" | "pearl"
  imageUrl: string
  price: number // Additional cost for this color
}

export type BodyType = "sedan" | "hatchback" | "station-wagon" | "suv" | "coupe" | "convertible" | "mpv" | "commercial"

// Reusing the CarFeatures interface from the original model
export interface CarFeatures {
  interior: FeatureItem[]
  exterior: FeatureItem[]
  entertainment: FeatureItem[]
  safety: FeatureItem[]
  hardware: FeatureGroup[]
}

export interface FeatureGroup {
  name: string
  items: FeatureItem[]
}

export interface FeatureItem {
  name: string
  value: boolean
  info?: string
  link?: string
}

// Filters specific to new cars
export interface NewCarFilters {
  priceRange?: [number, number]
  brands?: string[]
  models?: string[]
  bodyTypes?: BodyType[]
  fuelTypes?: string[]
  transmissionTypes?: string[]
  enginePowerRange?: [number, number] // HP range
  search?: string
}
