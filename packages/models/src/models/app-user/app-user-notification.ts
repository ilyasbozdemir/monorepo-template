import { BaseDocument } from "../_base/document.base";

export interface IAppUserNotificationModel extends BaseDocument {
  baseId: string; 

  email?: boolean;     // E-posta bildirimleri açık mı?
  sms?: boolean;       // SMS bildirimleri açık mı?
  push?: boolean;      // Push bildirimleri açık mı?
  newsletter?: boolean; // Bülten aboneliği
  browser?: boolean;   // Tarayıcı bildirimleri
  desktop?: boolean;   // Masaüstü bildirimleri

  digest?: "daily" | "weekly"; // Özet bildirim sıklığı

  quietHours?: {
    enabled: boolean;   // Sessiz saat aktif mi?
    start: string;      // Başlangıç zamanı "HH:MM"
    end: string;        // Bitiş zamanı "HH:MM"
  };
}
