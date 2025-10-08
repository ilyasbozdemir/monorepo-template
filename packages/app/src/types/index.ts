// --------------------
// Storage provider tipi
// --------------------
export type StorageProvider = "s3" | "local" | "gcs";

// --------------------
// Storage konfig tipi
// --------------------
export interface StorageConfig {
  provider: StorageProvider;
  bucketName?: string; // S3 veya GCS için
  basePath?: string; // Local veya CDN base path
  region?: string; // S3/GCS region
  cdnUrl?: string; // Opsiyonel CDN URL
  accessKeyId?: string; // Opsiyonel (S3/GCS)
  secretAccessKey?: string; // Opsiyonel (S3/GCS)
}

// --------------------
// Upload / Download opsiyonları
// --------------------
export interface UploadOptions {
  path?: string; // Bucket / basePath altındaki alt klasör
  public?: boolean; // Public erişim olacak mı
  contentType?: string; // MIME tipi
  metadata?: Record<string, string>; // Opsiyonel metadata
}

export interface DownloadOptions {
  path?: string;
  versionId?: string; // Opsiyonel version
}

// --------------------
// Dosya meta bilgisi
// --------------------
export interface FileMeta {
  key: string; // Storage key
  url: string; // Public veya signed URL
  size: number; // Byte cinsinden
  contentType: string;
  lastModified: Date;
}
