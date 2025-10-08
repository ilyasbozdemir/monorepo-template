import { BaseDocument } from "./document.base";

// bu aslındda dot ent core ile olucak dot net api tarafında :)
export interface ICollectionAuditModel extends BaseDocument {
  baseId: string; // İlgili koleksiyonun document ID'si
  collectionName: string; // Hangi koleksiyon
  action: "create" | "update" | "delete" | "access"; // Yapılan işlem
  performedById?: string; // İşlemi yapan kullanıcı ID
  performedByEmail?: string; // İşlemi yapan kullanıcı email
  timestamp: number; // İşlem zamanı
  notes?: string; // Opsiyonel açıklama
}
