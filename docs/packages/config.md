# @monorepo/config

`@monorepo/config`, uygulama çapında ortam değişkenlerini tek noktadan okumayı amaçlayan hafif bir yardımcı pakettir. Şu an `env` nesnesi boş bir iskelet olarak gelir ve proje gereksinimlerinize göre genişletilmek üzere hazırdır.【F:packages/config/src/env.ts†L1-L3】

## Kurulum

```bash
pnpm add @monorepo/config
```

## Başlangıç Kullanımı

```ts
import { env } from "@monorepo/config";

env.APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
```

> `env` nesnesi TypeScript tarafından genişletilebilir; ortak ortam anahtarlarını burada toplayarak paketler arası tekrarın önüne geçebilirsiniz.

## En İyi Pratikler

- Ortak kullanılan tüm environment anahtarlarını bu pakete ekleyip tip tanımlarını genişletin; böylece yanlış yazım hataları tek noktadan yakalanır.【F:packages/config/src/env.ts†L1-L3】
- Production’da gizli değerleri runtime’da enjekte edin, pakette sadece anahtar isimlerini saklayın.

## İlgili Paketler

- `@monorepo/app` ve `@monorepo/core`: API base URL veya feature flag gibi değerleri tüketir.
- `@monorepo/services`: Servis konfigürasyonlarını oluştururken `env` yardımcılarını okuyabilir.

## Test

Paket henüz kod içermediği için test bulunmuyor. Ortak yapılandırma yardımcıları eklediğinizde uygun birim testlerini oluşturun.
