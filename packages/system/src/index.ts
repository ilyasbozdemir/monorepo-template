/**
 * @module System
 * 
 * Bu modül, APP_NAME ekosisteminde kullanılan temel servisleri,
 * konfigürasyonları ve sistem altyapısını temsil eder.
 * 
 * Örnek: API servisleri, Realtime servisleri, Storage, Auth gibi.
 */

export interface ServiceInfo {
  name: string;
  baseUrl: string;
  description?: string;
}

export class SystemRegistry {
  private services: ServiceInfo[] = [];

  /**
   * Servis ekler
   * @param service 
   */
  registerService(service: ServiceInfo) {
    this.services.push(service);
  }

  /**
   * Tüm servisleri döndürür
   */
  listServices(): ServiceInfo[] {
    return this.services;
  }

  /**
   * Servis bilgisi döndürür (name ile)
   * @param name 
   */
  getService(name: string): ServiceInfo | undefined {
    return this.services.find(s => s.name === name);
  }
}

// Örnek singleton kullanım
export const systemRegistry = new SystemRegistry();

// Örnek servis ekleme
systemRegistry.registerService({
  name: "auth",
  baseUrl: "https://auth.ilyasbozdemir.dev",
  description: "Kullanıcı oturum yönetimi"
});

systemRegistry.registerService({
  name: "realtime",
  baseUrl: "https://api.ilyasbozdemir.dev/realtime",
  description: "SignalR / WebSocket servisleri"
});

systemRegistry.registerService({
  name: "storage",
  baseUrl: "https://storage.ilyasbozdemir.dev",
  description: "Dosya ve medya yönetimi"
});
