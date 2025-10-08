// services/database-admin.service.ts
import {
  CollectionApi,
  DatabaseApi,
  DatabaseCreateResponse,
  DatabaseDeleteResponse,
  withFullUrl,
} from "@monorepo/apifront";
import { DatabaseSummary } from "@monorepo/core";
import { AxiosInstance } from "axios";

/**
 * DatabaseAdminService
 *
 * Yönetimsel veritabanı işlemleri için kullanılan servis.
 * Bu servis ile veritabanı ve koleksiyon seviyesinde işlemler
 * (oluşturma, silme, listeleme) yapılabilir.
 */
export class DatabaseAdminService {
  private client: AxiosInstance;
  private dbName: string;
  private apiVersion: string;
  private endpoint: string;

  /**
   * DatabaseAdminService oluşturur.
   * @param client Axios HTTP istemcisi
   * @param endpoint API endpoint URL'si
   * @param dbName Varsayılan veritabanı adı
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
   * Veritabanı üzerinde yönetimsel işlemler yapmayı sağlar.
   * @param name Veritabanı adı
   */
  database(name: string) {
    return {
      /**
       * Yeni veritabanı oluşturur.
       * @returns InsertResponse veya null
       */
      create: async (): Promise<DatabaseCreateResponse> => {
        try {
          const path = DatabaseApi.create(name);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.post(fullUrl, { name });
          return response.data;
        } catch (err: any) {
          return {
            statusCode: 500,
            status: false,
            message: err?.message || "Failed to create database",
          };
        }
      },

      /**
       * Verilen adı taşıyan veritabanını siler.
       * @returns Başarı durumu ve mesaj
       */
      delete: async (
        force: boolean = false
      ): Promise<DatabaseDeleteResponse> => {
        try {
          const path = DatabaseApi.delete(name, force);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);


          const response = await this.client.delete(fullUrl);
          return (
            response.data || {
              success: false,
              message: "Silme işlemi başarısız",
            }
          );
        } catch (err: any) {
          console.error("Database delete failed:", err);
          throw new Error(err.message || "Veritabanı silinemedi");
        }
      },

      /**
       * Tüm koleksiyonları listeler.
       * @returns Koleksiyon adlarının listesi
       */
      listCollections: async (): Promise<DatabaseSummary[]> => {
        try {
          const path = DatabaseApi.summaryList();
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.get(fullUrl);
          return response.data || [];
        } catch (err: any) {
          console.error("List collections failed:", err);
          throw new Error(err.message || "Collection listesi alınamadı");
        }
      },
      listCollectionDetails: async (): Promise<DatabaseSummary[]> => {
        try {
          const path = DatabaseApi.details(name);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.get(fullUrl);

          return response.data || [];
        } catch (err: any) {
          console.error("List collections failed:", err);
          throw new Error(err.message || "Collection listesi alınamadı");
        }
      },
    };
  }

  /**
   * Koleksiyon üzerinde yönetimsel işlemler yapmayı sağlar.
   * @param name Koleksiyon adı
   */
  collection<T = any>(name: string) {
    return {
      /**
       * Yeni koleksiyon oluşturur.
       * @returns API yanıtı
       */
      create: async () => {
        try {
          const path = CollectionApi.createCollection(this.dbName, name);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.post(fullUrl);

          return response.data || [];
        } catch (err: any) {
          console.error("Aggregate run failed:", err);
          throw new Error(err.message || "Sunucudan veri alınamadı");
        }
      },

      /**
       * Belirtilen koleksiyonu siler.
       * @returns API yanıtı
       */
      delete: async () => {
        try {
          const path = CollectionApi.deleteCollection(this.dbName, name);
          const fullUrl = withFullUrl(this.endpoint, this.apiVersion, path);

          const response = await this.client.delete(fullUrl);

          return response.data || [];
        } catch (err: any) {
          console.error("Aggregate run failed:", err);
          throw new Error(err.message || "Sunucudan veri alınamadı");
        }
      },
    };
  }
}
