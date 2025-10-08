// car-listing-messaging.ts

import { BaseDocument } from "../_base/document.base";

interface ListingMessage {
  id: string;
  senderUid: string; // Gönderen (örn: "Potansiyel Alıcı", "Sistem")
  content: string; // Mesaj içeriği
  at: number; // Mesajın gönderildiği zaman damgası
  isRead: boolean; // Mesajın okunup okunmadığı
}

export interface CarListingMessageModel extends BaseDocument {
  baseId: string;
  messageData?: ListingMessage;
}
