import { OrderType } from "./order";

export interface Address {
  id: string; // Adresin benzersiz ID'si
  profileId: string; // Kullanıcı profil ID'si (IAppUser -> userId ile eşleşir)
  label: string; // Adres etiketi (örneğin: "Ev Adresi" veya "Ofis Adresi")
  name: string; // Adreste kullanılan ad
  surname: string; // Adreste kullanılan soyad
  mailAddress: string; // E-posta adresi
  phone?: {
    countryCode: string;
    number: string;
  };
  country: string; // Ülke
  province: string; // Bölge/eyalet
  city: string; // Şehir
  addressDetail: string; // Detaylı adres bilgisi
  addressType: "billing" | "shipping" | "both"; // Adres tipi (fatura, teslimat veya her ikisi)
  isDefault: boolean; // Varsayılan adres mi?
  latitude?: number; // Coğrafi koordinat - enlem (opsiyonel)
  longitude?: number; // Coğrafi koordinat - boylam (opsiyonel)
}

export interface AddressTypeSettings {
  orderType: OrderType; // Sipariş türü (physical veya digital)
  billing: boolean; // Fatura adresi açık mı?
  shipping: boolean; // Teslimat adresi açık mı?
  both: boolean; // Hem fatura hem teslimat için açık mı?
}
