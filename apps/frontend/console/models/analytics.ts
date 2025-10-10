// Analytics models for tracking search data

export enum SearchType {
  CATEGORY = "category",
  LISTING_NUMBER = "listingNumber",
  BRAND = "brand",
  MODEL = "model",
  UNMATCHED = "unmatched", // Added unmatched type
}

export interface SearchTerm {
  id: string
  term: string
  type: SearchType
  count: number
  lastSearched: string // ISO date string
  firstSearched: string // ISO date string
  resultCount?: number // Number of results returned (0 for unmatched)
}

export interface SearchAnalytics {
  totalSearches: number
  uniqueTerms: number
  topSearches: SearchTerm[]
  recentSearches: SearchTerm[]
  unmatchedSearches: SearchTerm[] // Added unmatched searches
  searchesByType: {
    [key in SearchType]: number
  }
  searchesByDay: {
    date: string
    count: number
  }[]
}

export interface SearchFilter {
  period: "day" | "week" | "month" | "year" | "all"
  type?: SearchType
  sortBy: "count" | "recent"
  limit: number
}

// Recommendation types for unmatched searches
export enum RecommendationType {
  ADD_INVENTORY = "add_inventory",
  CREATE_CATEGORY = "create_category",
  ADD_SYNONYM = "add_synonym",
  MERGE_WITH_CATEGORY = "merge_with_category",
  IGNORE = "ignore",
}

// Add a new interface for action context
export interface ActionContext {
  relatedTerms?: string[]
  similarCategories?: string[]
  suggestedCategory?: string
  estimatedDemand?: "high" | "medium" | "low"
  trendDirection?: "increasing" | "stable" | "decreasing"
  matchConfidence?: number // 0-100 percentage
}

// Update the SearchRecommendation interface
export interface SearchRecommendation {
  searchTerm: string
  recommendationType: RecommendationType
  reason: string
  priority: "high" | "medium" | "low"
  suggestedAction: string
  actionContext?: ActionContext
}
