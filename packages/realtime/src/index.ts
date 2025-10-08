/**
 * @module Realtime
 * 
 * SignalR/WebSocket tabanlı gerçek zamanlı iletişim sağlar.
 * Bu modül, sunucu ile client arasında event tabanlı veri alışverişini yönetir.
 * Örnek kullanım için `realtime.example.ts` dosyasına bakabilirsiniz.
 * 
 * @example
 * import { RealtimeClient } from "@monorepo/realtime";
 * 
 * async function example() {
 *   const realtime = new RealtimeClient("https://api.example.com/hub");
 *   await realtime.connect();
 *   realtime.on<{ message: string }>("new-notification", (data) => {
 *     console.log("Yeni bildirim:", data.message);
 *   });
 *   await realtime.emit("SendNotification", { userId: "u123", message: "Merhaba!" });
 * }
 */
import * as signalR from "@microsoft/signalr";

/**
 * RealtimeClient sınıfı, SignalR Hub bağlantısını yönetir.
 */
export class RealtimeClient {
  private connection: signalR.HubConnection | null = null;

  /**
   * @param url Bağlanılacak Hub URL'si
   */
  constructor(private url: string) {}

  /** SignalR / WebSocket bağlantısını başlatır */
  async connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();
    await this.connection.start();
  }

  /**
   * Event dinleme
   * @param event Event adı
   * @param callback Callback fonksiyonu
   */
  on<T>(event: string, callback: (data: T) => void) {
    this.connection?.on(event, callback);
  }

  /**
   * Event gönderme
   * @param event Event adı
   * @param data Gönderilecek veri
   */
  emit(event: string, data: any) {
    this.connection?.invoke(event, data);
  }

  /** Bağlantıyı sonlandırır */
  async disconnect() {
    await this.connection?.stop();
  }
}
