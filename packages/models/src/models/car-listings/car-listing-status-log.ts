// car-listing-status-log.ts

import { BaseDocument } from "../_base/document.base";

import { ListingStatus } from "@/enums";


// Araç ilanının durum değişikliklerini loglamak için
// su anlık off durumda
export interface CarListingStatusLogModel extends BaseDocument {
  baseId: string;
  previousStatus: ListingStatus;
  newStatus: ListingStatus;
  changedBy: string;       // uid veya "system"
  changedAt: number;       // timestamp
  note?: string;           // opsiyonel açıklama
}
