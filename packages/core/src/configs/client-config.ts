/**
 * Kullanılabilir kimlik doğrulama sağlayıcıları.
 */
export type AuthProvider = "keycloak" | "oauth" | "firebase";

/**
 * Kullanılabilir depolama sağlayıcıları.
 */
export type StorageProvider = "S3" | "GCS" | "Azure";

/**
 * Keycloak master kullanıcı yapılandırması.
 */
export type MasterAuthConfig = {
  keycloakUrl: string;
  realm: string;
  clientId: string;
  adminUsername: string;
  adminPassword: string;
};

/**
 * Keycloak uygulama kullanıcı yapılandırması.
 */
export type AppAuthConfig = {
  keycloakUrl: string;
  realm: string;
  clientId: string;
};

/**
 * Genel kimlik doğrulama yapılandırması.
 */
export type AuthConfig = {
  provider: AuthProvider;
  keycloakUrl: string;
  authDomain: string;
  master?: MasterAuthConfig;
  app?: AppAuthConfig;
};

/**
 * Depolama bucket yapılandırması.
 */
// Storage config
export type BucketConfig = {
  name: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/**
 * Genel depolama yapılandırması.
 */
export type StorageConfig = {
  provider: StorageProvider;
  buckets: {
    main: BucketConfig;
    backup?: BucketConfig;
  };
};

/**
 * AppApiClientConfig API client ana yapılandırması.
 */
export type AppApiClientConfig = {
  /** API anahtarı */
  apiKey: string;
  /** API sunucu URL'si */
  serverBaseUrl: string;
  /** API versiyonu (opsiyonel) */
  apiVersion?: string;
  /** Varsayılan veritabanı */
  dbName: string;
  /** Kimlik doğrulama yapılandırması (opsiyonel) */
  auth?: AuthConfig;
  /** Depolama yapılandırması (opsiyonel) */
  storage?: StorageConfig;
  /** Analitik ID (opsiyonel) */
  analyticsId?: string;
};