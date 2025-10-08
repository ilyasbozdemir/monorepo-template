/**
 * @module Search
 *
 * Merkezi arama işlevlerini yönetir.
 * Farklı veri kaynakları için filtreleme ve sonuçları getirme işlevleri sağlar.
 * Örnek kullanım: araç araması, kullanıcı araması, ilan araması.
 */

export interface SearchParams {
  /** Aranacak anahtar kelime */
  query: string;
  /** Opsiyonel: filtreleme kriterleri */
  filters?: Record<string, any>;
  /** Opsiyonel: sayfalama bilgisi */
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
}

/**
 * SearchManager, arama işlemlerini yönetir.
 */
export class SearchManager {
  constructor(private dataSources: Record<string, any[]> = {}) {}

  /**
   * Belirli bir kaynakta arama yapar
   * @param source Arama yapılacak veri kaynağı
   * @param params Arama parametreleri
   * @returns Arama sonuçları
   */
  search<T>(source: string, params: SearchParams): SearchResult<T> {
    const items = this.dataSources[source] ?? [];
    const filtered = items.filter((item: any) =>
      item.name?.toLowerCase().includes(params.query.toLowerCase())
    );
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    return {
      items: paged,
      total: filtered.length
    };
  }

  /**
   * Yeni veri kaynağı ekler
   * @param name Kaynak adı
   * @param items Veri dizisi
   */
  addDataSource<T>(name: string, items: T[]) {
    this.dataSources[name] = items;
  }
}
