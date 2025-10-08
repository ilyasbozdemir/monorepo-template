import { BaseDocument } from "../_base/document.base";

export interface ISavedSearch {
  id: string; // Kaydedilmiş aramanın benzersiz ID'si
  label: string; // Aramaya verilen isim
  url: string; // Aramanın URL veya sorgu stringi
  createdAt: number;
  lastUsedAt?: number;
}

export interface IAppUserSavedSearchModel extends BaseDocument {
  baseId: string; // IAppUserModel.uid ile ilişkili
  searches: ISavedSearch[];

  createdAt: number; // Favori ekleme tarihi
  updatedAt: number; // Son güncelleme
}
