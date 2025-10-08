import { BaseDocument } from "../_base/document.base";
import { EMediaGeneralCategory, EMediaType } from "./media-details";
import { TVisibility } from "./media-permissions";

export interface ITrashedMediaModel extends BaseDocument {
  id: string; // Medya dosyasının benzersiz kimliği

  baseId: string;

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