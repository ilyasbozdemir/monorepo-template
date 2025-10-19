import type {
  Branch,
  City,
  Service,
  Staff,
  Equipment,
  Review,
} from "@/models/Branch";

// Common services
const commonServices: Service[] = [
  {
    id: "motor-ekspertiz",
    name: "Motor Ekspertiz",
    description: "Motor performansı ve durumu hakkında detaylı inceleme",
    price: 450,
    duration: "45 dakika",
    isAvailable: true,
  },
  {
    id: "mekanik-ekspertiz",
    name: "Mekanik Ekspertiz",
    description: "Aracın mekanik aksamlarının detaylı kontrolü",
    price: 350,
    duration: "30 dakika",
    isAvailable: true,
  },
  {
    id: "kaporta-boya",
    name: "Kaporta / Boya",
    description: "Aracın kaporta ve boya durumunun incelenmesi",
    price: 300,
    duration: "30 dakika",
    isAvailable: true,
  },
  {
    id: "obd-beyin-testi",
    name: "OBD / Beyin Testi",
    description: "Araç beyninin elektronik olarak test edilmesi",
    price: 250,
    duration: "20 dakika",
    isAvailable: true,
  },
  {
    id: "elektronik-ekspertiz",
    name: "İç Dış Elektronik Ekspertiz",
    description: "Aracın elektronik aksamlarının detaylı kontrolü",
    price: 350,
    duration: "30 dakika",
    isAvailable: true,
  },
  {
    id: "km-sorgulama",
    name: "KM Sorgulama",
    description: "Aracın kilometre bilgisinin doğrulanması",
    price: 150,
    duration: "15 dakika",
    isAvailable: true,
  },
  {
    id: "hasar-sorgulama",
    name: "Hasar Sorgulama",
    description: "Aracın hasar geçmişinin sorgulanması",
    price: 200,
    duration: "15 dakika",
    isAvailable: true,
  },
  {
    id: "fren-testi",
    name: "Fren Testi",
    description: "Fren sisteminin performans testi",
    price: 250,
    duration: "20 dakika",
    isAvailable: true,
  },
  {
    id: "suspansiyon-testi",
    name: "Süspansiyon Testi",
    description: "Süspansiyon sisteminin durumu ve performansı",
    price: 250,
    duration: "20 dakika",
    isAvailable: true,
  },
  {
    id: "yanal-kayma-testi",
    name: "Yanal Kayma Testi",
    description: "Aracın yanal kayma durumunun testi",
    price: 200,
    duration: "15 dakika",
    isAvailable: true,
  },
  {
    id: "dyno-testi",
    name: "Dyno Testi",
    description: "Motor gücü ve performans ölçümü",
    price: 500,
    duration: "45 dakika",
    isAvailable: true,
  },
  {
    id: "conta-kacak-testi",
    name: "Conta / Kaçak Testi",
    description: "Motor contalarının ve sıvı kaçaklarının testi",
    price: 300,
    duration: "30 dakika",
    isAvailable: true,
  },
  {
    id: "arac-detay-sorgulama",
    name: "Araç Detay Sorgulama",
    description: "Aracın detaylı bilgilerinin sorgulanması",
    price: 200,
    duration: "15 dakika",
    isAvailable: true,
  },
  {
    id: "degisen-parca-sorgulama",
    name: "Değişen Parça Sorgulama",
    description: "Araçtaki değişen parçaların tespiti",
    price: 250,
    duration: "20 dakika",
    isAvailable: true,
  },
  {
    id: "borc-sorgulama",
    name: "Borç Sorgulama",
    description: "Araç üzerindeki borç ve rehin durumunun sorgulanması",
    price: 150,
    duration: "10 dakika",
    isAvailable: true,
  },
  {
    id: "yol-yardim",
    name: "Yol Yardım / Tur Assist",
    description: "Yol yardım hizmeti",
    price: 100,
    duration: "Anlık",
    isAvailable: true,
  },
  {
    id: "yol-surus-testi",
    name: "Yol Sürüş Testi",
    description: "Aracın yol performansının test edilmesi",
    price: 350,
    duration: "30 dakika",
    isAvailable: true,
  },
];

