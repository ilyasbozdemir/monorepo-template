type AvatarType = "upload" | "gravatar" | "initials";

enum UserRole {
  Admin = "admin",
  SuperAdmin = "super_admin",
  Editor = "editor",
  Advertiser = "advertiser",
  User = "user",
  BetaUser = "beta_user",
  FakeUser = "fake_user",
}

enum UserType {
  Individual = "Individual",
  Corporate = "Corporate",
}

// Ödeme kaydı
interface PaymentRecord {
  id: string;
  date: number; // Unix timestamp
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  method: "credit_card" | "bank_transfer" | "other";
}

interface UserPackage {
  userId: string; // Kullanıcı ID'si
  packageId: string; // Paket ID'si
  startDate: number; // Başlangıç tarihi (Unix timestamp)
  endDate: number; // Bitiş tarihi (Unix timestamp)
  status: "active" | "expired" | "pending"; // Abonelik durumu
  autoRenew: boolean; // Otomatik yenileme
  paymentHistory: PaymentRecord[]; // Ödeme geçmişi
}

// Hesap (Account) Modeli
interface IAccount {
  id: string; // Hesap ID'si
  customerId: string; // Hangi müşteri ile ilişkili olduğunu belirtir
  name: string; // Hesap adı (örneğin: "Ana Hesap", "Tasarruf Hesabı")
  type: "checking" | "savings" | "business" | "other"; // Hesap türü
  balance: number; // Müşterinin mevcut bakiyesi
  currency: string; // Kullanılacak para birimi (örn. USD, EUR, TRY)
  transactions?: ITransaction[]; // Hesapla ilişkili işlemler (gelir, gider)
}

// Hesap işlemleri (Gelir, Gider)
interface ITransaction {
  id: string; // İşlem ID'si
  accountId: string; // İlgili hesabın ID'si
  amount: number; // İşlem tutarı (pozitif gelir, negatif gider)
  type: "credit" | "debit"; // İşlem türü (kredi veya borç)
  date: number; // İşlem tarihi (Unix timestamp)
  currency: string; // İşlem yapılan para birimi (örn. USD, EUR, TRY)
  description?: string; // İşlem açıklaması (opsiyonel)
  receiptUrl?: string; // İşlemle ilgili makbuz dosyasının URL'si (opsiyonel)
}

// IBAN Hesap Bilgisi Modeli
interface IBankAccount {
  id: string; // Hesap ID'si
  customerId: string; // Müşteri ID'si (hangi müşteri ile ilişkili olduğu)
  accountHolderName: string; // Hesap sahibinin adı
  bankName: string; // Banka adı
  iban: string; // IBAN numarası
  status: "approved" | "pending" | "rejected"; // Hesap durumunu belirtir (onaylı, bekliyor, reddedildi)
  currency: string; // Hesap para birimi (örn. TRY, USD, EUR)
  createdAt: number; // Hesap oluşturulma tarihi (Unix timestamp)
  updatedAt: number; // Hesap güncellenme tarihi (Unix timestamp)
}

interface ISupportRequest {
  requestId: string; // Talebin benzersiz ID'si
  userId: string; // Talebi gönderen kullanıcının ID'si
  department: "technical" | "advertising" | "payment" | "other"; // Departman (örneğin: teknik, reklam, ödeme)
  title: string; // Talebin başlığı
  status: "pending" | "inProgress" | "resolved" | "closed"; // Talebin durumu
  createdAt: number; // Talebin oluşturulma tarihi (timestamp)
  updatedAt: number; // Talebin son güncellenme tarihi
  priority: "low" | "medium" | "high"; // Talebin önceliği
  assignedTo?: string; // Destek talebini üstlenen yetkili kişinin ID'si (isteğe bağlı)
  attachments?: string[]; // Talebe ait ek dosyalar (isteğe bağlı, dosya URL'leri)

  // Mesajlar kısmı, her mesajda gönderen kişi, tarih ve içerik olacak
  messages: ISupportRequestMessage[]; // Talep ile ilişkili mesajlar
}

interface ISupportRequestMessage {
  messageId: string; // Mesajın benzersiz ID'si
  senderId: string; // Mesajı gönderen kullanıcının ID'si
  content: string; // Mesaj içeriği
  timestamp: number; // Mesajın gönderilme tarihi (timestamp)
  messageType: "text" | "file"; // Mesaj tipi (metin veya dosya)
  relatedAdId?: string; // Eğer mesaj bir ilanla ilgiliyse, ilan ID'si

  readStatus: boolean; // Mesajın okundu mu
}

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

interface Address {
  id: string; // Adresin benzersiz ID'si
  profileId: string; // Kullanıcı profil ID'si (IAppUser -> userId ile eşleşir)
  label: string; // Adres etiketi (örneğin: "Ev Adresi" veya "Ofis Adresi")
  name: string; // Adreste kullanılan ad
  surname: string; // Adreste kullanılan soyad
  mailAddress: string; // E-posta adresi
  phone?: {
    countryCode: string;
    number: string;
  };
  country: string; // Ülke
  province: string; // Bölge/eyalet
  city: string; // Şehir
  addressDetail: string; // Detaylı adres bilgisi
  addressType: "billing" | "shipping" | "both"; // Adres tipi (fatura, teslimat veya her ikisi)
  isDefault: boolean; // Varsayılan adres mi?
  latitude?: number; // Coğrafi koordinat - enlem (opsiyonel)
  longitude?: number; // Coğrafi koordinat - boylam (opsiyonel)
}



