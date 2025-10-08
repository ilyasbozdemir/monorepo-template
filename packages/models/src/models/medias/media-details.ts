import { BaseDocument } from "../_base/document.base";

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

interface IDimension {
  width: number;
  height: number;
}

enum EMediaStorageSource {
  AWS = "aws",
  FIREBASE = "firebase",
  LOCAL = "local",
  CLOUDINARY = "cloudinary",
  VERCL_BLOB = "vercel_blob",
  OTHER = "other",
}

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

export interface IMediaDetailsModel extends BaseDocument {
  baseId: string;

  uploadedById?: string; // Yükleyen kullanıcının kimliği
  uploadedByEmail?: string; // Yükleyen kullanıcının e-posta adresi

  type: EMediaType; // Medya dosyasının tipi (image, video, vb.)
  size?: number; // Medya dosyasının boyutu (byte cinsinden)
  dimension?: IDimension; // Medya boyut bilgisi (width & height)
  description?: string; // Medya açıklaması (isteğe bağlı)

  generalCategory: EMediaGeneralCategory; // Medyanın genel kategorisi

  categorySource?: EMediaStorageSource;

  usageContext?: string; // Medyanın kullanım amacı veya durumu

  isSoftDeleted: boolean; // Soft delete durumu (true ise medya çöp kutusunda)
  trashedAt?: number; // Medya çöp kutusuna taşınma tarihi (Unix timestamp cinsinden, isteğe bağlı)
}
