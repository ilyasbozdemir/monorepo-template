# @monorepo/search

`@monorepo/search`, bellek içi veri kaynakları üzerinde basit arama ve sayfalama yapabilen yardımcılar sunar; gerçek arama servisleri eklenene kadar prototip geliştirmeyi hızlandırır.【F:packages/search/src/index.ts†L1-L58】

## Kurulum

```bash
pnpm add @monorepo/search
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `SearchParams` | Sorgu kelimesi, filtreler ve sayfalama parametrelerini içerir.【F:packages/search/src/index.ts†L9-L16】 |
| `SearchResult` | Arama sonuçlarını ve toplam kayıt sayısını döndürür.【F:packages/search/src/index.ts†L19-L22】 |
| `SearchManager` | Veri kaynaklarını bellekte tutar, `search` ve `addDataSource` metotlarıyla yönetir.【F:packages/search/src/index.ts†L24-L58】 |

## Kullanım Örneği

```ts
import { SearchManager } from "@monorepo/search";

const search = new SearchManager({
  cars: [{ name: "Tesla Model S" }, { name: "BMW i4" }],
});

const result = search.search("cars", { query: "tesla" });
console.log(result.items);
```

## En İyi Pratikler

- Üretim ortamında gerçek arama servislerine geçerken aynı arayüzü korumak için `SearchManager`ı adaptörle sarmalayın.【F:packages/search/src/index.ts†L24-L58】
- `filters` alanını doldurarak gelecekteki gelişmiş arama kriterleri için zemin hazırlayın.【F:packages/search/src/index.ts†L9-L16】

## Test

Mock veri kaynaklarıyla `search` metodunun büyük-küçük harf duyarsız çalıştığını test edin.【F:packages/search/src/index.ts†L36-L48】
