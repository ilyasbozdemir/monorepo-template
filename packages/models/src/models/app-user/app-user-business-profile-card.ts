import { BaseDocument } from "../_base/document.base";


interface IBusinessDocument {
  documentName: string; // Belge adı (örneğin: "Vergi Levhası", "Ruhsat", vb.)
  documentUrl: string; // Belgeye ait URL
}



interface IBusinessProfileCard {
  businessId: string; // Firmanın benzersiz ID'si
  businessName: string; // Firmanın adı
  shortDescription: string; // Firmanın kısa açıklaması (kartlarda gösterilecek)
  detailedDescription: string; // Firmanın detaylı açıklaması (zengin gösterimde kullanılacak)
  businessType: string;
  businessOwner: string; // Firma yetkilisi adı ve soyadı
  contactInfo: {
    phoneNumber: {
      landline: string; // Sabit telefon
      mobile: string; // GSM telefonu
      fax?: string; // Faks numarası (isteğe bağlı)
    };
    email: string; // E-posta adresi
    socialMedia: {
      webSite: string; // Website hesabı (isteğe bağlı)
      facebook?: string; // Facebook hesabı (isteğe bağlı)
      twitterX?: string; // Twitter hesabı (isteğe bağlı)
      instagram?: string; // Instagram hesabı (isteğe bağlı)
      linkedin?: string; // LinkedIn hesabı (isteğe bağlı)
      youtube?: string; // Youtube hesabı (isteğe bağlı)
    };
  };
  operatingHours: {
    mondayToFriday: {
      state: "open" | "closed" | "open24"; // Haftaiçi durum (açık veya kapalı)
      openingTime: string; // Açılış saati (örneğin: "08:00")
      closingTime: string; // Kapanış saati (örneğin: "18:00")
    };
    saturday: {
      state: "open" | "closed" | "open24"; // Cumartesi durumu
      openingTime: string;
      closingTime: string;
    };
    sunday: {
      state: "open" | "closed" | "open24"; // Pazar durumu
      openingTime: string;
      closingTime: string;
    };
  };
  address: {
    fullAddress: string; // Açık adres (sokak adı, mahalle, vs.)
    city: string; // Şehir
    district: string; // İlçe
    postalCode: string; // Posta kodu
    country: string; // Ülke
    coordinates: {
      latitude: number | null; // Enlem
      longitude: number | null; // Boylam
    } | null; // Koordinatlar null olabilir
    mapUrl?: string | null; // Harita URL'si, isteğe bağlı (map üzerinden alınan konum)
  };
  registrationDate: number; // Firma kayıt tarihi
  status: "active" | "inactive"; // Firma durumu
  adminApproval: boolean; // Admin onayı, true = onaylı, false = onaysız
  businessDocuments?: IBusinessDocument[]; // Firma belgelerinin adı ve URL'lerinin bulunduğu dizi
  businessPhotos?: string[]; // Firmanın fotoğraflarının URL dizisi
}


export interface IAppUserBusinessProfileModel extends BaseDocument {
  baseId: string;

  businesses?: IBusinessProfileCard[]; // Eklenen işletmeler (sektörel firmalar)
 
}
