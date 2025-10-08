import { BaseDocument } from "../_base/document.base";

export interface ITransaction {
  id: string;          // İşlem ID'si
  accountId: string;   // İlgili hesap ID'si
  amount: number;      // İşlem tutarı (+ gelir, - gider)
  type: "credit" | "debit"; 
  date: number;        // Unix timestamp
  currency: string;
  description?: string;
  receiptUrl?: string;
}

export interface IAccount {
  id: string;          // Hesap ID'si
  customerId: string;  // Kullanıcı ID (IAppUserModel.uid)
  name: string;        // Örn: "Ana Hesap"
  type: "checking" | "savings" | "business" | "other";
  balance: number;
  currency: string;
  transactions?: ITransaction[];
}

export interface IAppUserAccountModel extends BaseDocument {
  baseId: string; 
  accounts: IAccount[];
}
