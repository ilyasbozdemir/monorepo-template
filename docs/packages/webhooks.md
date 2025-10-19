# @monorepo/webhooks

`@monorepo/webhooks`, webhook eventlerini kaydetmek ve tetiklemek için hafif bir registry sunar.【F:packages/webhooks/src/index.ts†L1-L47】

## Kurulum

```bash
pnpm add @monorepo/webhooks
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `WebhookRegistry.register` | Event adı ve callback’i kaydeder, aynı event için birden fazla handler destekler.【F:packages/webhooks/src/index.ts†L15-L27】 |
| `WebhookRegistry.trigger` | Kayıtlı callback’leri tetikler, payload’ı handler’a iletir.【F:packages/webhooks/src/index.ts†L29-L36】 |
| `WebhookRegistry.listEvents` | Kayıtlı event adlarını döndürür.【F:packages/webhooks/src/index.ts†L38-L41】 |
| `webhooks` | Varsayılan singleton; `order.created` ve `payment.success` eventlerini örnek olarak kaydeder.【F:packages/webhooks/src/index.ts†L43-L47】 |

## Kullanım Örneği

```ts
import { webhooks } from "@monorepo/webhooks";

webhooks.register("user.signup", (payload) => {
  console.log("Yeni kayıt", payload);
});

webhooks.trigger("user.signup", { userId: "u-1" });
```

## En İyi Pratikler

- Aynı event’e birden fazla handler eklenebildiğinden, handler içi hataları try/catch ile yöneterek tetikleme zincirinin kesilmesini engelleyin.【F:packages/webhooks/src/index.ts†L15-L36】
- `listEvents` çıktısını izleyerek hangi webhook’ların aktif olduğunu gözlemleyebilir, admin panelinde gösterebilirsiniz.【F:packages/webhooks/src/index.ts†L38-L41】

## Test

Mock callback’ler kullanarak `trigger` çağrısının tüm handler’ları çalıştırdığını doğrulayın.
