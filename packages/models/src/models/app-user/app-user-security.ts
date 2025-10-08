import { BaseDocument } from "../_base/document.base";

export interface IAppUserSecurityModel extends BaseDocument {
  baseId: string; 

  twoFactorEnabled: boolean;           // 2FA açık mı?
  twoFactorMethod: "sms" | "app" | null; // 2FA yöntemi

  accountVerification?: {
    email: boolean; // Email doğrulandı mı?
    phone: boolean; // Telefon doğrulandı mı?
  };


}
