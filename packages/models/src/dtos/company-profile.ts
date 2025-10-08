// Çalışma saatleri için model - dakika cinsinden (00:00'dan itibaren)
export type DaySchedule = {
  isOpen: boolean;
  openTime?: number; // Dakika cinsinden (örn: 9:00 -> 540)
  closeTime?: number; // Dakika cinsinden (örn: 18:00 -> 1080)
};

export type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

export interface ICompanyProfile {
  companyType: "Sole Proprietorship" | "Limited" | "Joint Stock Company"; // Şirket tipi
  // "Sole Proprietorship" => Bireysel (Şahıs) Şirketi
  // "Limited" => Limited Şirket (Vergi numarası ile tanınır)
  // "Joint Stock Company" => Anonim Şirket (Vergi numarası ile tanınır)
  taxNumber?: string; // Vergi numarası (Limited ve Joint Stock Company için)
  companyName: string; // Şirket adı
  schedule: WeekSchedule;

  businessType?: "dealer" | "other" | "gallery"; // varsayılan: "gallery"
  subdomain: string; // kurumsal alt alan adı
  companyAddress?: {
    city: string;
    district: string;
    addressDetail: string; // Detaylı adres bilgisi
  };
  // Sahıs (Bireysel) kullanıcılar için kimlik bilgisi
  nationalId?: {
    countryCode: string; // Ülke kodu
    idNumber: string; // Kimlik numarası
  };
  corporateStatus?: CorporateStatus;
}

export interface CorporateDocument {
  id: string; // Belge ID'si (uuid vs)
  type:
    | "taxCertificate" //
    | "chamberOfCommerce" // Ticaret odası kaydı
    | "signatureCircular" // İmza sirküleri
    | "other"; // Diğer belgeler için
  name: string; // Belge adı (örn: "Vergi Levhası 2025")
  url: string; // Belgelerin upload edildiği url
  uploadedAt: string; // Yükleme zamanı ISO formatta
  status: "pending" | "approved" | "rejected"; // Admin onay durumu
  notes?: string; // Admin açıklaması veya reddedilme sebebi
}
export interface CorporateStatus {
  isCorporate: boolean; // Kullanıcı kurumsal mı
  verifiedAt?: number; // Kurumsallık onaylanma zamanı
  verifiedByAdminId?: string; // Onaylayan adminin ID'si
  documents: CorporateDocument[]; // Yüklenen belgeler
}
