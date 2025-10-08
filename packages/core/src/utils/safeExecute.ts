/**
 * Güvenli bir şekilde async/sync işlemleri çalıştırır.
 * Hata yönetimi ve cleanup callbackleri sağlar.
 *
 * @example
 * import { safeExecute } from '@monorepo/core';
 *
 * await safeExecute(
 *   async () => {
 *     // Ana işlem
 *     await db.insert(doc);
 *   },
 *   (err) => {
 *     // Hata yönetimi: loglama, UI bilgilendirme, Sentry vs.
 *     console.error(err);
 *     @monorepo/errors.capture(err); // opsiyonel merkezi log
 *   },
 *   () => {
 *     // Cleanup veya state güncellemesi
 *     setLoading(false);
 *   }
 * );
 *
 * @param tryCallback Çalıştırılacak ana işlem
 * @param catchCallback Hata yakalandığında çağrılacak callback (opsiyonel)
 * @param finallyCallback İşlem sonunda her zaman çalışacak callback (opsiyonel)
 */
export async function safeExecute<T>(
  tryCallback: () => Promise<T> | T,
  catchCallback?: (err: any) => void,
  finallyCallback?: () => void
) {
  try {
    const result = await tryCallback();
    return result;
  } catch (err) {
    if (catchCallback) catchCallback(err);
  } finally {
    if (finallyCallback) finallyCallback();
  }
}
