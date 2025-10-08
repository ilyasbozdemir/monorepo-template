// Ödeme kaydı
export interface PaymentRecord {
  id: string;
  date: number; // Unix timestamp
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  method: "credit_card" | "bank_transfer" | "other";
}
