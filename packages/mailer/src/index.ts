/**
 * @module Mailer
 *
 * E-posta gönderme işlemlerini yönetir.
 * Paket tamamen bağımsızdır; başka paketlere bağımlılığı yoktur.
 * Örnek kullanım: bildirim e-postaları, toplu e-postalar, otomatik mesajlar.
 */

/**
 * Mail parametrelerini temsil eder.
 */
export interface MailOptions {
  /** Alıcı e-posta adresi veya adresleri */
  to: string | string[];
  /** Gönderen e-posta adresi */
  from?: string;
  /** E-posta başlığı */
  subject: string;
  /** E-posta gövdesi (HTML veya text) */
  body: string;
  /** Opsiyonel: ekler */
  attachments?: Array<{ filename: string; content: Buffer | string }>;
}

/**
 * Mail gönderici sınıfı
 */
export class Mailer {
  private defaultFrom?: string;

  constructor(defaultFrom?: string) {
    this.defaultFrom = defaultFrom;
  }

  /**
   * E-posta gönderir
   * @param options Mail seçenekleri
   */
  async sendMail(options: MailOptions): Promise<void> {
    const from = options.from || this.defaultFrom;
    if (!from) throw new Error("Gönderen adresi belirtilmedi");

    // TODO: Burada gerçek SMTP veya e-posta servisi adaptörü kullanılacak
    console.log("[Mailer] Sending mail:", { from, to: options.to, subject: options.subject });

    // Örnek: gerçek gönderim için Nodemailer veya başka servis kullanılabilir
    // await smtpClient.sendMail({ from, to: options.to, subject: options.subject, html: options.body });
  }
}
