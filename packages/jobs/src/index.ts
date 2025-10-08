/**
 * @module Jobs
 *
 * Background task’ları, async iş akışlarını ve cron tabanlı görevleri yönetir.
 * Sunucu tarafında zamanlanmış veya tetiklenen işlemleri merkezi olarak kontrol eder.
 * Paket tamamen bağımsızdır; başka paketlere zorunlu bağımlılığı yoktur.
 */

/**
 * Job parametrelerini temsil eder.
 */
export interface JobParams {
  /** Job adı veya tanımlayıcı */
  name: string;
  /** İşlem fonksiyonu */
  execute: () => Promise<void> | void;
  /** Opsiyonel: İşin tekrar çalışması için cron ifadesi */
  schedule?: string;
  /** Opsiyonel: Ek bağlam bilgisi */
  context?: Record<string, any>;
  /** Opsiyonel: Hata yakalama callback’i */
  onError?: (err: any) => void;
}

/**
 * JobsManager, arka plan işleri için yönetici sınıfıdır.
 * Diğer paketlere bağımlı değildir.
 */
export class JobsManager {
  private jobs: JobParams[] = [];

  /**
   * Yeni bir job ekler.
   * @param job Eklenecek job parametreleri
   */
  addJob(job: JobParams) {
    this.jobs.push(job);
    // Opsiyonel: schedule varsa cron sistemi ile tetikleme
  }

  /**
   * Tüm kayıtlı jobları çalıştırır.
   */
  async runAll() {
    for (const job of this.jobs) {
      try {
        await job.execute();
      } catch (err) {
        if (job.onError) job.onError(err);
        console.error(`[JobsManager] Error in job ${job.name}:`, err);
      }
    }
  }

  /**
   * Belirli bir job’ı adıyla çalıştırır.
   * @param name Çalıştırılacak job adı
   */
  async runJob(name: string) {
    const job = this.jobs.find(j => j.name === name);
    if (!job) return;
    try {
      await job.execute();
    } catch (err) {
      if (job.onError) job.onError(err);
      console.error(`[JobsManager] Error in job ${name}:`, err);
    }
  }

  /**
   * Job listesi döndürür.
   * @returns Job parametreleri listesi
   */
  listJobs(): JobParams[] {
    return this.jobs;
  }
}
