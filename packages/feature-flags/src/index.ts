/**
 * @module FeatureFlags
 * @description APP_NAME uygulamasında feature flag yönetimi için merkezi paket.
 * Özelliklerin aktif/pasif durumlarını tip güvenli olarak kontrol etmeyi sağlar.
 *
 * @example
 * ```ts
 * import { FeatureFlags } from "@monorepo/feature-flags";
 *
 * // Özellik kontrolü
 * if (FeatureFlags.isEnabled("NEW_CHECKOUT")) {
 *   console.log("Yeni checkout aktif.");
 * }
 * ```
 */

/** ---------- FEATURE FLAGS ---------- */
export const FeatureFlags = {
  NEW_CHECKOUT: true,
  BETA_PROFILE_PAGE: false,
  DARK_MODE: true
} as const;

/**
 * Flag kontrol fonksiyonu
 * @param flagName Feature flag adı
 */
export function isEnabled(flagName: keyof typeof FeatureFlags): boolean {
  return FeatureFlags[flagName];
}
