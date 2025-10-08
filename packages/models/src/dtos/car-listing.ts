import { UserType } from "@/enums/app-user";

interface SelectedFeature {
  featureId: string; // "abs", "ebd", "hiz-sabitleyici" gibi
  groupId: string; // "guvenlik", "konfor" gibi
}

interface ListingRemoveInfo {
  byUid: string; // Kaldıran kişi uid
  byRole: "user" | "admin";
  reason: "sold" | "user-deactivated" | "violates-rules" | "other";
  note?: string; // Kullanıcının veya adminin yorumu
  feedback?: string; // İsteğe bağlı sistem geri bildirimi
  at: number; // UTC ISO date string
}

type ListingStatus =
  | "active"
  | "inactive"
  | "draft"
  | "pending"
  | "awaiting_approval"
  | "sold"
  | "expired"
  | "rejected"
  | "removed";

enum ListingType {
  Sale = "sale", // Satılık
  Rent = "rent", // Kiralık
  Auction = "auction", // Açık artırma
  Lease = "lease", // Uzun dönem kiralama (leasa)
  Exchange = "exchange", // Takasa açık ilan
  Service = "service", // filo, servis vs.
  DailyRent = "daily_rent", // Günlük kiralama
  Other = "other", // Diğer
}
interface CarListingNote {
  id: string;
  createdBy: string; // uid
  name_surname: string;
  role: "user" | "admin";
  text: string;
  at: number; // timestamp
}

// user'lara favori alırken tarihi de alıcaz boyllece tarihine göre geçmişi vericez unutmadan not alalım.
export interface CarListingDTO {
  id: string; // benzrsiz uuid
  listingNo: string; // İlan numarası
  listingType: ListingType;
  status: ListingStatus; // İlan durumu

  listingEnv: "development" | "production";

  title: string; // İlan başlığı
  variantTitle: string;
  slug: string; // önceden hazırlanmış SEO-friendly slug ✔️

  description?: string; // İlan açıklaması
  brand: string; // Araç markası
  model: string; // Araç modeli
  submodel?: string; // Araç alt modeli
  year: number; // Araç üretim yılı
  colorId: string; //

  notes?: CarListingNote[];
  itemCondition?: string;

  approvedImages?: {
    category: keyof CarListingDTO["images"]; // örn: "Interior", "Engine"
    src: string; // onaylanan görselin URL'si
    note?: string; // opsiyonel açıklama (örneğin: kalitesi iyi vs.)
  }[];

  rejectedImages?: {
    category: keyof CarListingDTO["images"]; // örn: "Interior", "Engine"
    src: string; // reddedilen görselin URL'si
    reason?: string; // opsiyonel açıklama (admin panelde gösterilebilir)
  }[];

  engineVolume?: string; // Motor hacmi
  enginePower?: string; // Motor gücü
  driveType?: string; // Tahrik sistemi (4x4, 4x2, vb.)
  bodyType: string; // Araç tipi (otomobil, SUV, kamyonet, vb.)
  steeringType: string;
  transmissionType: string; // Şanzıman tipi (manuel, otomatik, yarı otomatik)
  fuelType: string; // Yakıt tipi (benzin, dizel, LPG, elektrikli)

  isPriceHidden: boolean; // Fiyat gizli mi?
  isNegotiable: boolean; // Fiyat pazarlık payı var mı?
  isExchange?: boolean; // Takas ilanı mı?
  //Kullanıcı açıkça "takas olur ama fiyat vermedim" diyebilir → isExchange: true, ama exchangePrice yok olur.

  images: {
    Front: string[]; // Ön görüntü
    Rear: string[]; // Arka görüntü
    Side: string[]; // Yan görüntü
    Interior: string[]; // İç mekan görüntüsü
    Engine: string[]; // Motor görüntüsü
    Console: string[]; // Konsol görüntüsü
    Other: string[]; // Diğer görüntüler
  };

  imageUrl: string; // Ana görsel URL'si

  rejectionReason?: string; // İlanın reddedilme nedeni

  remove?: ListingRemoveInfo;

