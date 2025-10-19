export enum EAudienceType {
  All = "all", // Tüm kullanıcılar (giriş yapmış ya da yapmamış fark etmeksizin)
  Guest = "guest", // Giriş yapmamış ziyaretçiler
  Registered = "registered", // Giriş yapmış tüm kullanıcılar (bireysel + kurumsal)
  Individual = "individual", // Bireysel kullanıcılar
  Corporate = "corporate", // Standart kurumsal üyeler
  CorporatePlus = "corporatePlus", // Paket satın almış özel kurumsal üyeler
}

export type BannerConfig = {
  banners: Banner[]; // Birden fazla banner
  canDismissAll: boolean; // Tüm banner'lar kapatılabilir mi?
  priority: "low" | "medium" | "high"; // Banner'ların öncelik sırası
};

export enum EBannerStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
  Inactive = "inactive",
}

export enum EBannerType {
  Standart = "standart",
  Image = "image",
  Countdown = "countdown",
  Component = "component",
}

export interface Banner {
  id: string;
  isDevMode?: boolean;
  title: string; // Admin'e özel başlık
  locale: string; // Dil bilgisi (tr, en, vs.)
  isActive: boolean;
  order: number;

  content?: React.ReactNode;

  audiences: EAudienceType[]; // Hedef kitle
  startDate: number; // Banner'ın geçerli olacağı başlangıç zamanı (ISO timestamp)
  endDate: number; // Banner'ın geçerli olacağı bitiş zamanı (ISO timestamp)
  status: EBannerStatus; // Yayın durumu
  type: EBannerType; // Banner tipi

  // Genel renk ayarları (tüm banner türleri için geçerli)
  darkMode?: {
    bgColor: string; // Dark mod arka plan rengi
    textColor: string; // Dark mod yazı rengi
  };
  lightMode?: {
    bgColor: string; // Light mod arka plan rengi
    textColor: string; // Light mod yazı rengi
  };

  // Resim ayarları: Tüm resim bilgileri tek nesnede toplanıyor
  image?: {
    url: string; // Görsel URL
    position: "top" | "left" | "right" | "bottom"; // Görselin konumu
    show: boolean; // Görselin gösterilip gösterilmeyeceği
  };

  richContent?: string; // Zengin içerik (Markdown destekli)

  // Countdown tipi banner için ek ayarlar
  countdown?: {
    showCountdownText: boolean; // Geri sayım metninin gösterilip gösterilmeyeceği
  };
}
