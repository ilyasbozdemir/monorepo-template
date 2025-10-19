/**
 * Bu dosyada medya ile ilgili tüm tipler ve arayüzler tanımlanmıştır.
 *
 * NOT:
 * - Bu tipler merkezi olarak `console.media.ilyasbozdemir.dev` repository'sinde tutulmaktadır.
 * - Tüm diğer subdomain projeleri ve servisler, bu repoda bulunan en güncel tipleri kullanmalıdır.
 * - Tek tip kaynağı (single source of truth) olarak bu repo baz alınmalıdır.
 * - Başka yerde aynı tiplerin yeniden tanımlanması veya kopyalanması önerilmez.
 *
 * Bu yapı, tutarlılık ve bakımı kolaylaştırmak için tasarlanmıştır.
 */

import { MediaTag } from "@/modules/core/constants/media-tags";


export type TVisibility = "Owner" | "Public" | "Shared" | "None";

/**
 * Medya dosyasının genel görünürlük durumu.
 * - `Owner`: Yalnızca dosyayı yükleyen kullanıcı görebilir ve düzenleyebilir.
 * - `Public`: Herkes dosyayı görebilir, ancak `permissions.write` hala geçerlidir.
 * - `Shared`: Belirli kullanıcılar veya gruplarla paylaşılmıştır. `permissions.read` ve `permissions.write` geçerlidir.
 * - `None`: Dosya tamamen gizli ve erişime kapalıdır. Hiçbir kullanıcı tarafından görülemez.
 *
 * `visibility` alanı, `permissions` alanındaki izinlere göre önceliklidir ve genel izinleri geçersiz kılabilir.
 */

// Genel Medya Kategorisi Enum
export enum EMediaGeneralCategory {
  // Genel site ve tanıtım içerikleri
  Landing = "Landing", // Ana sayfa veya tanıtım amaçlı görseller (örneğin: banner, slider)
  Advertisement = "Advertisement", // Reklam ve promosyon amaçlı görseller
  SiteAssets = "SiteAssets", // Site genelinde kullanılan varlıklar (favicon, arka plan görselleri vb.)

  // Kullanıcıya özel içerikler
  ProfilePicture = "ProfilePicture", // Kullanıcı profil fotoğrafları
  UserProfileAvatar = "UserProfileAvatar", // Kullanıcı profil fotoğrafları
  Logo = "Logo", // Logo ve markaya ait görseller

  // Ürün ve içerik görselleri
  ProductImage = "ProductImage", // Ürün görselleri
  BlogImage = "BlogImage", // Blog yazıları için kullanılan görseller
  BlogContent = "BlogContent", // BlogContent ders içeriklerinde kullanılan medya dosyaları

  Icon = "Icon", // İkonlar ve simgeler
  Documentation = "Documentation", // Doküman veya rehber görselleri
  Showcase = "Showcase", // Vitrin ve gösterim amaçlı görseller

  // Diğer içerik türleri
  ContentProduct = "ContentProduct", // Genel içerik ürünleri
  Video = "Video", // Video içerikleri
  Other = "Other", // Diğer medya dosyaları

  // Fatura kategorisi
  Invoice = "Invoice", // Fatura içerikleri

  // İlan kategorileri
  ListingImage = "ListingImage", // İlanlara ait genel görseller
  ListingVideo = "ListingVideo", // İlan açıklama videoları
  ListingDocument = "ListingDocument", // Ruhsat, ekspertiz gibi ilanla ilgili belgeler
}

// Medya tipleri enum
export enum EMediaType {
  Image = "Image", // Genel resim dosyaları (jpg, png, jpeg, webp, vb.)
  Video = "Video", // Video dosyaları (mp4, avi, mkv, vb.)
  Document = "Document",
  Audio = "Audio",
  Font = "Font",
  Vector = "Vector", // Vektör dosyaları (svg, ai, eps)
  Spreadsheet = "Spreadsheet", // Elektronik tablo dosyaları (xls, xlsx, csv)
  Presentation = "Presentation", // Sunum dosyaları (ppt, pptx)
  Archive = "Archive", // Arşiv dosyaları (zip, rar, tar, gz, vb.)
  Code = "Code", // Kod ve betik dosyaları (js, ts, py, rb, vb.)
  Other = "Other",
}

// Boyut arayüzü (örneğin: resim boyutları için)
export interface IDimension {
  width: number;
  height: number;
}

export interface IMediaPermissions {
  read: TPermissionEntity[]; // Okuma izni olanlar (email, role, IP)
  write: TPermissionEntity[]; // Yazma/düzenleme izni olanlar
}

/**
 * TPermissionEntity, kimin erişim sağlayacağını belirtir.
 * - `User`: Kullanıcı e-posta adresi
 * - `Role`: Kullanıcı rolü (örn: "admin", "editor")
 * - `IP_Address`: İzin verilen IP adresi
 */
export type TPermissionEntity = {
  type: "User" | "Role" | "IP_Address";
  value?: string; // Kullanıcı email, rol adı ya da IP adresi
};

