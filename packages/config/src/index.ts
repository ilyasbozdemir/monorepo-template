/**
 * @module Config
 * @description App_Name sisteminde merkezi konfigürasyon yönetimi sağlar.
 * Ortam değişkenleri, feature flags ve runtime ayarları tip güvenli olarak sunar.
 *
 * @example
 * ```ts
 * import { ConfigManager } from "@monorepo/config";
 *
 * const config = new ConfigManager();
 * const apiUrl = config.get("API_BASE_URL");
 * console.log(apiUrl); // https://api.ilyasbozdemir.dev
 * ```
 */

/** ---------- CONFIG MANAGER ---------- */
export class ConfigManager {
  private config: Record<string, any> = {};

  constructor(initialConfig?: Record<string, any>) {
    if (initialConfig) {
      this.config = initialConfig;
    }
  }

  /**
   * Config değeri alır.
   * @param key Config anahtarı
   */
  get<T = any>(key: string): T | undefined {
    return this.config[key];
  }

  /**
   * Config değeri set eder veya günceller.
   * @param key Config anahtarı
   * @param value Config değeri
   */
  set<T>(key: string, value: T) {
    this.config[key] = value;
  }

  /**
   * Tüm config değerlerini alır.
   */
  all(): Record<string, any> {
    return { ...this.config };
  }
}
