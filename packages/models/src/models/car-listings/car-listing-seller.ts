// car-listing-seller.ts

import { UserType } from "@/enums/app-user";
import { BaseDocument } from "../_base/document.base";

export interface CarListingSellerModel extends BaseDocument {
  baseId: string;

  uid: string;
  name: string;
  type: UserType;
  phone?: string;
  location?: string;
  memberSince?: string; // Üyelik tarihi
  verifiedSeller?: boolean;
  badges?: string[]; // Örn: ["Yeni Üye", "Doğrulanmış"]
  contactPreferences?: {
    allowDirectPhone: boolean;
    allowWebsiteMessaging: boolean;
    allowPhoneMessaging?: boolean;
  };
}
