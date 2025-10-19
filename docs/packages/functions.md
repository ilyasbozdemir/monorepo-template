# @monorepo/functions

`@monorepo/functions`, serverless fonksiyon veya frontend util ihtiyaçları için yönlendirme, rol kontrolü, loglama ve bekleme yardımcıları sunar.【F:packages/functions/src/index.ts†L4-L39】

## Kurulum

```bash
pnpm add @monorepo/functions
```

## Sağlanan API

| Fonksiyon | Açıklama |
| --- | --- |
| `redirectTo` | Tarayıcıda gerçek yönlendirme yapar, SSR/Node ortamında konsola simülasyon yazar.【F:packages/functions/src/index.ts†L19-L26】 |
| `hasRole` | Kullanıcı rol dizisinde belirli bir rolün olup olmadığını kontrol eder.【F:packages/functions/src/index.ts†L28-L31】 |
| `logEvent` | Konsola standart formatta event log’u basar.【F:packages/functions/src/index.ts†L33-L36】 |
| `sleep` | Promise tabanlı gecikme sağlar; async akışlarda throttling için kullanılabilir.【F:packages/functions/src/index.ts†L38-L39】 |

## Kullanım Örneği

```ts
import { redirectTo, hasRole, logEvent, sleep } from "@monorepo/functions";

if (!hasRole("admin", currentUser.roles)) {
  redirectTo("/login");
}

logEvent("USER_LOGIN", { userId: currentUser.id });
await sleep(200);
```

## En İyi Pratikler

- `redirectTo` fonksiyonunu Next.js server actions gibi tarayıcı dışı ortamlarda kullanacaksanız dönüş değerini beklemeyin; simülasyon log’una göre hareket edin.【F:packages/functions/src/index.ts†L19-L26】
- Rolleri dizide saklarken küçük harfle normalize edin; `hasRole` basit `includes` kontrolü kullanır.【F:packages/functions/src/index.ts†L28-L31】

## Test

Çok kritik olmayan util fonksiyonları olsalar da, genişletildiklerinde Jest ile basit birim testleri eklemeniz önerilir.
