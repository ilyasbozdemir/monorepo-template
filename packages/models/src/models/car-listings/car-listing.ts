// car-listing-core.ts

import { ListingType, ListingStatus } from "@/enums";
import { BaseDocument } from "../_base/document.base";


export interface CarListingCoreModel extends BaseDocument {
  id?: string; // Firebase veya eski sistemden gelen ID, MongoDB _id ile maplemek için

  title: string;
  variantTitle: string;
  slug: string;

  status: ListingStatus;
  listingType: ListingType;

  price: {
    amount: number;
    currency: string;
  };

  bodyType: string;
  transmissionType: string; // Şanzıman tipi (manuel, otomatik, yarı otomatik)

  brand: string;
  model: string;
  submodel?: string;
  year: number;

  imageUrl: string;

  mileage: {
    value: number;
    unit: string;
  };

  listingDate: number;
  publishDate: number;
  updatedAt?: number;
  expiryDate: number;

  sellerUId: string;
}
