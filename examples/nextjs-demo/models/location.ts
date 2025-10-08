export interface District {
  ilce_id: string
  ilce_adi: string
}

export interface City {
  il_id: string
  il_adi: string
  ilceler: District[]
}

export interface Country {
  ülke: string
  iller: City[]
}
