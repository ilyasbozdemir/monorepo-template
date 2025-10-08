// car-listing-metrics.ts

import { BaseDocument } from "../_base/document.base";

export interface CarListingMetricsModel extends BaseDocument {
  baseId: string;

  viewCount: number; // Görüntülenme sayısı
  favoriteCount: number; // Favori sayısı

  viewLogs?: { userId?: string; date: number }[];
  favoriteLogs?: { userId: string; date: number }[];

  priceHistory?: {
    date: number; // Timestamp
    amount: number; // Fiyat değişikliği
    currency: string; // Para birimi
  }[];
}
