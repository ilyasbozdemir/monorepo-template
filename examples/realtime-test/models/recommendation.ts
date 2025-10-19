export interface Question {
  id: string
  text: string
  options: Option[]
  imageUrl?: string
}

export interface Option {
  id: string
  text: string
  value: string
}

export interface UserPreference {
  questionId: string
  selectedOption: string
}

export interface RecommendationResult {
  id: string
  preferences: UserPreference[]
  timestamp: number
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  engineSize: number
  seats: number
  color: string
  imageUrl: string
  isNew: boolean
  features: string[]
  score?: number
}
