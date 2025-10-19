# @monorepo/storage

`@monorepo/storage`, S3 veya self-hosted depolama çözümlerine bağlanmak için basit bir istemci iskeleti sunar.【F:packages/storage/src/index.ts†L1-L40】

## Kurulum

```bash
pnpm add @monorepo/storage
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `StorageConfig` | Sağlayıcı tipi, bucket adı, base URL ve erişim anahtarlarını barındırır.【F:packages/storage/src/index.ts†L8-L15】 |
| `StorageClient.upload` | Provider’a göre uygun URL döndürerek yükleme işlemini temsil eder.【F:packages/storage/src/index.ts†L17-L31】 |
| `StorageClient.download` | Dosya içeriğini `Buffer` olarak döndürmek üzere placeholder içerir.【F:packages/storage/src/index.ts†L33-L36】 |
| `StorageClient.delete` | Dosya silme operasyonu için genişletilecek metot。【F:packages/storage/src/index.ts†L38-L39】 |

## Kullanım Örneği

```ts
import { StorageClient } from "@monorepo/storage";

const storage = new StorageClient({
  provider: "s3",
  bucketName: "app-media",
});

const url = await storage.upload("avatars/user.png", Buffer.from("binary"));
```

## En İyi Pratikler

- Upload ve delete işlemlerinde gerçek SDK çağrılarını implement ederken `provider` tipine göre switch-case kullanın.【F:packages/storage/src/index.ts†L17-L39】
- `baseUrl` alanını CDN origin’iyle doldurarak self-hosted senaryolarda doğrudan kullanılabilir URL döndürün.【F:packages/storage/src/index.ts†L8-L25】

## Test

Mock storage adapter’i ekleyerek upload/download metotlarının beklenen değerleri döndürdüğünü doğrulayın.