// Çalışma saatleri için model - dakika cinsinden (00:00'dan itibaren)
type DaySchedule = {
  isOpen: boolean;
  openTime?: number; // Dakika cinsinden (örn: 9:00 -> 540)
  closeTime?: number; // Dakika cinsinden (örn: 18:00 -> 1080)
};

type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

interface ICompanyProfile {
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

interface ITerms {
  id: string;
  title: string;
  description?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  placeholders?: {
    key: string; // "buyerName"
    alias: string; // "ALICI"  👉 şablonda görünen
  }[]; // "buyerName" gibi anahtarlar ve bunların şablonda görünen isimleri
  isDynamic: boolean;
  isMandatory: boolean;
  versions: {
    version: string;
    content: string;
    createdDate: number;
    updatedDate?: number;
    isLastVersion: boolean;
  }[];
}

interface IUserTermsAgreement {
  termsId: string;
  accepted: boolean;
  acceptedAt?: number;
  dynamicFields: Record<string, string>; // { buyerName: "İlyas Bozdemir" }
}

interface TermsAgreement {
  id: string;
  name: string;
  acceptedAt?: number;
  version?: string;
  lastUpdated?: number;
  documentUrl?: string; // kabul edilenler pdf olarak bu urlde saklanır.
}

type SimpleDate = {
  day: number;
  month: number;
  year: number;
};

// Kaydedilmiş arama modeli
interface ISavedSearch {
  id: string;
  label: string;
  url: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface IAppUserDTO {
  uid: string;
  email: string;
  name: string;
  surname?: string;
  company?: ICompanyProfile; //zamanla kalkıcak
  companies?: ICompanyProfile[]; //bu yerine gelicek ileriye dönük
  profileSummary?: string;
  roles: UserRole[];
  coverPhotoURL?: string;
  avatarURL?: string;
  gravatarURL?: string;
  avatarType?: AvatarType;
  listingImageURL?: string;
  createdAt: number;
  updatedAt: number;
  userType?: UserType;
  phone?: {
    countryCode: string;
    number: string;
  };
  package?: UserPackage;

  username?: string;
  requestedUsername?: string; // Kullanıcı tarafından talep edilen ancak onaylanmamış username
  usernameStatus?: "pending" | "approved" | "rejected" | "none"; // Kullanıcı adı talep durumu
  requestedUsernameDate?: number; // Kullanıcının username talep ettiği tarih (timestamp)
  rejectedUsernames?: {
    username: string;
    rejectionReason: string;
    rejectedDate: number;
  }[];
  gender?: "male" | "female" | "other";
  dateOfBirth?: SimpleDate;
  foundationDate?: SimpleDate;
  addresses?: Address[];
  plan?: any;
  country?: string;
  language?: string;
  isDevMode?: boolean;

  recovery?: {
    recoveryCodes?: {
      code: string;
      used: boolean;
      usedAt?: number;
    }[];
    email?: {
      value: string; // E-posta adresi
      verified: boolean; // E-posta doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
    whatsapp?: {
      value: string; // WhatsApp numarası
      verified: boolean; // WhatsApp doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
    sms?: {
      value: {
        countryCode: string;
        number: string;
      }; // Telefon numarası
      verified: boolean; // SMS doğrulama durumu
      codeSentAt?: number; // Kod gönderildiği zaman
    };
  };

  accountVerification?: {
    email: boolean;
    phone: boolean;
  };

  termsAccepted?: TermsAgreement[];

  // Kullanıcının eklediği sektör firmaları (örneğin, oto bayileri, elektrikçiler)
  businesses?: IBusinessProfileCard[]; // Eklenen işletmeler (sektörel firmalar)

  // Kullanıcının katıldığı chat'ler
  chats?: IChat[]; // Kullanıcının mesajlaştığı sohbetler

  // Kullanıcının destek talepleri (IAppUser ile ilişkili)
  supportRequests?: ISupportRequest[]; // Kullanıcının başvurmuş olduğu destek talepleri

  isBetaUser?: boolean;
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    newsletter?: boolean;
    browser?: boolean;
    desktop?: boolean;
    digest?: "daily" | "weekly";
    quiet_hours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };

  // 2FA bilgileri

  security?: {
    twoFactorEnabled: boolean;
    twoFactorMethod: "sms" | "app" | null;
  };

  account?: IAccount; // Kullanıcının hesabı, bakiyesi gibi bilgileri tutacak alan
  bankAccounts?: IBankAccount[];

  // Yeni eklenen alanlar
  favorites?: {
    listings: string[]; // İlan ID'leri
  };
  savedSearches?: {
    searches: ISavedSearch[];
  };
}
