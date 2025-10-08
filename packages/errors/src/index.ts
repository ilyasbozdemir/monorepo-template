export interface ErrorParams {
  /**
   * Hata seviyesini belirtir.
   * - info: Bilgilendirme
   * - warning: Uyarı
   * - error: Standart hata
   * - critical: Kritik hata
   */
  level?: "info" | "warning" | "error" | "critical";

  /**
   * Hatanın etiketleri
   * @example ["auth", "login"]
   */
  tags?: string[];

  /**
   * Kullanıcı bilgileri
   * @example { id: "123", email: "user@test.com" }
   */
  user?: Record<string, any>;

  /**
   * Özel ek alanlar (örn: requestId, device, ip vs.)
   */
  [key: string]: any;
}

/**
 * Hata yakalayıcı adaptör interface’i.
 * Her adaptör (örn: Sentry, LogRocket, Datadog) bu interface’i implemente eder.
 */
export interface ErrorHandler {
  /**
   * Hata yakalandığında çağrılır.
   *
   * @param error   Yakalanan hata objesi
   * @param context Hatanın oluştuğu bağlam (örn: { module: "auth" })
   * @param params  Ek hata parametreleri (seviyesi, kullanıcı, tagler vb.)
   */
  capture: (
    error: any,
    context?: Record<string, any>,
    params?: ErrorParams
  ) => void;
}

/**
 * ErrorManager
 *
 * Merkezi hata yönetim sistemi.
 * Tüm hata yakalayıcı adaptörleri kaydedip (örn: Sentry, LogRocket),
 * capture çağrıldığında hepsine iletir.
 *
 * @example
 * import { ErrorManager } from "@monorepo/errors";
 *
 * // Örn: Sentry adaptörü kaydet
 * ErrorManager.register({
 *   capture: (err, ctx, params) => {
 *     Sentry.captureException(err, { extra: { ...ctx, ...params } });
 *   },
 * });
 *
 * // Hata yakalama
 * try {
 *   throw new Error("Test error");
 * } catch (err) {
 *   ErrorManager.capture(err, { module: "auth" }, { level: "error" });
 * }
 */
class ErrorManager {
  private static handlers: ErrorHandler[] = [];

  /**
   * Yeni bir hata yakalayıcı adaptör kaydeder.
   *
   * @param handler ErrorHandler implementasyonu (örn: SentryAdapter)
   */
  static register(handler: ErrorHandler) {
    this.handlers.push(handler);
  }

  /**
   * Hata yakalar ve tüm kayıtlı adaptörlere iletir.
   *
   * @param error   Yakalanan hata objesi
   * @param context Hatanın oluştuğu bağlam (opsiyonel)
   * @param params  Ek hata parametreleri (opsiyonel)
   */
  static capture(
    error: any,
    context?: Record<string, any>,
    params?: ErrorParams
  ) {
    // Konsola yaz (geliştirme için)
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorManager]", error, context, params);
    }

    // Tüm kayıtlı handler’lara gönder
    for (const handler of this.handlers) {
      try {
        handler.capture(error, context, params);
      } catch (err) {
        console.error("[ErrorManager] Handler error:", err);
      }
    }
  }
}

export { ErrorManager };