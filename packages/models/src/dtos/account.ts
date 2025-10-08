// Hesap (Account) Modeli
export interface IAccount {
  id: string; // Hesap ID'si
  customerId: string; // Hangi müşteri ile ilişkili olduğunu belirtir
  name: string; // Hesap adı (örneğin: "Ana Hesap", "Tasarruf Hesabı")
  type: "checking" | "savings" | "business" | "other"; // Hesap türü
  balance: number; // Müşterinin mevcut bakiyesi
  currency: string; // Kullanılacak para birimi (örn. USD, EUR, TRY)
  transactions?: ITransaction[]; // Hesapla ilişkili işlemler (gelir, gider)
}

// Hesap işlemleri (Gelir, Gider)
export interface ITransaction {
  id: string; // İşlem ID'si
  accountId: string; // İlgili hesabın ID'si
  amount: number; // İşlem tutarı (pozitif gelir, negatif gider)
  type: "credit" | "debit"; // İşlem türü (kredi veya borç)
  date: number; // İşlem tarihi (Unix timestamp)
  currency: string; // İşlem yapılan para birimi (örn. USD, EUR, TRY)
  description?: string; // İşlem açıklaması (opsiyonel)
  receiptUrl?: string; // İşlemle ilgili makbuz dosyasının URL'si (opsiyonel)
}


// IBAN Hesap Bilgisi Modeli
export interface IBankAccount {
    id: string; // Hesap ID'si
    customerId: string; // Müşteri ID'si (hangi müşteri ile ilişkili olduğu)
    accountHolderName: string; // Hesap sahibinin adı
    bankName: string; // Banka adı
    iban: string; // IBAN numarası
    status: "approved" | "pending" | "rejected"; // Hesap durumunu belirtir (onaylı, bekliyor, reddedildi)
    currency: string; // Hesap para birimi (örn. TRY, USD, EUR)
    createdAt: number; // Hesap oluşturulma tarihi (Unix timestamp)
    updatedAt: number; // Hesap güncellenme tarihi (Unix timestamp)
  }
  