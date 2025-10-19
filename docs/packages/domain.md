# @monorepo/domain

`@monorepo/domain`, tekrar kullanılabilir domain modelleri ve value object’leri tek pakette toplamayı hedefler. Şu an örnek olarak `Vehicle` value object’i ile başlayan iskelet, kendi bounded context’lerinizi eklemeniz için referans sunar.【F:packages/domain/src/index.ts†L1-L35】

## Kurulum

```bash
pnpm add @monorepo/domain
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `Vehicle` | Marka, model ve yıl bilgisini taşıyan basit value object; `fullName` getter’ı ile gösterim kolaylığı sağlar.【F:packages/domain/src/index.ts†L20-L35】 |

## Kullanım Örneği

```ts
import { Vehicle } from "@monorepo/domain";

const car = new Vehicle({ brand: "Tesla", model: "Model 3", year: 2024 });
console.log(car.fullName); // Tesla Model 3
```

## Genişletme Önerileri

- Value object’lerinizi burada toplayıp readonly özellikler tanımlayın; setter yerine metotlarla state değişimini yönetin.【F:packages/domain/src/index.ts†L20-L35】
- Domain servisleri `@monorepo/services` paketine taşınmalı; bu paket sadece saf domain mantığını barındırmalıdır.

## Test

Yeni value object’ler eklediğinizde örnek Jest testlerini `packages/domain/__tests__` altında oluşturarak davranışları güvenceye alın.
