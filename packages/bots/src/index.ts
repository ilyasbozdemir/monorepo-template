
/**
 * @module Bots
 * @description APP_NAME ekosisteminde otomatik botlar ve agent’ların merkezi paketi.
 * Chat, notification veya otomatik işlemler için kullanılabilir.
 *
 * @example
 * ```ts
 * import { ChatBot } from "@monorepo/bots";
 *
 * const bot = new ChatBot("my-bot");
 * bot.sendMessage("Merhaba!");
 * ```
 */

/** ---------- ÖRNEK BOT SINIFI ---------- */
export class ChatBot {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  sendMessage(message: string) {
    console.log(`[${this.name}] mesaj gönderildi: ${message}`);
  }
}

/** Diğer bot tipleri ve agentlar burada eklenebilir */
