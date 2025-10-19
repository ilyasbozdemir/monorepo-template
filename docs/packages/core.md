# @monorepo/core

`@monorepo/core` monorepodaki TypeScript projeleri için ortak tipler, ortam yardımcıları ve HTTP istemci araçlarını sağlar. Frontend/Backend paketleri tarafından paylaşılan domain sözleşmelerinin tek kaynakta tutulmasına yardım eder.

## Kurulum

```bash
pnpm add @monorepo/core
```

> Workspace içinde paket zaten linklendiğinden uygulama paketlerinizde ekstra ayara gerek yoktur.

## Sağlanan Modüller

| Modül | Açıklama |
| --- | --- |
| `configs/client-config` | Auth ve depolama servisleri için yapılandırma tipleri. |
| `configs/env` | Vercel ortam değişkenlerini okuyarak `isStaging`, `isProduction`, `isDevelopment` bayraklarını üretir. |
| `lib/safe-axios` | Varsayılan header ve token ekleyen, opsiyonel “safe mode” destekli Axios istemci fabrikası. |
| `utils/safeExecute` | Async/sync fonksiyonları try/catch/finally bloğuna sarmalayan yardımcı. |
| `types/*` | API sözleşmeleri, koleksiyon özetleri, veri tabanı CRUD yanıt tipleri, query operator enumerasyonu vb. |
| `enums/*` | Kullanıcı rolü ve kullanıcı tipi enumerasyonları. |

## Kullanım Örnekleri

### 1. Güvenli Axios istemcisi

```ts
import { createApi } from "@monorepo/core";

const api = createApi({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  token: "<jwt-token>",
  safeMode: true,
});

const response = await api.get("/databases");
if (response.status >= 400) {
  // safeMode aktifken hatalar resolve edilmiş Response objesi olarak gelir
  console.error("API hatası", response.status, response.data);
}
```

### 2. Ortak CRUD yanıtlarını tiplemek

```ts
import type { DocumentInsertResponse } from "@monorepo/core";

async function insertProduct(data: ProductPayload): Promise<DocumentInsertResponse> {
  const res = await api.post("/products", data);
  return res.data;
}
```

### 3. `safeExecute` ile hataları merkezileştirmek

```ts
import { safeExecute } from "@monorepo/core";

await safeExecute(
  async () => {
    await insertProduct(payload);
  },
  (err) => {
    logger.error(err);
  },
  () => {
    ui.setLoading(false);
  }
);
```

### 4. Ortam bayraklarını kullanmak

```ts
import { isStaging, isProduction } from "@monorepo/core";

if (isStaging) {
  enablePreviewWidgets();
}

if (isProduction) {
  enableErrorBoundary();
}
```

## Tip Referansı

- **DatabaseSummary / CollectionSummary:** MongoDB benzeri istatistikleri taşıyan readonly modellerdir; admin konsolunda veritabanlarını listelerken kullanılır.【F:packages/core/src/types/index.ts†L1-L38】
- **DocumentInsertResponse / DocumentUpdateResponse / DocumentDeleteResponse:** CRUD yanıtları için ortak sözleşmeler sağlar; servis katmanlarının API’ye tek tipte sonuç dönmesine yardımcı olur.【F:packages/core/src/types/index.ts†L39-L74】
- **QueryOperator:** Filtreleme motorlarında kullanılabilecek operatör adlarının tür güvenli enum karşılığıdır.【F:packages/core/src/types/query-operator.ts†L1-L11】
- **UserRole & UserRoleLabels:** Yetkilendirme kontrolleri ve UI etiketi eşlemesi için kullanılır; `@monorepo/admin` ve frontend uygulamaları bu kaynaktan aynı rol listesini paylaşır.【F:packages/core/src/enums/user-role.ts†L1-L19】
- **UserType:** Bireysel/Kurumsal ayrımı yapan basit enum; kayıt formu veya faturalama servisleri tarafından tüketilir.【F:packages/core/src/enums/user-type.ts†L1-L5】

## En İyi Pratikler

- **Safe mode’u sadece ihtiyaç halinde açın:** `createApi` safe mode açıkken bütün HTTP hatalarını `resolve` eder; Redux/React Query gibi tool’larda standart error akışını bozabileceğini unutmayın.【F:packages/core/src/lib/safe-axios.tsx†L12-L46】
- **Paylaşılan tipleri genişletirken tek yerde güncelleyin:** API yanıtları veya enum’lar değiştiğinde önce `@monorepo/core` içindeki tipleri güncelleyin, ardından bağlı paketlerde `pnpm run type-check` çalıştırın.
- **`safeExecute` catch bloğunda merkezi loglama kullanın:** Hata aynı noktada yutulmasın; `@monorepo/errors` veya Sentry adapter’ını çağırarak izlenebilirliği koruyun.【F:packages/core/src/utils/safeExecute.ts†L1-L39】

## İlgili Paketler

- `@monorepo/app`: AppApiClient ile `AppApiClientConfig` tiplerini kullanır; core’daki config tipleriyle uyumlu kalın.
- `@monorepo/errors`: `safeExecute` örneklerinde merkezi loglama sağlayıcısı olarak entegre edilebilir.
- `@monorepo/admin`: Kullanıcı rolü ve tip enum’larını paylaşır.

## Test

`@monorepo/core` için şu an birim test iskeleti bulunmuyor. Yeni tip veya yardımcı eklediğinizde Jest/TS testlerini `packages/core/__tests__` altında konumlandırıp `pnpm --filter @monorepo/core test` komutuyla çalıştırın.
