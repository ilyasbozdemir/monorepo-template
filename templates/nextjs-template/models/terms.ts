export interface ITerms {
    id: string
    title: string
    description?: string
    seo?: {
      title?: string
      description?: string
    }
    placeholders?: {
      key: string // "buyerName"
      alias: string // "ALICI"  👉 şablonda görünen
    }[] // "buyerName" gibi anahtarlar ve bunların şablonda görünen isimleri
    isDynamic: boolean
    isMandatory: boolean
    versions: {
      version: string
      content: string
      createdDate: number
      updatedDate?: number
      isLastVersion: boolean
    }[]
  }
  
  export interface IUserTermsAgreement {
    termsId: string
    accepted: boolean
    acceptedAt?: number
    dynamicFields: Record<string, string> // { buyerName: "İlyas Bozdemir" }
  }
  
  export interface TermsAgreement {
    id: string
    name: string
    acceptedAt?: number
    version?: string
    lastUpdated?: number
    documentUrl?: string // kabul edilenler pdf olarak bu urlde saklanır.
  }
  