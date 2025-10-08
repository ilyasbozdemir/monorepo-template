import { BaseDocument } from "../_base/document.base";

export interface ISupportRequestMessage {
  messageId: string;
  senderId: string;           // Mesajı gönderen kullanıcı ID'si
  content: string;
  timestamp: number;          // Unix timestamp
  messageType: "text" | "file";
  relatedAdId?: string;       // Eğer mesaj bir ilana aitse
  readStatus: boolean;        // Mesaj okundu mu
}

export interface ISupportRequest {
  requestId: string;
  userId: string;             // Destek talebini açan kullanıcı ID'si
  department: "technical" | "advertising" | "payment" | "other";
  title: string;
  status: "pending" | "inProgress" | "resolved" | "closed";
  createdAt: number;
  updatedAt: number;
  priority: "low" | "medium" | "high";
  assignedTo?: string;        // Destek görevlisi ID
  attachments?: string[];     // Dosya URL’leri
  messages: ISupportRequestMessage[];
}

export interface IAppUserSupportRequestModel extends BaseDocument {
  baseId: string;             // IAppUserModel.uid ile ilişkili
  supportRequests: ISupportRequest[];
}
