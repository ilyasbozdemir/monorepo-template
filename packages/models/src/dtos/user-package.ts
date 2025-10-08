import { PaymentRecord } from "./payment-record";

export interface UserPackage {
  userId: string; // Kullanıcı ID'si
  packageId: string; // Paket ID'si
  startDate: number; // Başlangıç tarihi (Unix timestamp)
  endDate: number; // Bitiş tarihi (Unix timestamp)
  status: "active" | "expired" | "pending"; // Abonelik durumu
  autoRenew: boolean; // Otomatik yenileme
  paymentHistory: PaymentRecord[]; // Ödeme geçmişi
}
