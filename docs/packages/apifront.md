# @monorepo/apifront

`@monorepo/apifront`, backend API uç noktalarını tip güvenli şekilde tüketmek isteyen frontend katmanı için URL yardımcıları, uç nokta sabitleri ve yanıt dönüştürücüleri sunar.【F:packages/apifront/src/helpers/url-builder.ts†L1-L72】【F:packages/apifront/src/constants/api-configuration.ts†L3-L16】【F:packages/apifront/src/types/api.ts†L1-L129】

## Kurulum

```bash
pnpm add @monorepo/apifront
```

> Workspace içinde paket pnpm link’iyle hazır geldiğinden ekstra yapılandırma gerekmez.

## Sağlanan API

| Modül | Açıklama |
| --- | --- |
| `helpers/UrlBuilder` | Path segmentleri ve query parametreleri üzerinden dinamik endpoint üretmeye yarayan zincirlenebilir sınıf.【F:packages/apifront/src/helpers/url-builder.ts†L1-L72】 |
| `helpers/DatabaseApi` | Database oluşturma, silme, listeleme ve özet sorgularına ait URL üreticileri içerir.【F:packages/apifront/src/helpers/api-urls.ts†L57-L124】 |
| `helpers/CollectionApi` | Koleksiyon CRUD akışları, belge alma/güncelleme/silme ve aggregation URL’lerini hazırlar.【F:packages/apifront/src/helpers/api-urls.ts†L129-L323】 |
| `constants/api-configuration` | Ortam bazlı API ana URL’sini çözen yardımcı ve kullanılabilir endpoint enumerasyonları sağlar.【F:packages/apifront/src/constants/api-configuration.ts†L3-L16】 |
| `types/api` | API yanıtlarını standart `ActionResult` tipine dönüştüren yardımcılarla birlikte yanıt sözleşmelerini içerir.【F:packages/apifront/src/types/api.ts†L1-L129】 |

## Kullanım Örnekleri

### 1. Endpoint üretmek

```ts
import { DatabaseApi, withFullUrl } from "@monorepo/apifront";

const rawUrl = DatabaseApi.create("crm", "customers");
const requestUrl = withFullUrl("https://api.example.com", "v1", rawUrl);
// https://api.example.com/v1/database-management/create?dbName=crm&firstCollection=customers
```

### 2. Koleksiyon dökümanı için URL

```ts
import { CollectionApi, withFullUrl } from "@monorepo/apifront";

const path = CollectionApi.getDocument("crm", "customers", "doc-1");
const url = withFullUrl(process.env.API_URL!, "v1", path);
```

### 3. API sonuçlarını normalize etmek

```ts
import { toActionResult, ApiResponse } from "@monorepo/apifront";

const response: ApiResponse<{ id: string }> = {
  data: { id: "123" },
  success: true,
};

const result = toActionResult(response);
// { success: true, data: { id: "123" }, error: undefined }
```

## En İyi Pratikler

- `UrlBuilder` ile endpoint hazırlarken segmentleri sırayla ekleyip en son `withFullUrl` yardımıyla ortam bazlı host ve versiyonu enjekte edin; böylece test/staging prod ayarlarını kolayca değiştirirsiniz.【F:packages/apifront/src/helpers/url-builder.ts†L20-L72】【F:packages/apifront/src/helpers/api-urls.ts†L45-L124】
- API çağrı sonuçlarını doğrudan UI katmanına aktarmadan önce `toActionResult` ile normalize edin; böylece hata/başarı durumları tek tipte olur.【F:packages/apifront/src/types/api.ts†L48-L129】
- `ApiEndpoints` enumerasyonunu kullanarak string sabitlerin drift etmesini önleyin; yeni servisler eklerken aynı dosyada güncelleyin.【F:packages/apifront/src/constants/api-configuration.ts†L13-L16】

## İlgili Paketler

- `@monorepo/app`: Üretilen endpointleri `AppApiClient` ile çağırırken kullanır.
- `@monorepo/core`: CRUD tipleri ve hata modelleri ile uyumlu çalışır.

## Test

Henüz test iskeleti bulunmuyor. URL yardımcılarını genişlettiğinizde paket seviyesinde Jest testi ekleyip `pnpm --filter @monorepo/apifront test` komutunu çalıştırın.
