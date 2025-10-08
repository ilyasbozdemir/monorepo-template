import { BaseDocument } from "../_base/document.base";

export interface PaymentRecord {
  id: string;
  date: number;       // Unix timestamp
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  method: "credit_card" | "bank_transfer" | "other";
}

export interface UserPackage {
  userId: string;           // IAppUserModel.uid
  packageId: string;        // Paket ID'si
  startDate: number;        // Unix timestamp
  endDate: number;          // Unix timestamp
  status: "active" | "expired" | "pending";
  autoRenew: boolean;
  paymentHistory: PaymentRecord[];
}

export interface IAppUserPackageModel extends BaseDocument {
  baseId: string;          
  packages: UserPackage[];
}
