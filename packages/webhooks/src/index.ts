/**
 * @module Webhooks
 * 
 * Bu modül, App_Name sisteminde kullanılan webhook eventlerini
 * merkezi olarak yönetir ve tetiklemeyi sağlar.
 * 
 * Örnek: "order.created", "payment.success", "user.registered"
 */

export type WebhookCallback<T = any> = (payload: T) => void;

export interface WebhookEvent<T = any> {
  name: string;
  callback: WebhookCallback<T>;
}

export class WebhookRegistry {
  private events: Map<string, WebhookCallback[]> = new Map();

  /**
   * Event kaydı oluşturur
   * @param name Event adı
   * @param callback Event tetiklendiğinde çalışacak fonksiyon
   */
  register<T>(name: string, callback: WebhookCallback<T>) {
    if (!this.events.has(name)) {
      this.events.set(name, []);
    }
    this.events.get(name)!.push(callback);
  }

  /**
   * Event tetikler
   * @param name Event adı
   * @param payload Event payload'u
   */
  trigger<T>(name: string, payload: T) {
    const callbacks = this.events.get(name) || [];
    callbacks.forEach(cb => cb(payload));
  }

  /**
   * Tüm eventleri listeler
   */
  listEvents(): string[] {
    return Array.from(this.events.keys());
  }
}

// Örnek singleton kullanım
export const webhooks = new WebhookRegistry();

// Örnek event ekleme
webhooks.register("order.created", (payload: { orderId: string }) => {
  console.log("Yeni sipariş oluşturuldu:", payload.orderId);
});

webhooks.register("payment.success", (payload: { paymentId: string }) => {
  console.log("Ödeme başarılı:", payload.paymentId);
});
