// media-core.ts
import { BaseDocument } from "../_base/document.base";

/**
 * Temel medya dosyası modelidir.
 * Bu yapı, tüm medya türleri için ortak olan alanları içerir.
 * Detaylı metadata veya izin yapıları `media-details.ts` içinde tanımlanır.
 */
export interface IMediaCoreModel extends BaseDocument {
  id?: string; // Firebase veya harici sistem ID'si (opsiyonel, MongoDB _id ile maplenir)

  filePath: string; // Dosyanın fiziksel veya sanal yolu
  fileDirectoryName: string; // Dosyanın bulunduğu klasör veya kategori adı
  fileName: string; // Görünen dosya adı (örneğin: "banner.png")
  physicalName?: string; // Gerçek sistemdeki dosya adı (örneğin: "file_12345.png")
  providerCdnUrl?: string;


  cdnUrl?: string; // CDN üzerinden doğrudan erişim URL'si
  url?: string; // Dosyanın genel veya base URL üzerinden erişim adresi

  extension?: string; // Dosya uzantısı (örnek: .png, .jpg)
  size?: number; // Byte cinsinden dosya boyutu

  createdAt: number; // Unix timestamp
  updatedAt?: number;
}
