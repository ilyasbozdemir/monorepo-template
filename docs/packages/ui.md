# @monorepo/ui

`@monorepo/ui`, uygulama genelinde paylaşılacak UI yardımcıları ve sabitleri barındırmak için oluşturulmuş hafif bir pakettir.【F:packages/ui/src/index.ts†L1-L16】

## Kurulum

```bash
pnpm add @monorepo/ui
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `APP_NAME` | UI katmanında kullanılacak varsayılan uygulama adını döndürür.【F:packages/ui/src/index.ts†L6-L8】 |
| `greet` | Kullanıcı adını alıp lokalize edilmiş bir karşılama metni döndürür.【F:packages/ui/src/index.ts†L10-L12】 |
| `CONFIG` | UI için versiyon ve ortam bilgisi gibi basit sabitleri içerir.【F:packages/ui/src/index.ts†L14-L16】 |

## Kullanım Örneği

```ts
import { APP_NAME, greet } from "@monorepo/ui";

document.title = APP_NAME;
console.log(greet("İlyas"));
```

## En İyi Pratikler

- `CONFIG.environment` değerini dağıtım ortamına göre güncelleyerek UI’de environment rozetleri gösterebilirsiniz.【F:packages/ui/src/index.ts†L14-L16】
- Komponent koleksiyonunu büyütürken export’ları `src/index.ts` üzerinden merkezi hale getirin.

## Test

Fonksiyonlar sade olduğu için smoke test yeterli; UI komponentleri eklediğinizde Storybook ve görsel regresyon testlerini düşünün.
