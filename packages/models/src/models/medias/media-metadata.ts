// media-metadata.ts
import { BaseDocument } from "../_base/document.base";

interface IETagHistory {
  etag: string; // Dosyanın önceki ETag değeri
  updatedAt: number; // Unix timestamp
  updatedById?: string; // Güncelleyen kullanıcı ID
}

export interface IMediaMetadataModel extends BaseDocument {
  baseId: string;

  etag?: string; //  Güncel ETag,  Dosya hash'i
  etagHistory?: IETagHistory[]; // Önceki ETag kayıtları

  
}
