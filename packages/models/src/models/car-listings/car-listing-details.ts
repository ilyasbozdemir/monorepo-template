// car-listing-details.ts

import { BaseDocument } from "../_base/document.base";

export interface CarListingDetailsModel extends BaseDocument {
  baseId: string;

  fuelType: string; // Yakıt tipi (benzin, dizel, LPG, elektrikli)

  engineVolume?: string; // Motor hacmi
  enginePower?: string; // Motor gücü
  driveType?: string; // Tahrik sistemi (4x4, 4x2, vb.)
  steeringType: string;

  isPriceHidden: boolean; // Fiyat gizli mi?
  isNegotiable: boolean; // Fiyat pazarlık payı var mı?
  isExchange?: boolean; // Takas ilanı mı?

  location: {
    country: string; // Ülke
    city: string; // Şehir
    district: string; // İlçe
  };
}
