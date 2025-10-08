/**
 * @module Services
 *
 * APP_NAME ekosisteminde kullanılan farklı servisleri yönetir.
 * Örnek kullanım: API çağrıları, veri senkronizasyonu, üçüncü taraf entegrasyonları.
 */


// ornektir ayaralanıcaktır

import axios from "axios";

export interface ServiceConfig {
  name: string;
  baseUrl: string;
}

export class ServicesManager {
  private services: Record<string, ServiceConfig> = {};

  /**
   * Yeni bir servis ekler
   * @param config Servis konfigürasyonu
   */
  addService(config: ServiceConfig) {
    this.services[config.name] = config;
  }

  /**
   * Servis bilgisi döndürür
   * @param name Servis adı
   */
  getService(name: string): ServiceConfig | undefined {
    return this.services[name];
  }

  /**
   * Belirli bir servise GET isteği yapar
   * @param name Servis adı
   * @param endpoint Endpoint yolu
   */
  async get(name: string, endpoint: string) {
    const service = this.services[name];
    if (!service) throw new Error(`Service ${name} bulunamadı`);
    const response = await axios.get(`${service.baseUrl}${endpoint}`);
    return response.data;
  }
}
