import {
  CollectionApi,
  withFullUrl,
  toActionResult,
  type ActionResult,
  InsertResponse,
} from "@monorepo/apifront";
import { AxiosInstance } from "axios";

/**
 * DatabaseService
 *
 * Belirtilen veritabanındaki koleksiyonlar üzerinde CRUD ve sorgu işlemleri
 * yapmak için kullanılan servis. Kullanıcı verilerini yönetmek için uygundur.
 */
export class DatabaseService {
  private client: AxiosInstance;
  private dbName: string;
  private apiVersion: string;
  private endpoint: string;

  /**
   * DatabaseService oluşturur.
   * @param client Axios HTTP istemcisi
   * @param endpoint API endpoint URL'si
   * @param dbName Hedef veritabanı adı
   * @param apiVersion API versiyonu (default: "v1")
   */
  constructor(
    client: AxiosInstance,
    endpoint: string,
    dbName: string,
    apiVersion: string = "v1"
  ) {
    this.client = client;
    this.dbName = dbName;
    this.apiVersion = apiVersion;
    this.endpoint = endpoint;
  }

  /**
   * Belirtilen koleksiyon üzerinde CRUD ve sorgu işlemleri yapılmasını sağlar.
   * @param name Koleksiyon adı
   */
  collection<T = any>(name: string) {
    return {
      /**
       * Aggregate pipeline çalıştırır.
       * @param pipeline MongoDB pipeline array
       */
      aggregate: async (pipeline: any[]) => {
        try {
          const path = CollectionApi.aggregateRun(name, this.dbName);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.post(fullUrl, pipeline);
          return response.data || [];
        } catch (err: any) {
          console.error("Aggregate run failed:", err);
          throw new Error(err.message || "Sunucudan veri alınamadı");
        }
      },

      /**
       * Tek bir doküman ekler.
       * @param doc Eklenecek doküman
       */
      insert: async (doc: T): Promise<InsertResponse> => {
        try {
          const path = CollectionApi.insertDocument(this.dbName, name);

          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.post(fullUrl, doc);

          //  return toActionResult<T>(response.data);

          return response.data || [];
        } catch (err: any) {
          console.error("Aggregate run failed:", err);
          throw new Error(err.message || "Sunucudan veri alınamadı");
        }
      },

      /**
       * Birden fazla doküman ekler.
       * @param docs Doküman listesi
       */
      insertMany: async (docs: T[]): Promise<{ message: string }> => {
        try {
          const path = CollectionApi.insertManyDocuments(this.dbName, name);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.post(fullUrl, docs);

          return response.data as { message: string };
        } catch (err: any) {
          console.error("InsertMany failed:", err);
          throw new Error(
            err.message || "Sunucuya insertMany işlemi başarısız oldu"
          );
        }
      },

      /**
       * ID ile eşleşen dokümanı günceller.
       * @param id Doküman ID'si
       * @param data Güncellenecek alanlar
       */
      update: async (
        id: string,
        data: Record<string, any>
      ): Promise<{ modifiedCount: number }> => {
        try {
          const path = CollectionApi.updateDocument(this.dbName, name, id);

          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.put(fullUrl, data);
          return response.data || null;
        } catch (err: any) {
          console.error("Update failed:", err);
          throw new Error(err.message || "Update işlemi başarısız oldu");
        }
      },

      /**
       * ID ile eşleşen dokümanı siler.
       * @param id Doküman ID'si
       */
      delete: async (id: string): Promise<{ deletedCount: number }> => {
        try {
          const path = CollectionApi.deleteDocument(this.dbName, name, id);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.delete(fullUrl);
          return response.data || { deletedCount: 0 };
        } catch (err: any) {
          console.error("Delete failed:", err);
          throw new Error(err.message || "Delete işlemi başarısız oldu");
        }
      },

      /**
       * ID'ye göre tek bir dokümanı getirir.
       * @param id Doküman ID'si
       */
      getById: async (id: string): Promise<T | null> => {
        try {
          const path = CollectionApi.getDocument(this.dbName, name, id);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.get(fullUrl);
          return response.data || null;
        } catch (err: any) {
          console.error("GetById failed:", err);
          throw new Error(err.message || "Doküman getirilemedi");
        }
      },
      /**
       * Sayfalanmış şekilde tüm dokümanları getirir.
       * @param page Sayfa numarası
       * @param size Sayfa boyutu
       */
      getAll: async (
        page?: number,
        size?: number
      ): Promise<{
        totalCount: number;
        page: number;
        size: number;
        isPrevious: boolean;
        isNext: boolean;
        data: T[];
      }> => {
        try {
          const path = CollectionApi.getAllDocuments(
            this.dbName,
            name,
            page,
            size
          );
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.get(fullUrl);
          return response.data;
        } catch (err: any) {
          console.error("GetAll failed:", err);
          throw new Error(err.message || "Sunucudan veri alınamadı");
        }
      },
    };
  }
}
