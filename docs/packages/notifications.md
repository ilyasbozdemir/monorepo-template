# @monorepo/notifications

`@monorepo/notifications`, e-posta, mobil ve in-site bildirim kanallarını tek merkezden koordine etmek için adaptör tabanlı bir yönetici sunar.【F:packages/notifications/src/index.ts†L1-L79】

## Kurulum

```bash
pnpm add @monorepo/notifications
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `NotificationChannel` | Desteklenen bildirim kanallarını (`inSite`, `mobile`, `email`) tanımlar.【F:packages/notifications/src/index.ts†L26-L42】 |
| `NotificationParams` | Başlık, mesaj, kullanıcı listesi ve opsiyonel bağlam gibi gönderim parametrelerini içerir.【F:packages/notifications/src/index.ts†L32-L45】 |
| `NotificationManager.registerAdapter` | Kanal bazlı gönderim fonksiyonlarını kaydeder.【F:packages/notifications/src/index.ts†L48-L60】 |
| `NotificationManager.send` | İlgili adaptörü çağırarak bildirimleri gönderir, kayıtlı handler yoksa uyarı loglar.【F:packages/notifications/src/index.ts†L62-L77】 |

## Kullanım Örneği

```ts
import { NotificationManager } from "@monorepo/notifications";

NotificationManager.registerAdapter("email", (params) => {
  console.log("E-posta gönderildi", params);
});

NotificationManager.send({
  title: "Yeni mesaj",
  message: "Kutunuzda bekleyen mesajlar var",
  userIds: ["u-1"],
  channel: "email",
});
```

## En İyi Pratikler

- Her kanal için hata yakalama ve retry politikalarını adaptör fonksiyonunun içerisinde yönetin; `NotificationManager.send` yalnızca loglama yapar.【F:packages/notifications/src/index.ts†L66-L77】
- `context` alanını kullanarak analitik veya AB test bilgilerini downstream servislere aktarın.【F:packages/notifications/src/index.ts†L34-L45】

## Test

Kanal adaptörlerini mock’layarak `send` çağrısının doğru parametreleri aktardığını doğrulayın.
