
// serverless functions

/**
 * @module Functions
 * @description App_Name sisteminde kullanılan temel fonksiyonları merkezi olarak sağlar.
 * Başlangıç için örnek olarak sayfa yönlendirme, rol kontrol ve basit loglama fonksiyonları eklenmiştir.
 *
 * @example
 * ```ts
 * import { redirectTo, hasRole, logEvent } from "@monorepo/functions";
 *
 * redirectTo("/dashboard");
 * console.log(hasRole("admin")); // true/false
 * logEvent("USER_LOGIN", { userId: 123 });
 * ```
 */

/** ---------- Redirect helper ---------- */
export const redirectTo = (url: string) => {
  if (typeof window !== "undefined") {
    window.location.href = url;
  } else {
    console.log(`[Redirect simulated]: ${url}`);
  }
};

/** ---------- Role checker ---------- */
export const hasRole = (role: string, userRoles: string[] = []) => {
  return userRoles.includes(role);
};

/** ---------- Simple logger ---------- */
export const logEvent = (event: string, payload?: Record<string, any>) => {
  console.log(`[EVENT] ${event}`, payload || {});
};

/** ---------- Delay / Sleep helper ---------- */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
