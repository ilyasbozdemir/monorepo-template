// media-core.ts
import { BaseDocument } from "../_base/document.base";

export interface IGeneralMediaSettingsModel extends BaseDocument {
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
      baseUrl: string; // Örn: `https://<bucket-name>.s3.eu-north-1.amazonaws.com/`
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
