/**
 * @module Notifications
 *
 * Bildirim yönetimi modülü. Uygulama içi (in-site), mobil ve e-posta bildirimlerini merkezi olarak yönetir.
 * Farklı kanallara gönderim için adaptör mantığı ile çalışır.
 *
 * @example
 * // Kanal adaptörlerini kaydetme
 * NotificationManager.registerAdapter('inSite', (params) => {
 *   console.log('In-site notification:', params);
 * });
 * NotificationManager.registerAdapter('email', (params) => {
 *   sendEmail(params.userIds, params.title, params.message);
 * });
 *
 * @example
 * // Bildirim gönderme
 * NotificationManager.send({
 *   title: 'Yeni Mesaj!',
 *   message: 'Merhaba, yeni bir mesajınız var.',
 *   userIds: ['user1', 'user2'],
 *   channel: 'inSite'
 * });
 */

/**
 * Bildirim kanalları
 */
export type NotificationChannel = 'inSite' | 'mobile' | 'email';

/**
 * Bildirim parametreleri
 */
export interface NotificationParams {
  /** Bildirimin başlığı */
  title: string;
  /** Bildirimin içeriği */
  message: string;
  /** Hedef kullanıcı ID'leri */
  userIds: string[];
  /** Gönderim kanalı */
  channel: NotificationChannel;
  /** Opsiyonel ek veriler */
  context?: Record<string, any>;
}

/**
 * NotificationManager, bildirimleri yöneten sınıftır
 */
export class NotificationManager {
  private static adapters: Record<NotificationChannel, (params: NotificationParams) => void> = {} as any;

  /**
   * Kanal bazlı adaptör kaydeder
   * @param channel Kanal tipi
   * @param handler Kanal için gönderim fonksiyonu
   */
  static registerAdapter(channel: NotificationChannel, handler: (params: NotificationParams) => void) {
    this.adapters[channel] = handler;
  }

  /**
   * Bildirim gönderir
   * @param params Bildirim parametreleri
   */
  static send(params: NotificationParams) {
    const handler = this.adapters[params.channel];
    if (!handler) {
      console.warn(`[NotificationManager] No adapter registered for channel: ${params.channel}`);
      return;
    }

    try {
      handler(params);
    } catch (err) {
      console.error(`[NotificationManager] Error sending notification:`, err);
    }
  }
}
