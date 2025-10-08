/**
 * @module Static
 * @description App_Name sisteminde kullanılan sabit değerleri merkezi olarak sağlar.
 * Başlangıç için kullanıcı rolleri, durumlar ve temel URL’ler örnek olarak eklenmiştir.
 *
 * @example
 * ```ts
 * import { ROLES, STATUSES, URLS } from "@monorepo/static";
 *
 * console.log(ROLES.ADMIN);       // "admin"
 * console.log(STATUSES.ACTIVE);   // "active"
 * console.log(URLS.DASHBOARD);    // "/dashboard"
 * ```
 */

/** ---------- USER ROLES ---------- */
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
} as const;

/** ---------- USER STATUSES ---------- */
export const STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending"
} as const;

/** ---------- STATIC URLS ---------- */
export const URLS = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard"
} as const;
