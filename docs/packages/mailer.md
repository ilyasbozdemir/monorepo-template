# @monorepo/mailer

`@monorepo/mailer`, e-posta gönderimi için temel bir adapter sınıfı sağlar ve kendi SMTP/third-party entegrasyonlarınızı ekleyebilmeniz için esnek bir iskelet sunar.【F:packages/mailer/src/index.ts†L1-L48】

## Kurulum

```bash
pnpm add @monorepo/mailer
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `MailOptions` | Alıcı, gönderen, konu, gövde ve ekler dahil olmak üzere e-posta parametrelerini tanımlar.【F:packages/mailer/src/index.ts†L9-L23】 |
| `Mailer` | Varsayılan gönderen adresiyle yapılandırılabilen ve `sendMail` metodu üzerinden teslimat yapan ana sınıf.【F:packages/mailer/src/index.ts†L25-L48】 |

## Kullanım Örneği

```ts
import { Mailer } from "@monorepo/mailer";

const mailer = new Mailer("no-reply@example.com");
await mailer.sendMail({
  to: "user@example.com",
  subject: "Hoş geldiniz",
  body: "<strong>Platforma hoş geldiniz!</strong>",
});
```

## En İyi Pratikler

- `sendMail` içinde gerçek SMTP ya da üçüncü parti servisini çağıracak adaptörü ekleyin; şu an loglama placeholder’ı bulunmaktadır.【F:packages/mailer/src/index.ts†L39-L47】
- `MailOptions.attachments` alanını kullanarak binary içerikleri `Buffer` olarak geçebilir, TypeScript tipi sayesinde doğruluğunu garanti edebilirsiniz.【F:packages/mailer/src/index.ts†L21-L22】

## Test

Gönderim adaptörünüzü implemente ettikten sonra mock SMTP ile `Mailer.sendMail` metodunun beklenen payload’ı gönderdiğini doğrulayın.