// Paylaşılan medya arayüzü
export interface ISharedMedia {
  mediaId: string; // Paylaşılan medya dosyasının ID'si
  sharedWith?: TPermissionEntity[]; // Paylaşılacak kullanıcılar, roller, IP adresleri vb.
  criteria?: {
    timeWindow?: { start: number; end: number }; // Erişime izin verilen zaman aralığı
    allowedEntities?: TPermissionEntity[]; // Erişime izin verilen kullanıcılar, roller, IP adresleri vb.
    additionalVerification?: boolean; // Ek doğrulama gerekliliği
  };
}

export enum EMediaStorageSource {
  AWS = "aws",
  FIREBASE = "firebase",
  LOCAL = "local",
  CLOUDINARY = "cloudinary",
  VERCL_BLOB = "vercel_blob",
  OTHER = "other",
}

// Medya dosyası arayüzü
export interface IMedia2 {
  id: string; // Medya dosyasının benzersiz kimliği
  uploadedById: string; // Yükleyen kullanıcının ID'si
  uploadedByEMail?: string; // Yükleyen kullanıcının e-posta adresi
  filePath: string; // Dosyanın Firebase'deki klasör yolu veya genel dosya klasor yolu

  etag?: string; //  Güncel ETag,  Dosya hash'i
  etagHistory?: IETagHistory[]; // Önceki ETag kayıtları

  fileDirectoryName: string; // Dosyanın kategorisine veya klasör adını belirten alan
  fileName: string; // Sanal dosya adı (örneğin: "site-logo.png")
  physicalName?: string; // Fiziksel dosya adı (örneğin: "file_123456789.png")
  cdnUrl?: string; // CDN üzerinden doğrudan erişilebilen medya URL’i (opsiyonel)

  // Eski
  url: string; // Medya dosyasının URL'i bir resmi tekrar farklı domainden sunmak için,

  // Yeni
  providerCdnUrl?: string;
  /**
   * Medya dosyasının **orijinal sağlayıcı CDN linki** (örn: S3, Firebase).
   * Client tarafında direkt kullanılmaz; biz kendi baseUrl + pattern üzerinden servis ederiz.
   */
  // Eski
  baseUrl: string; // Kendi sisteminin base URL'si (opsiyonel)

  // Yeni
  servedBaseUrl?: string;

  description?: string; // Medya açıklaması (isteğe bağlı)
  generalCategory: EMediaGeneralCategory; // Medyanın genel kategorisi
  categorySource?: EMediaStorageSource;
  extension: string; // Dosya uzantısı (örneğin: ".png", ".jpg", ".exe")
  type: EMediaType; // Medya dosyasının tipi (image, video, vb.)
  size?: number; // Medya dosyasının boyutu (byte cinsinden)
  dimension?: IDimension; // Medya boyut bilgisi (width & height)
  tags: MediaTag[]; // Medya dosyasını tanımlayan etiketler
  permissions: IMediaPermissions; // Erişim ve düzenleme izinleri
  visibility: TVisibility; // Genel görünürlük durumu
  sharedDetails?: ISharedMedia; // Paylaşım bilgileri (Shared için geçerli)
  usageContext?: string; // Medyanın kullanım amacı veya durumu
  expirationAt?: number; // Medyanın son kullanma tarihi (isteğe bağlı)
  lastAccessedAt?: number; // Medyaya en son erişim tarihi (isteğe bağlı)
  createdAt: number; // Oluşturulma tarihi (Unix timestamp cinsinden)
  updatedAt?: number; // Güncellenme tarihi (Unix timestamp cinsinden, isteğe bağlı)
  deletedById?: string; // Silen kullanıcının ID'si
  isSoftDeleted: boolean; // Soft delete durumu (true ise medya çöp kutusunda)
  trashedAt?: number; // Medya çöp kutusuna taşınma tarihi (Unix timestamp cinsinden, isteğe bağlı)
}

export interface IETagHistory {
  etag: string; // Dosyanın önceki ETag değeri
  updatedAt: number; // Unix timestamp
  updatedById?: string; // Güncelleyen kullanıcı ID
}

export interface ITrashSettings {
  retentionPeriod: number; // Gün cinsinden
  autoDelete: boolean;
  notifyBeforeDelete: boolean;
  notifyDaysBefore?: number;
}

export interface ITrashedMedia {
  id: string; // Medya dosyasının benzersiz kimliği
  filePath: string; // Dosyanın fiziksel yeri
  fileName: string; // Medyanın adı
  trashedAt: number; // Dosyanın çöp kutusuna taşınma tarihi (Unix timestamp)
  isSoftDeleted: boolean; // Dosyanın soft delete durumu (true ise çöp kutusunda)
  retentionEndAt?: number; // Çöp kutusundan otomatik olarak silinme tarihi
  deletedById: string; // Silen kullanıcının ID'si
  deletedByEmail?: string; // Silen kullanıcının e-posta adresi
  originalCategory: EMediaGeneralCategory; // Medyanın orijinal kategorisi
  originalVisibility: TVisibility; // Medyanın orijinal görünürlük durumu
  size?: number; // Medyanın boyutu (isteğe bağlı, byte cinsinden)
  type: EMediaType; // Medyanın türü (örneğin: Image, Video, vb.)
  description?: string; // Medya açıklaması (isteğe bağlı)
  tags?: string[]; // Medyanın etiketleri (isteğe bağlı)
  trashedUrl?: string; // Çöp kutusundaki medya dosyasına erişim URL'si (isteğe bağlı)
}

