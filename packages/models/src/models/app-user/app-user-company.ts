import { BaseDocument } from "../_base/document.base";

interface CorporateDocument {
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

interface CorporateStatus {
  isCorporate: boolean; // Kullanıcı kurumsal mı
  verifiedAt?: number; // Kurumsallık onaylanma zamanı
  verifiedByAdminId?: string; // Onaylayan adminin ID'si
  documents: CorporateDocument[]; // Yüklenen belgeler
}

type SimpleDate = {
  day: number;
  month: number;
  year: number;
};

export interface IAppUserCompanyModel extends BaseDocument {
  baseId: string;

  companyName: string;
  companyType: "Sole Proprietorship" | "Limited" | "Joint Stock Company";
  taxNumber?: string;
  subdomain: string;

  businessType?: "dealer" | "other" | "gallery";

  schedule?: {
    monday: { isOpen: boolean; openTime?: number; closeTime?: number };
    tuesday: { isOpen: boolean; openTime?: number; closeTime?: number };
    wednesday: { isOpen: boolean; openTime?: number; closeTime?: number };
    thursday: { isOpen: boolean; openTime?: number; closeTime?: number };
    friday: { isOpen: boolean; openTime?: number; closeTime?: number };
    saturday: { isOpen: boolean; openTime?: number; closeTime?: number };
    sunday: { isOpen: boolean; openTime?: number; closeTime?: number };
  };

  address?: {
    city: string;
    district: string;
    addressDetail: string;
  };

  // Sahıs (Bireysel) kullanıcılar için kimlik bilgisi
  nationalId?: {
    countryCode: string; // Ülke kodu
    idNumber: string; // Kimlik numarası
  };

  corporateStatus?: CorporateStatus;

  dateOfBirth?: SimpleDate;
  foundationDate?: SimpleDate;

  createdAt: number;
  updatedAt: number;
}
