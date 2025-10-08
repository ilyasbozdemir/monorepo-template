/**
 * @module Metrics
 *
 * Sistem ve uygulama metriklerini toplamak ve yönetmek için merkezi bir paket.
 * Performans, kullanım ve özel metriklerin takibi için kullanılabilir.
 */

export interface Metric {
  /** Metrik adı */
  name: string;
  /** Metrik değeri */
  value: number;
  /** Opsiyonel: Ek bağlam veya detay */
  context?: Record<string, any>;
}

export class MetricsManager {
  private metrics: Metric[] = [];

  /**
   * Yeni bir metrik ekler
   * @param metric Eklenecek metrik
   */
  addMetric(metric: Metric) {
    this.metrics.push(metric);
  }

  /**
   * Belirli bir metrik ismine göre değer döndürür
   * @param name Metrik adı
   * @returns Metric veya undefined
   */
  getMetric(name: string): Metric | undefined {
    return this.metrics.find(m => m.name === name);
  }

  /**
   * Tüm metrikleri döndürür
   */
  listMetrics(): Metric[] {
    return this.metrics;
  }

  /**
   * Tüm metrikleri temizler
   */
  clearMetrics() {
    this.metrics = [];
  }
}
