# @monorepo/auth

`@monorepo/auth`, JWT tabanlı kullanıcı kimlik doğrulamayı kolaylaştırmak için token çözümleme, Axios istemcisi üretme ve PubSub destekli event yardımcıları sağlar.【F:packages/auth/src/index.ts†L9-L99】

## Kurulum

```bash
pnpm add @monorepo/auth
```

## Sağlanan API

| Fonksiyon | Açıklama |
| --- | --- |
| `getUserFromToken` | JWT payload’ını decode ederek kullanıcı bilgilerini döndürür, başarısızlıkta `null` verir.【F:packages/auth/src/index.ts†L29-L46】 |
| `createAuthClient` | Authorization header eklenmiş hazır bir Axios istemcisi üretir.【F:packages/auth/src/index.ts†L48-L64】 |
| `onAuthEvent` | PubSub üzerinden auth ilişkili eventleri dinlemeyi sağlar.【F:packages/auth/src/index.ts†L66-L78】 |
| `publishAuthEvent` | Oturum açma/kapama gibi eventlerin yayınlanmasını kolaylaştırır.【F:packages/auth/src/index.ts†L80-L88】 |
| `AuthUser` & `AuthOptions` | Token, rol ve kullanıcı meta bilgisini tip güvenli hale getirir.【F:packages/auth/src/index.ts†L9-L27】 |

## Kullanım Örnekleri

```ts
import { createAuthClient, getUserFromToken, onAuthEvent } from "@monorepo/auth";

const user = getUserFromToken(cookieStore.get("session") ?? "");
const api = createAuthClient(cookieStore.get("session") ?? "", process.env.API_URL);

const unsubscribe = onAuthEvent("logout", ({ userId }) => {
  console.log("Oturum kapandı", userId);
});
```

## En İyi Pratikler

- `getUserFromToken` dönüşünü `null` kontrolü yapmadan kullanmayın; süresi dolmuş veya bozuk token’larda güvenli biçimde hata verir.【F:packages/auth/src/index.ts†L37-L46】
- Axios client üretirken `apiUrl` parametresini ortama göre dışarıdan geçin; paket default olarak boş string ile başlar.【F:packages/auth/src/index.ts†L57-L63】
- PubSub eventlerini component unmount aşamasında `PubSub.unsubscribe` ile temizlemeyi unutmayın; `onAuthEvent` fonksiyonu döndürdüğü token sayesinde bunu destekler.【F:packages/auth/src/index.ts†L66-L78】

## İlgili Paketler

- `@monorepo/security`: Rol kontrolleri ve token üretimi için tamamlayıcıdır.
- `@monorepo/notifications`: Oturum olaylarını bildirimlere bağlamak için eventleri dinleyebilir.

## Test

Paket için Jest testi tanımlı değil. Yeni yardımcılar eklediğinizde `pnpm --filter @monorepo/auth test` komutunu ekleyin.
