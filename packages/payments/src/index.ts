/**
 * @module Payments
 *
 * Ödeme yönetimi modülü. Farklı ödeme sağlayıcıları (gateway) için adaptör mantığı sağlar.
 * Tek bir merkezi noktadan ödeme işlemlerini başlatabilir ve takip edebilirsiniz.
 *
 * @example
 * // Gateway adaptörü kaydetme
 * PaymentManager.registerGateway('stripe', async (payment) => {
 *   console.log('Stripe ile ödeme:', payment.amount, payment.currency);
 *   return { success: true, transactionId: 'trx_123' };
 * });
 *
 * @example
 * // Ödeme başlatma
 * const result = await PaymentManager.pay({
 *   gateway: 'stripe',
 *   amount: 100,
 *   currency: 'USD',
 *   userId: 'user1'
 * });
 * console.log(result.success); // true
 */

/**
 * Ödeme parametreleri
 */
export interface PaymentParams {
  /** Ödeme yapılacak gateway adı */
  gateway: string;
  /** Ödeme miktarı */
  amount: number;
  /** Para birimi */
  currency: string;
  /** Ödeme yapan kullanıcı ID */
  userId: string;
  /** Opsiyonel: Ek bağlam verisi */
  context?: Record<string, any>;
}

/**
 * Ödeme sonucu
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * PaymentManager, merkezi ödeme yönetim sınıfıdır
 */
export class PaymentManager {
  private static gateways: Record<string, (payment: PaymentParams) => Promise<PaymentResult>> = {};

  /**
   * Gateway adaptörü kaydeder
   * @param name Gateway adı
   * @param handler Ödeme fonksiyonu
   */
  static registerGateway(
    name: string,
    handler: (payment: PaymentParams) => Promise<PaymentResult>
  ) {
    this.gateways[name] = handler;
  }

  /**
   * Ödeme başlatır
   * @param params Ödeme parametreleri
   * @returns Ödeme sonucu
   */
  static async pay(params: PaymentParams): Promise<PaymentResult> {
    const gateway = this.gateways[params.gateway];
    if (!gateway) {
      return { success: false, error: `Gateway not registered: ${params.gateway}` };
    }

    try {
      return await gateway(params);
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unknown error' };
    }
  }
}