// Common staff
const commonStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Ahmet Yılmaz",
    position: "Ekspertiz Uzmanı",
    image: "/staff/expert-1.jpg",
    experience: "10 yıl",
  },
  {
    id: "staff-2",
    name: "Mehmet Kaya",
    position: "Motor Teknisyeni",
    image: "/staff/expert-2.jpg",
    experience: "8 yıl",
  },
  {
    id: "staff-3",
    name: "Ali Demir",
    position: "Elektronik Uzmanı",
    image: "/staff/expert-3.jpg",
    experience: "5 yıl",
  },
];

// Common equipment
const commonEquipment: Equipment[] = [
  {
    id: "equipment-1",
    name: "Dyno Test Cihazı",
    description: "Motor gücü ve performans ölçümü için profesyonel cihaz",
    image: "/equipment/dyno.jpg",
  },
  {
    id: "equipment-2",
    name: "OBD Tarayıcı",
    description: "Araç beynini taramak için kullanılan profesyonel cihaz",
    image: "/equipment/obd-scanner.jpg",
  },
  {
    id: "equipment-3",
    name: "Fren Test Cihazı",
    description: "Fren performansını ölçen profesyonel cihaz",
    image: "/equipment/brake-tester.jpg",
  },
  {
    id: "equipment-4",
    name: "Süspansiyon Test Cihazı",
    description: "Süspansiyon sistemini test eden profesyonel cihaz",
    image: "/equipment/suspension-tester.jpg",
  },
];

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: "review-1",
    userName: "Mustafa Özkan",
    userImage: "/users/user-1.jpg",
    rating: 5,
    comment:
      "Çok profesyonel bir hizmet aldım. Aracımın tüm detaylarını öğrendim. Teşekkürler!",
    date: "15.04.2023",
  },
  {
    id: "review-2",
    userName: "Ayşe Yılmaz",
    userImage: "/users/user-2.jpg",
    rating: 4,
    comment: "Hızlı ve detaylı bir ekspertiz hizmeti. Tavsiye ederim.",
    date: "22.05.2023",
  },
  {
    id: "review-3",
    userName: "Hasan Kara",
    userImage: "/users/user-3.jpg",
    rating: 5,
    comment: "Çok memnun kaldım. Aracımın tüm sorunlarını tespit ettiler.",
    date: "10.06.2023",
  },
];

export const cities: City[] = [
  { id: "lefkosa", name: "Lefkoşa", branchCount: 3 },
  { id: "girne", name: "Girne", branchCount: 2 },
  { id: "gazimagusa", name: "Gazimağusa", branchCount: 2 },
  { id: "guzelyurt", name: "Güzelyurt", branchCount: 1 },
  { id: "iskele", name: "İskele", branchCount: 1 },
];

