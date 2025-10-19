# @monorepo/realtime

`@monorepo/realtime`, SignalR tabanlı hub bağlantıları için hafif bir client sınıfı sunarak gerçek zamanlı event akışlarını yönetmenize yardım eder.【F:packages/realtime/src/index.ts†L1-L63】

## Kurulum

```bash
pnpm add @monorepo/realtime
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `RealtimeClient` | SignalR hub’ına bağlanma, event dinleme/gönderme ve bağlantıyı sonlandırma işlemlerini kapsar.【F:packages/realtime/src/index.ts†L25-L62】 |

## Kullanım Örneği

```ts
import { RealtimeClient } from "@monorepo/realtime";

const realtime = new RealtimeClient(process.env.REALTIME_URL!);
await realtime.connect();
realtime.on("notification", (payload) => {
  console.log(payload);
});
await realtime.emit("SendNotification", { userId: "u-1" });
```

## En İyi Pratikler

- `connect` çağrısı öncesinde hub URL’sini `@monorepo/config` üzerinden yöneterek ortamlar arası geçişi kolaylaştırın.【F:packages/realtime/src/index.ts†L33-L39】
- Bağlantıyı kapatmanız gerektiğinde `disconnect` metodunu çağırmayı unutmayın; aksi halde SignalR bağlantısı açık kalır.【F:packages/realtime/src/index.ts†L59-L62】

## Test

SignalR bağımlılığını mock’layarak `on` ve `emit` çağrılarının ilgili hub fonksiyonlarını tetiklediğini doğrulayın.
