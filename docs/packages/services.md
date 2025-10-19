# @monorepo/services

`@monorepo/services`, REST tabanlı mikro servis konfigürasyonlarını yönetmek ve basit HTTP çağrılarını koordine etmek için tasarlanmış bir yardımcı pakettir.【F:packages/services/src/index.ts†L1-L47】

## Kurulum

```bash
pnpm add @monorepo/services
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `ServiceConfig` | Servis adı ve base URL bilgisini tipler.【F:packages/services/src/index.ts†L13-L16】 |
| `ServicesManager.addService` | Servis konfigürasyonunu bellekte saklar.【F:packages/services/src/index.ts†L18-L27】 |
| `ServicesManager.getService` | Kayıtlı servis bilgisini döndürür.【F:packages/services/src/index.ts†L29-L35】 |
| `ServicesManager.get` | Axios ile ilgili servise GET isteği yapar, base URL ile endpoint’i birleştirir.【F:packages/services/src/index.ts†L37-L47】 |

## Kullanım Örneği

```ts
import { ServicesManager } from "@monorepo/services";

const services = new ServicesManager();
services.addService({ name: "core", baseUrl: "https://api.example.com" });

const databases = await services.get("core", "/databases");
```

## En İyi Pratikler

- Axios bağımlılığını özelleştirmek istiyorsanız `ServicesManager`ı genişletip `axios.create` ile interceptor ekleyin.【F:packages/services/src/index.ts†L37-L45】
- Servis isimlerini `@monorepo/static` veya `@monorepo/system` içindeki kayıtlarla senkron tutun; aksi halde yanlış URL çağrıları oluşabilir.【F:packages/services/src/index.ts†L18-L35】

## Test

Mock Axios kullanarak `get` metodunun doğru URL’yi oluşturduğunu doğrulayın.
