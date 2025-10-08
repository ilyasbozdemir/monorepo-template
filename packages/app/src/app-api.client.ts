import { createApi, AppApiClientConfig } from "@monorepo/core";
import { DatabaseService } from "./services/database.service";
import { DatabaseAdminService } from "./services/database-admin.service";
import { AxiosHeaders, AxiosInstance } from "axios";

/**
 * AppApiClient SDK'sı
 *
 * SDK üzerinden API ve veritabanı işlemleri için ana client.
 * Uygulama içerisinden instance oluşturulur ve verilen config
 * (apiKey, serverBaseUrl, dbName vb.) ile çalışır.
 *
 * @remarks
 * - `db`: DatabaseService üzerinden koleksiyon ve belge işlemleri yapılır.
 * - `dbAdmin`: DatabaseAdminService üzerinden veritabanı yönetimi yapılır.
 * - `client`: AxiosInstance üzerinden HTTP istekleri gönderilir.
 *
 * @example
 * ```ts
 * const client = new AppApiClient({
 *   apiKey: "API_KEY",
 *   serverBaseUrl: "https://api.ilyasbozdemir.dev",
 *   dbName: "defaultDb",
 *   apiVersion: "v1"
 * });
 *
 * await client.db.insert("users", { name: "İlyas" });
 * ```
 */
export class AppApiClient {
  public db: DatabaseService;
  public dbAdmin: DatabaseAdminService;
  private config: AppApiClientConfig;
  public client: AxiosInstance;

  /**
   * App API istemcisini oluşturur.
   * Sağlanan config ile HTTP istemcisi, varsayılan veritabanı servisi
   * ve yönetimsel (adminsel) veritabanı servisi örneklenir.
   *
   * @param config App API istemcisi yapılandırma ayarları
   *  - serverBaseUrl: API sunucusunun temel URL'si
   *  - apiKey: Yetkilendirme anahtarı
   *  - dbName: Varsayılan veritabanı adı
   *  - apiVersion: Kullanılacak API versiyonu (default: "v1")
   */
  constructor(config: AppApiClientConfig) {
    this.config = config;

    this.client = createApi({
      baseURL: config.serverBaseUrl,
      token: config.apiKey,
      defaultHeaders: new AxiosHeaders({ Accept: "application/json" }),
      safeMode: true,
    });

    this.db = new DatabaseService(
      this.client,
      this.config.serverBaseUrl,
      this.config.dbName,
      this.config.apiVersion ?? "v1"
    );

    this.dbAdmin = new DatabaseAdminService(
      this.client,
      this.config.serverBaseUrl,
      this.config.dbName,
      this.config.apiVersion ?? "v1"
    );
  }
}

/**
 * Uygulamanın varsayılan veritabanı servis örneğini döndürür.
 * Bu servis, kullanıcı verileri üzerinde CRUD ve sorgu işlemleri yapmayı sağlar.
 * @param app App API istemcisi
 * @returns Varsayılan veritabanı servisi
 */
export const getDatabase = (app: AppApiClient) => app.db;

/**
 * Uygulamanın yönetimsel (adminsel) veritabanı servis örneğini döndürür.
 * Bu servis, veritabanı ve koleksiyon seviyesinde işlemler
 * (oluşturma, silme, listeleme vb.) yapmak için kullanılır.
 * @param app App API istemcisi
 * @returns Yönetimsel veritabanı servisi
 */
export const getDatabaseAdmin = (app: AppApiClient) => app.dbAdmin;

/**
 * Uygulamanın HTTP istemci (Axios) örneğini döndürür.
 * @param app App API istemcisi
 * @returns Axios istemcisi
 */
export const getAxiosInstance = (app: AppApiClient) => app.client;