export const branches: Branch[] = [
  {
    id: "lefkosa-merkez",
    name: "Lefkoşa Merkez",
    city: "Lefkoşa",
    address: "Bedrettin Demirel Caddesi No:42, Lefkoşa",
    phone: "+90 533 842 05 62",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: [
      ...commonServices.slice(0, 10),
      { ...commonServices[10], isAvailable: false }, // Dyno testi yok
      ...commonServices.slice(11, 15),
      { ...commonServices[15], isAvailable: false }, // Yol sürüş testi yok
      ...commonServices.slice(16),
    ],
    coordinates: {
      lat: 35.1856,
      lng: 33.3823,
    },
    isActive: true,
    description:
      "Lefkoşa Merkez şubemiz, en son teknoloji ile donatılmış olup, profesyonel ekibimiz ile hizmetinizdedir. Aracınızın tüm detaylarını öğrenmek için bizi ziyaret edin.",
    images: [
      "/branches/lefkosa-merkez-1.jpg",
      "/branches/lefkosa-merkez-2.jpg",
      "/branches/lefkosa-merkez-3.jpg",
    ],
    staff: commonStaff,
    equipment: commonEquipment.slice(0, 3), // Dyno test cihazı yok
    reviews: sampleReviews,
    rating: 4.8,
  },
  {
    id: "lefkosa-kucukkaymaklı",
    name: "Lefkoşa Küçükkaymaklı",
    city: "Lefkoşa",
    address: "Şehit Mustafa Ruso Caddesi No:15, Küçükkaymaklı, Lefkoşa",
    phone: "+90 392 223 4567",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: commonServices
      .slice(0, 7)
      .map((service) => ({ ...service, isAvailable: true })),
    coordinates: {
      lat: 35.1956,
      lng: 33.3723,
    },
    isActive: true,
    description:
      "Küçükkaymaklı şubemiz, temel ekspertiz hizmetleri sunmaktadır. Aracınızın genel durumunu öğrenmek için ideal bir seçenektir.",
    images: [
      "/branches/lefkosa-kucukkaymaklı-1.jpg",
      "/branches/lefkosa-kucukkaymaklı-2.jpg",
    ],
    staff: commonStaff.slice(0, 2),
    equipment: commonEquipment.slice(1, 3),
    reviews: sampleReviews.slice(0, 2),
    rating: 4.5,
  },
  {
    id: "lefkosa-gonyeli",
    name: "Lefkoşa Gönyeli",
    city: "Lefkoşa",
    address: "Gönyeli Çemberi yanı No:8, Gönyeli, Lefkoşa",
    phone: "+90 392 323 4567",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: [
      ...commonServices.slice(0, 10),
      commonServices[10], // Dyno testi var
      ...commonServices.slice(11, 15),
      { ...commonServices[15], isAvailable: false }, // Yol sürüş testi yok
      ...commonServices.slice(16),
    ],
    coordinates: {
      lat: 35.2056,
      lng: 33.3623,
    },
    isActive: true,
    description:
      "Gönyeli şubemiz, Dyno test cihazı dahil olmak üzere en son teknoloji ile donatılmıştır. Motor gücü ve performans ölçümü için bizi tercih edebilirsiniz.",
    images: [
      "/branches/lefkosa-gonyeli-1.jpg",
      "/branches/lefkosa-gonyeli-2.jpg",
      "/branches/lefkosa-gonyeli-3.jpg",
    ],
    staff: commonStaff,
    equipment: commonEquipment,
    reviews: sampleReviews,
    rating: 4.9,
  },
  {
    id: "girne-merkez",
    name: "Girne Merkez",
    city: "Girne",
    address: "Ziya Rızkı Caddesi No:24, Girne",
    phone: "+90 392 815 6789",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: [
      ...commonServices.slice(0, 10),
      { ...commonServices[10], isAvailable: false }, // Dyno testi yok
      ...commonServices.slice(11, 15),
      commonServices[15], // Yol sürüş testi var
      ...commonServices.slice(16),
    ],
    coordinates: {
      lat: 35.3401,
      lng: 33.3177,
    },
    isActive: true,
    description:
      "Girne Merkez şubemiz, deniz manzaralı konumu ile hizmetinizdedir. Yol sürüş testi için ideal bir lokasyondadır.",
    images: ["/branches/girne-merkez-1.jpg", "/branches/girne-merkez-2.jpg"],
    staff: commonStaff,
    equipment: commonEquipment.slice(1),
    reviews: sampleReviews,
    rating: 4.7,
  },
  {
    id: "girne-alsancak",
    name: "Girne Alsancak",
    city: "Girne",
    address: "Alsancak Caddesi No:32, Alsancak, Girne",
    phone: "+90 392 821 5678",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: commonServices
      .slice(0, 7)
      .map((service) => ({ ...service, isAvailable: true })),
    coordinates: {
      lat: 35.3501,
      lng: 33.3077,
    },
    isActive: true,
    description:
      "Alsancak şubemiz, temel ekspertiz hizmetleri sunmaktadır. Aracınızın genel durumunu öğrenmek için ideal bir seçenektir.",
    images: [
      "/branches/girne-alsancak-1.jpg",
      "/branches/girne-alsancak-2.jpg",
    ],
    staff: commonStaff.slice(0, 2),
    equipment: commonEquipment.slice(1, 3),
    reviews: sampleReviews.slice(1),
    rating: 4.6,
  },
  {
    id: "gazimagusa-merkez",
    name: "Gazimağusa Merkez",
    city: "Gazimağusa",
    address: "Salamis Yolu No:18, Gazimağusa",
    phone: "+90 392 365 7890",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: [
      ...commonServices.slice(0, 10),
      { ...commonServices[10], isAvailable: false }, // Dyno testi yok
      ...commonServices.slice(11, 15),
      { ...commonServices[15], isAvailable: false }, // Yol sürüş testi yok
      ...commonServices.slice(16),
    ],
    coordinates: {
      lat: 35.1244,
      lng: 33.94,
    },
    isActive: true,
    description:
      "Gazimağusa Merkez şubemiz, tarihi surların yakınında konumlanmıştır. Profesyonel ekibimiz ile hizmetinizdedir.",
    images: [
      "/branches/gazimagusa-merkez-1.jpg",
      "/branches/gazimagusa-merkez-2.jpg",
    ],
    staff: commonStaff,
    equipment: commonEquipment.slice(1),
    reviews: sampleReviews,
    rating: 4.7,
  },
  {
    id: "gazimagusa-maras",
    name: "Gazimağusa Maraş",
    city: "Gazimağusa",
    address: "Maraş Bölgesi No:5, Gazimağusa",
    phone: "+90 392 366 8901",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: commonServices
      .slice(0, 7)
      .map((service) => ({ ...service, isAvailable: true })),
    coordinates: {
      lat: 35.1144,
      lng: 33.95,
    },
    isActive: true,
    description:
      "Maraş şubemiz, temel ekspertiz hizmetleri sunmaktadır. Aracınızın genel durumunu öğrenmek için ideal bir seçenektir.",
    images: [
      "/branches/gazimagusa-maras-1.jpg",
      "/branches/gazimagusa-maras-2.jpg",
    ],
    staff: commonStaff.slice(0, 2),
    equipment: commonEquipment.slice(1, 3),
    reviews: sampleReviews.slice(0, 2),
    rating: 4.5,
  },
  {
    id: "guzelyurt-merkez",
    name: "Güzelyurt Merkez",
    city: "Güzelyurt",
    address: "Ecevit Caddesi No:12, Güzelyurt",
    phone: "+90 392 714 5678",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: commonServices
      .slice(0, 7)
      .map((service) => ({ ...service, isAvailable: true })),
    coordinates: {
      lat: 35.2095,
      lng: 32.9996,
    },
    isActive: true,
    description:
      "Güzelyurt şubemiz, narenciye bahçeleri arasında konumlanmıştır. Temel ekspertiz hizmetleri sunmaktadır.",
    images: [
      "/branches/guzelyurt-merkez-1.jpg",
      "/branches/guzelyurt-merkez-2.jpg",
    ],
    staff: commonStaff.slice(0, 2),
    equipment: commonEquipment.slice(1, 3),
    reviews: sampleReviews.slice(1),
    rating: 4.6,
  },
  {
    id: "iskele-merkez",
    name: "İskele Merkez",
    city: "İskele",
    address: "İskele Caddesi No:7, İskele",
    phone: "+90 392 371 2345",
    workingHours: "Pazartesi - Cumartesi: 09:00 - 18:00",
    services: commonServices
      .slice(0, 7)
      .map((service) => ({ ...service, isAvailable: true })),
    coordinates: {
      lat: 35.2885,
      lng: 33.9137,
    },
    isActive: true,
    description:
      "İskele şubemiz, deniz manzaralı konumu ile hizmetinizdedir. Temel ekspertiz hizmetleri sunmaktadır.",
    images: ["/branches/iskele-merkez-1.jpg", "/branches/iskele-merkez-2.jpg"],
    staff: commonStaff.slice(0, 2),
    equipment: commonEquipment.slice(1, 3),
    reviews: sampleReviews.slice(0, 2),
    rating: 4.5,
  },
];

// Helper function to get a branch by ID
export function getBranchById(id: string): Branch | undefined {
  return branches.find((branch) => branch.id === id);
}

// Helper function to get branches by city
export function getBranchesByCity(city: string): Branch[] {
  if (city === "all") return branches;
  return branches.filter((branch) => branch.city === city);
}

// Helper function to get branches by service
export function getBranchesByService(serviceId: string): Branch[] {
  if (serviceId === "all") return branches;
  return branches.filter((branch) =>
    branch.services.some(
      (service) => service.id === serviceId && service.isAvailable
    )
  );
}

// Helper function to get all available services
export function getAllServices(): Service[] {
  return commonServices;
}

// Helper function to get all branches
export function getAllBranches(): Branch[] {
  return branches;
}
