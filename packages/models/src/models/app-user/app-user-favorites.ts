import { BaseDocument } from "../_base/document.base";

export interface IAppUserFavoritesModel extends BaseDocument {
  baseId: string; 

  listings?: string[]; // Favori ilan ID’leri
  createdAt: number;   // Favori ekleme tarihi
  updatedAt: number;   // Son güncelleme
}