export interface IGeneralMediaSettings {
  // Local depolama ayarları

  storageSettings?: {
    local?: {
      basePath: string; // Local storage base path (örn: "/var/www/media")
      filePathPattern?: string; // Örn: "{fileDirectoryName}/{fileName}"
      physicalNamePattern?: string; // Örn: "{id}_{fileName}"

      usage?: string; // Kullanım amacı (örn: maintenance, backup vb.)
    };

    // Cloud depolama ayarları (AWS, Firebase, Cloudinary vb.)
    cloud?: Array<{
      provider: "AWS" | "Firebase" | "Cloudinary";
      bucketName: string; // Bucket adı
      baseUrl: string; // Örn: `https://<bucket>.s3.eu-north-1.amazonaws.com/`
      baseUrlPattern: string; // Örn: `https://${bucket}.s3.${region}.amazonaws.com/`
      usage: string; // Kullanım amacı (örn: site-assets, listing-images, maintenance)
      public: boolean; // Bu bucket public mi, private mı
      region?: string; // Provider’ın bölgesi (örn: AWS: "eu-north-1", Firebase: "us-central")
      filePathPattern?: string; // Örn: "{media.fileDirectoryName}/{media.fileName}"
    }>;
  };

  // CDN ayarları
  servedCdn?: {
    baseUrl: string; // Örn: "https://cdn.ilyasbozdemir.dev"
    // Bu bizim kendi CDN'imiz. Tüm medya dosyaları buradan serve edilecek.
    urlPattern?: string; // Örn: "{baseUrl}/{fileDirectoryName}{fileName}"
    // CDN üzerinden medyaya erişim için pattern.
    servedUrlPattern?: string; // Örn: "{baseUrl}/{fileDirectoryName}{fileName}"
    // Client tarafında gösterilecek final URL pattern’i.
  };

  // Tüm ortamlar için ortak opsiyonel alanlar
  general?: {
    allowedExtensions?: string[]; // Tüm ortamlar için izinli uzantılar
    watermarkEnabled?: boolean; // Watermark uygulanacak mı
    expirationPolicyDays?: number; // Otomatik silinme süresi
  };

  trashSettings?: {
    enableTrash?: boolean; // Çöp kutusu kullanılacak mı
    retentionPeriodDays?: number; // Çöp kutusunda kalma süresi (gün cinsinden)
    autoDelete?: boolean; // Retention süresi dolunca otomatik silinsin mi
    notifyBeforeDelete?: boolean; // Silmeden önce kullanıcıya bildirim gönder
    notifyDaysBefore?: number; // Bildirim kaç gün önce gönderilsin
  };

  patterns?: {
    filePathPattern?: string; // Örn: "{media.servedBaseUrl}/{media.fileDirectoryName}{media.fileName}"
    arnPattern?: string; // Örn: "arn:gp:media:::{media.generalCategory}/{media.fileName}"
    uriPattern?: string; // Örn: "gp://{media.generalCategory}/{media.fileName}"
  };
}

export function getMediaUrl(media: IMedia2): string {
  // Eğer cdnUrl varsa, onu kullanıyoruz
  if (media.cdnUrl) {
    return media.cdnUrl;
  }

  // Eğer cdnUrl yoksa,
  const fullPath =
    "{media.servedBaseUrl}/{media.fileDirectoryName}{media.fileName}"
      .replace("{media.baseUrl}", media.baseUrl)
      .replace("{media.fileDirectoryName}", media.fileDirectoryName)
      .replace("{media.fileName}", media.fileName);

  return media.baseUrl ? `${media.baseUrl}${fullPath}` : fullPath;
}

export const generateMediaUrl = (baseUrl: string, filePath: string): string => {
  return `${baseUrl}/${filePath}`;
};

export function generateMediaUri(media: IMedia2): string {
  return `gp://${media.fileDirectoryName}${media.fileName}`;
}

export function generateMediaArn(media: IMedia2): string {
  // Örnek: arn:gp:media:::bucketName/path/to/file
  return `arn:gp:media:::${media.servedBaseUrl || media.baseUrl}/${
    media.fileDirectoryName
  }${media.fileName}`;
}

export function getObjectUrlFromArn(arn: string): string {
  // arn:gp:media:::https://cdn.ilyasbozdemir.dev/ListingImage/file.jpg
  const match = arn.match(/arn:gp:media:::(.+)/);
  if (!match) throw new Error("Geçersiz ARN");
  return match[1]; // Bu URL olarak kullanılabilir
}
