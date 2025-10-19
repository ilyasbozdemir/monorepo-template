# @monorepo/payments

`@monorepo/payments`, farklı ödeme sağlayıcılarını tek merkezden yönetmek için gateway kayıt mekanizması ve standart sonuç tipleri sunar.【F:packages/payments/src/index.ts†L1-L85】

## Kurulum

```bash
pnpm add @monorepo/payments
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `PaymentParams` | Gateway adı, tutar, para birimi ve kullanıcı bilgilerini kapsar.【F:packages/payments/src/index.ts†L25-L39】 |
| `PaymentResult` | Başarılı/başarısız ödeme sonuçlarını standart hale getirir.【F:packages/payments/src/index.ts†L41-L48】 |
| `PaymentManager.registerGateway` | Stripe, PayPal gibi sağlayıcılar için async handler kaydeder.【F:packages/payments/src/index.ts†L53-L66】 |
| `PaymentManager.pay` | Gateway’i çalıştırır, sonuç döndürür, kayıtlı değilse veya hata alırsa descriptive error üretir.【F:packages/payments/src/index.ts†L68-L83】 |

## Kullanım Örneği

```ts
import { PaymentManager } from "@monorepo/payments";

PaymentManager.registerGateway("stripe", async (params) => ({
  success: true,
  transactionId: "trx-1",
}));

const result = await PaymentManager.pay({
  gateway: "stripe",
  amount: 49,
  currency: "USD",
  userId: "user-1",
});
```

## En İyi Pratikler

- Gateway handler’larında hata fırlatıldığında `pay` metodu bunu yakalayıp standart `error` alanına taşır; özel hata mesajlarınızı `throw` ederek iletebilirsiniz.【F:packages/payments/src/index.ts†L79-L83】
- Ek fraud kontrolleri veya metadata için `PaymentParams.context` alanını kullanın.【F:packages/payments/src/index.ts†L35-L38】

## Test

Mock gateway ile `pay` akışını test ederek beklenen transaction id veya hata mesajlarının döndüğünü doğrulayın.
