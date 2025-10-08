// @monorepo/core/env.ts
/**
 * Bu değişken, uygulamanın Staging ortamında olup olmadığını kontrol eder.
 * Çalışması için Vercel üzerinde deploy edilmiş olması ve
 * VERCEL_ENV ile VERCEL_GIT_COMMIT_REF değişkenlerinin ayarlı olması gerekir.
 */
export const isStaging =
  process.env.VERCEL_ENV === "preview" &&
  process.env.VERCEL_GIT_COMMIT_REF === "staging";

/**
 * Bu değişken, uygulamanın Production ortamında olup olmadığını kontrol eder.
 * Sadece Vercel üzerinde geçerlidir.
 */
export const isProduction = process.env.VERCEL_ENV === "production";
/**
 * Bu değişken, uygulamanın Development ortamında olup olmadığını kontrol eder.
 * Sadece Vercel üzerinde geçerlidir.
 */
export const isDevelopment = process.env.VERCEL_ENV === "development";
