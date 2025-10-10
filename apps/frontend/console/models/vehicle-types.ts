export interface VehicleData {
  [category: string]: {
    [brandName: string]: {
      [modelName: string]: {
        submodels: string[]
      }
    }
  }
}

export interface VehicleDetail {
  id: string // Yıl-Marka-Model gibi benzersiz ID
  year: number // Model yılı
  fuelType: string // Yakıt tipi (Benzin, Dizel, Elektrik, vb.)
  brand: string // Marka (Aston Martin, Mercedes, vb.)
  model: string // Model (DB11, A-Class, vb.)
  bodyType: string // Gövde tipi (Coupe, Sedan, Hatchback, vb.)
  variants: VehicleVariant[] // Varyasyonlar (Farklı motor seçenekleri ve vites türleri)
  availableColors: VehicleColor[] // Modelin sunmuş olduğu renkler
}

export interface VehicleColor {
  label: string // Renk adı (örneğin: "Kırmızı", "Beyaz")
  hex: string // Renk kodu (örneğin: "#FF0000", "#FFFFFF")
}

export interface VehicleVariant {
  transmission: string // Vites türü (Otomatik, Manuel)
  engineSpecs: EngineSpecs // Motor özellikleri (Hacim ve Beygir Gücü)
  variantName: string // Varyasyon adı (DB11 5.2 V12 Otomatik, DB11 5.2 V12 Manuel vb.)

  // Yeni eklenen özellikler
  seatingCapacity: number // Koltuk sayısı
  doorCount: number // Kapı sayısı
  fuelType: string // Yakıt tipi (Benzin, Dizel, Elektrik, vb.)
  steeringType: string // Direksiyon tipi (Sağ, Sol)

  // Kullanıcı tarafından girilebilecek özel özellikler (title, value, type)
  variantFields: VariantField[] // Özel alanlar (title, value, type)
}

export interface VariantField {
  title: string // Özelliğin başlığı (sunroof, leatherSeats, customColor vb.)
  value: any // Özelliğin değeri (true, false, string, number vb.)
  type: "boolean" | "string" | "number" // Değerin türü (boolean, string, number)
}

export interface EngineSpecs {
  engineSize: number // Motor hacmi (cc)
  horsepower: number // Beygir gücü
}

// Örnek veri (Model bazında renkler)
const vehicleDetails: VehicleDetail[] = [
  {
    id: "2016-Aston Martin-DB11",
    year: 2016,
    fuelType: "Benzin",
    brand: "Aston Martin",
    model: "DB11",
    bodyType: "Coupe",
    availableColors: [
      { label: "Kırmızı", hex: "#FF0000" },
      { label: "Beyaz", hex: "#FFFFFF" },
      { label: "Siyah", hex: "#000000" },
      { label: "Gümüş", hex: "#C0C0C0" },
    ], // Renk seçenekleri
    variants: [
      {
        transmission: "Otomatik",
        engineSpecs: {
          engineSize: 5200, // Motor hacmi (cc)
          horsepower: 608, // Beygir gücü (hp)
        },
        variantName: "DB11 5.2 V12 Otomatik",
        seatingCapacity: 2, // Koltuk sayısı
        doorCount: 2, // Kapı sayısı
        fuelType: "Benzin", // Yakıt tipi
        steeringType: "Sol", // Direksiyon tipi (Sol)
        variantFields: [
          {
            title: "Sunroof", // Başlık
            value: true, // Değer
            type: "boolean", // Tür
          },
          {
            title: "Deri Koltuk", // Başlık
            value: true, // Değer
            type: "boolean", // Tür
          },
          {
            title: "Motor Hacmi", // Başlık
            value: 5200, // Değer
            type: "number", // Tür
          },
        ],
      },
      {
        transmission: "Manuel",
        engineSpecs: {
          engineSize: 5200, // Motor hacmi (cc)
          horsepower: 600, // Beygir gücü (hp)
        },
        variantName: "DB11 5.2 V12 Manuel",
        seatingCapacity: 2, // Koltuk sayısı
        doorCount: 2, // Kapı sayısı
        fuelType: "Benzin", // Yakıt tipi
        steeringType: "Sol", // Direksiyon tipi (Sol)
        variantFields: [
          {
            title: "Sunroof", // Başlık
            value: false, // Değer
            type: "boolean", // Tür
          },
          {
            title: "Deri Koltuk", // Başlık
            value: true, // Değer
            type: "boolean", // Tür
          },
          {
            title: "Motor Hacmi", // Başlık
            value: 5200, // Değer
            type: "number", // Tür
          },
        ],
      },
    ],
  },
]