  selectedEquipmentFeatures?: {
    featureId: string; // "abs", "ebd", "hiz-sabitleyici" gibi
    groupId: string; // "guvenlik", "konfor" gibi
    
  }[];

  location: {
    country: string; // Ülke
    city: string; // Şehir
    district: string; // İlçe
  };

  mileage: {
    value: number; // Araç kilometresi
    unit: string; // Araç kilometre birimi (km, mile)
  };

  price: {
    amount: number; // Araç güncel fiyatı
    currency: string; // Araç güncel fiyat para birimi
  };

  exchangePrice?: {
    amount: number;
    currency: string;
  };

  priceHistory?: {
    date: number; // Fiyat değişikliği tarihi
    amount: number; // Fiyat değişikliği miktarı
    currency: string; // Fiyat değişikliği para birimi
  }[];

  listingDate: number; // İlan tarihi
  publishDate: number; // Yayın tarihi
  updatedAt?: number; // timestamp olarak (ms cinsinden), içerik güncellenme zamanı
  expiryDate: number; // İlanın son tarihi

  viewCount: number; // Görüntülenme sayısı
  favoriteCount: number; // Favori sayısı

  seller: {
    uid: string; // Satıcının benzersiz kimliği
    name: string; // Satıcının adı
    type: UserType; // Satıcı tipi (bireysel, kurumsal)
    phone?: string; // Satıcının telefon numarası
    location?: string; // Satıcının konumu
    memberSince?: string; // Satıcının üye olduğu tarih
    verifiedSeller?: boolean; // Satıcının doğrulanmış olup olmadığı
    badges?: string[]; // Satıcının rozetleri (örneğin: "Yeni Üye", "Doğrulanmış")
    contactPreferences?: {
      allowDirectPhone: boolean; // Doğrudan telefonla iletişim izni
      allowPhoneMessaging?: boolean; // Telefon mesajı ile iletişim izni ESKİ BU
      allowWebsiteMessaging: boolean; // Web sitesi mesajı ile iletişim izni
    };
  };
}

export interface ListingMessage {
  id: string;
  senderUid: string; // Gönderen (örn: "Potansiyel Alıcı", "Sistem")
  content: string; // Mesaj içeriği
  at: number; // Mesajın gönderildiği zaman damgası
  isRead: boolean; // Mesajın okunup okunmadığı
}

// Fiyat değişikliği kontrolü için yardımcı fonksiyonlar
export function hasPriceChanged(listing: CarListingDTO): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false;
  }

  const firstPrice = listing.priceHistory[0];
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1];

  return firstPrice.amount !== lastPrice.amount;
}

// Fiyat düşüşü kontrolü için yardımcı fonksiyon
export function hasPriceDecreased(listing: CarListingDTO): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false;
  }

  const firstPrice = listing.priceHistory[0];
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1];

  return lastPrice.amount < firstPrice.amount;
}

// Fiyat artışı kontrolü için yardımcı fonksiyon
export function hasPriceIncreased(listing: CarListingDTO): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false;
  }

  const firstPrice = listing.priceHistory[0];
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1];

  return lastPrice.amount > firstPrice.amount;
}

// Fiyat değişim yüzdesi hesaplama
export function getPriceChangePercentage(listing: CarListingDTO): number {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return 0;
  }

  const firstPrice = listing.priceHistory[0];
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1];

  if (firstPrice.amount === 0) return 0;

  return ((lastPrice.amount - firstPrice.amount) / firstPrice.amount) * 100;
}
export function isActiveListing(listing: CarListingDTO): boolean {
  return listing.status === "active";
}

export function isPendingListing(listing: CarListingDTO): boolean {
  return listing.status === "pending";
}

export function isSoldListing(listing: CarListingDTO): boolean {
  return listing.status === "sold";
}

export function isExpiredListing(listing: CarListingDTO): boolean {
  return listing.status === "expired";
}

export function isRejectedListing(listing: CarListingDTO): boolean {
  return listing.status === "rejected";
}
export function isInactiveListing(listing: CarListingDTO): boolean {
  return listing.status === "inactive";
}
