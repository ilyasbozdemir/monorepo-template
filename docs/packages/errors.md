# @monorepo/errors

`@monorepo/errors`, Sentry veya benzeri sağlayıcılar için merkezi adaptör kaydı yapabileceğiniz hafif bir hata yönetimi katmanıdır. `ErrorManager` sınıfı, kayıtlı tüm handler’lara hataları ileterek tek noktadan gözlemlenebilirlik sağlar.【F:packages/errors/src/index.ts†L1-L112】

## Kurulum

```bash
pnpm add @monorepo/errors
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `ErrorParams` | Hata seviyesi, tag ve kullanıcı bağlamı gibi ek meta bilgileri tanımlar.【F:packages/errors/src/index.ts†L1-L26】 |
| `ErrorHandler` | Özel loglama sağlayıcılarının implemente edeceği arayüzü belirler.【F:packages/errors/src/index.ts†L29-L45】 |
| `ErrorManager.register` | Yeni hata yakalayıcı adaptörleri sisteme ekler.【F:packages/errors/src/index.ts†L72-L82】 |
| `ErrorManager.capture` | Hata, bağlam ve parametreleri tüm adaptörlere iletir; development modunda console çıktısı sağlar.【F:packages/errors/src/index.ts†L84-L109】 |

## Kullanım Örneği

```ts
import { ErrorManager } from "@monorepo/errors";

ErrorManager.register({
  capture: (error, context, params) => {
    console.log("Log provider", error, context, params);
  },
});

try {
  throw new Error("Beklenmeyen hata");
} catch (err) {
  ErrorManager.capture(err, { module: "billing" }, { level: "critical" });
}
```

## En İyi Pratikler

- Adaptör kaydederken `capture` içinde `try/catch` kullanın; `ErrorManager` hata fırlatan handler’ları da konsola loglar ancak iş akışının kesilmemesi için ekstra önlem alın.【F:packages/errors/src/index.ts†L101-L109】
- `ErrorParams.tags` alanını domain adlarıyla doldurarak filtrelenebilir log akışı oluşturun.【F:packages/errors/src/index.ts†L11-L15】

## İlgili Paketler

- `@monorepo/core`: `safeExecute` gibi yardımcılarla birlikte merkezi hata yönetimini tetikleyebilir.
- `@monorepo/notifications`: Kritik hataları yöneticilere bildirmek için hata eventlerini dinleyebilir.

## Test

Yeni handler davranışları eklerken birim testlerle `ErrorManager.capture` akışını doğrulayın.
