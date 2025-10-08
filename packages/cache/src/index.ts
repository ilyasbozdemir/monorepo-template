/**
 * @module Cache
 * @description APP_NAME sisteminde merkezi cache yönetimi sağlar.
 * Memory veya Redis gibi providerlar üzerinden tip güvenli cache işlemleri sunar.
 *
 * @example
 * ```ts
 * import { CacheClient } from "@monorepo/cache";
 *
 * const cache = new CacheClient();
 * await cache.set("user:1", { name: "İlyas" }, 3600);
 * const user = await cache.get("user:1");
 * console.log(user); // { name: "İlyas" }
 * ```
 */

/** ---------- CACHE CLIENT ---------- */
export class CacheClient {
  private store: Map<string, any> = new Map();

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    this.store.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => this.store.delete(key), ttlSeconds * 1000);
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.store.get(key);
  }

  async delete(key: string) {
    this.store.delete(key);
  }

  async clear() {
    this.store.clear();
  }
}
