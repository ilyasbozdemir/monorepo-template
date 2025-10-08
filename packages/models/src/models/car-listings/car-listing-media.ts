// car-listing-media.ts

import { BaseDocument } from "../_base/document.base";

export interface CarListingMediaModel extends BaseDocument {
  baseId: string;

  approvedImages?: {
    category: string; // Örn: "Interior", "Engine"
    src: string; // Onaylanan görsel URL'si
    note?: string; // Opsiyonel açıklama
  }[];

  images: {
    Front: string[]; // Ön görüntü
    Rear: string[]; // Arka görüntü
    Side: string[]; // Yan görüntü
    Interior: string[]; // İç mekan görüntüsü
    Engine: string[]; // Motor görüntüsü
    Console: string[]; // Konsol görüntüsü
    Other: string[]; // Diğer görüntüler
  };

  rejectedImages?: {
    category: string; // Örn: "Interior", "Engine"
    src: string; // Reddedilen görsel URL'si
    reason?: string; // Opsiyonel açıklama
  }[];
}
