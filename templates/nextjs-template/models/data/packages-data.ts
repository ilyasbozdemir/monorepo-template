import type { Package } from "@/models/Branch"

export const packages: Package[] = [
  {
    id: "start",
    title: "Start",
    price: "3.960",
    originalPrice: "4.950",
    popular: false,
    services: ["Motor ekspertiz", "Mekanik ekspertiz", "Kaporta / Boya"],
    warranty: {
      months: 1,
      km: 1000,
    },
  },
  {
    id: "avantaj",
    title: "Avantaj",
    price: "5.520",
    originalPrice: "6.900",
    popular: true,
    services: [
      "Motor ekspertiz",
      "Mekanik ekspertiz",
      "Kaporta / Boya",
      "OBD / Beyin testi",
      "Yol yardım / Tur Assist",
    ],
    warranty: {
      months: 1,
      km: 1000,
    },
  },
  {
    id: "plus",
    title: "Plus",
    price: "6.800",
    originalPrice: "8.500",
    popular: false,
    services: [
      "Motor ekspertiz",
      "Mekanik ekspertiz",
      "Kaporta / Boya",
      "OBD / Beyin testi",
      "İç Dış elektronik ekspertiz",
      "KM sorgulama",
      "Hasar sorgulama",
      "Conta / Kaçak testi",
      "Yol yardım / Tur Assist",
    ],
    warranty: {
      months: 1,
      km: 1000,
    },
  },
  {
    id: "full",
    title: "Full",
    price: "7.280",
    originalPrice: "9.100",
    popular: false,
    services: [
      "Motor ekspertiz",
      "Mekanik ekspertiz",
      "Kaporta / Boya",
      "OBD / Beyin testi",
      "İç Dış elektronik ekspertiz",
      "KM sorgulama",
      "Hasar sorgulama",
      "Fren testi",
      "Süspansiyon testi",
      "Yanal kayma testi",
      "Conta / Kaçak testi",
      "Yol yardım / Tur Assist",
    ],
    warranty: {
      months: 1,
      km: 1000,
    },
  },
  {
    id: "premium",
    title: "Premium",
    price: "10.280",
    originalPrice: "12.850",
    popular: false,
    services: [
      "Motor ekspertiz",
      "Mekanik ekspertiz",
      "Kaporta / Boya",
      "OBD / Beyin testi",
      "İç Dış elektronik ekspertiz",
      "KM sorgulama",
      "Hasar sorgulama",
      "Fren testi",
      "Süspansiyon testi",
      "Yanal kayma testi",
      "Dyno testi",
      "Conta / Kaçak testi",
      "Araç detay sorgulama",
      "Değişen parça sorgulama",
      "Borç sorgulama",
      "Yol yardım / Tur Assist",
      "Yol sürüş testi",
    ],
    warranty: {
      months: 3,
      km: 3000,
    },
  },
]

// Helper function to get a package by ID
export function getPackageById(id: string): Package | undefined {
  return packages.find((pkg) => pkg.id === id)
}

// Helper function to get all packages
export function getAllPackages(): Package[] {
  return packages
}
