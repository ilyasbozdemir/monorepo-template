/**
 * @module Events
 * @description Bu paket, App_Name sistemindeki tüm eventleri merkezi olarak yönetmek için kullanılır.
 * Hem dinamik event emitter/listener mekanizmasını sağlar, hem de static event isimlerini tip güvenli olarak sunar.
 *
 * @example
 * ```ts
 * const events = new EventsClient();
 *
 * // Dinleyici
 * events.on<{ userId: string }>(EVENTS.USER_REGISTERED, (data) => {
 *   console.log("Yeni kullanıcı geldi:", data.userId);
 * });
 *
 * // Event emit
 * events.emit(EVENTS.ORDER_CREATED, { orderId: "o123" });
 * ```
 */

/** ---------- STATIC EVENTS ---------- */
/**
 * @description Sabit event isimlerini tutar. Tip güvenliği sağlar.
 *
 * @example
 * ```ts
 * console.log(EVENTS.USER_REGISTERED); // "user.registered"
 * ```
 */
export const EVENTS = {
  USER_REGISTERED: "user.registered",
  ORDER_CREATED: "order.created",
  PAYMENT_SUCCESS: "payment.success",
} as const;

/** ---------- CORE DYNAMIC EVENTS ---------- */
import { EventEmitter } from "events";

/**
 * @class EventsClient
 * @description Dinamik event mekanizması: emitter ve listener sağlar.
 *
 * @example
 * ```ts
 * const events = new EventsClient();
 * events.on<{ message: string }>("custom.event", (data) => {
 *   console.log("Event geldi:", data.message);
 * });
 *
 * events.emit("custom.event", { message: "Merhaba!" });
 * ```
 */
export class EventsClient {
  private emitter = new EventEmitter();

  /**
   * Event emit eder.
   * @param event Event adı
   * @param data Event ile gönderilecek veri
   */
  emit<T>(event: string, data: T) {
    this.emitter.emit(event, data);
  }

  /**
   * Event dinleyici ekler.
   * @param event Event adı
   * @param listener Event geldiğinde çağrılacak fonksiyon
   */
  on<T>(event: string, listener: (data: T) => void) {
    this.emitter.on(event, listener);
  }
}
