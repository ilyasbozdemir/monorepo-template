# @monorepo/static

`@monorepo/static`, uygulama genelinde tekrar kullanılan sabit değerleri (roller, durumlar, URL’ler) merkezi olarak toplar.【F:packages/static/src/index.ts†L1-L33】

## Kurulum

```bash
pnpm add @monorepo/static
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `ROLES` | Admin, user ve guest rollerini string literal olarak sağlar.【F:packages/static/src/index.ts†L15-L19】 |
| `STATUSES` | Kullanıcı durumlarını (`active`, `inactive`, `pending`) tanımlar.【F:packages/static/src/index.ts†L21-L25】 |
| `URLS` | Temel yönlendirme URL’lerini içerir (home, login, dashboard).【F:packages/static/src/index.ts†L27-L33】 |

## Kullanım Örneği

```ts
import { ROLES, URLS } from "@monorepo/static";

if (user.role === ROLES.ADMIN) {
  router.push(URLS.DASHBOARD);
}
```

## En İyi Pratikler

- Yeni sabitler eklerken `as const` ile literal tipleri koruyun; TypeScript, union tipleri otomatik türetsin.【F:packages/static/src/index.ts†L15-L33】
- URL sabitlerini `@monorepo/app` ve Next.js yönlendirmeleriyle senkron tutun.

## Test

Statik değerler değişmediği için test gerekmeyebilir; ancak kritik sabitlerin regressionsız kalması için smoke test yazabilirsiniz.
