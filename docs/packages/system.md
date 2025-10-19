# @monorepo/system

`@monorepo/system`, monoreponun servis envanterini tanımlamak için kullanılan basit bir kayıt defteri sunar.【F:packages/system/src/index.ts†L1-L46】

## Kurulum

```bash
pnpm add @monorepo/system
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `ServiceInfo` | Servis adı, base URL ve isteğe bağlı açıklamayı tanımlar.【F:packages/system/src/index.ts†L9-L13】 |
| `SystemRegistry.registerService` | Servisi kayıt altına alır.【F:packages/system/src/index.ts†L15-L23】 |
| `SystemRegistry.listServices` | Kayıtlı servislerin tamamını döndürür.【F:packages/system/src/index.ts†L25-L28】 |
| `SystemRegistry.getService` | Adına göre tek bir servis bilgisini getirir.【F:packages/system/src/index.ts†L30-L33】 |
| `systemRegistry` | Singleton örneği; auth, realtime ve storage servislerini default olarak kaydeder.【F:packages/system/src/index.ts†L35-L46】 |

## Kullanım Örneği

```ts
import { systemRegistry } from "@monorepo/system";

const services = systemRegistry.listServices();
console.log(services);
```

## En İyi Pratikler

- Servis bilgilerini `@monorepo/services` ile senkron tutarak HTTP çağrılarında aynı base URL’yi kullanın.【F:packages/system/src/index.ts†L15-L46】
- Production ortamında servis adreslerini build-time yerine runtime’da enjekte etmek için `registerService` çağrılarını ortam bazlı koşullarla sarmalayın.【F:packages/system/src/index.ts†L15-L46】

## Test

Yeni servisler eklerken `listServices` sonuçlarında tekrar olup olmadığını kontrol eden basit testler ekleyin.
