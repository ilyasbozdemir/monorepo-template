# @monorepo/events

`@monorepo/events`, Node `EventEmitter` üzerine inşa edilen basit bir event bus ve tip güvenli sabit isimler sunar. Böylece mikro servisler veya frontend paketleri arasında ortak event isimlerini paylaşabilirsiniz.【F:packages/events/src/index.ts†L1-L68】

## Kurulum

```bash
pnpm add @monorepo/events
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `EVENTS` | `user.registered`, `order.created` gibi çekirdek event isimlerini barındırır.【F:packages/events/src/index.ts†L24-L33】 |
| `EventsClient.emit` | Dinamik olarak event yayınlamayı sağlar.【F:packages/events/src/index.ts†L43-L49】 |
| `EventsClient.on` | Event dinleyicileri ekler ve tip parametresiyle payload şemasını belirtmenize izin verir.【F:packages/events/src/index.ts†L51-L57】 |

## Kullanım Örneği

```ts
import { EVENTS, EventsClient } from "@monorepo/events";

const events = new EventsClient();

events.on<typeof payload>(EVENTS.USER_REGISTERED, (payload) => {
  console.log("Yeni kullanıcı", payload.userId);
});

events.emit(EVENTS.ORDER_CREATED, { orderId: "o-1" });
```

## En İyi Pratikler

- Tüm modüllerde aynı event string’ini kullanmak için `EVENTS` objesini referans alın; string literal kopyalamayın.【F:packages/events/src/index.ts†L24-L33】
- Event listener’larını temizlemek gerektiğinde `EventEmitter.removeListener` veya `events.emitter` erişimi yerine `EventsClient` içine temizleme metodu ekleyin.

## Test

Yeni eventler eklerken temel publish/subscribe döngüsünü Jest ile doğrulayın.
