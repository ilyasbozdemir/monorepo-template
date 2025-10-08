// media-permissions.ts
import { BaseDocument } from "../_base/document.base";

export type TVisibility = "Owner" | "Public" | "Shared" | "None";

type TPermissionEntity = {
  type: "User" | "Role" | "IP_Address";
  value?: string; // Kullanıcı email, rol adı ya da IP adresi
};

interface ISharedMedia {
  mediaId: string; // Paylaşılan medya dosyasının ID'si
  sharedWith?: TPermissionEntity[]; // Paylaşılacak kullanıcılar, roller, IP adresleri vb.
  criteria?: {
    timeWindow?: { start: number; end: number }; // Erişime izin verilen zaman aralığı
    allowedEntities?: TPermissionEntity[]; // Erişime izin verilen kullanıcılar, roller, IP adresleri vb.
    additionalVerification?: boolean; // Ek doğrulama gerekliliği
  };
}

export interface IMediaPermissionsModel extends BaseDocument {
  baseId: string;

  read: TPermissionEntity[];
  write: TPermissionEntity[];

  visibility: TVisibility; // Genel görünürlük durumu

  sharedDetails?: ISharedMedia; // Paylaşım bilgileri (Shared için geçerli)
}
