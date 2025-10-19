# @monorepo/security

`@monorepo/security`, basit kullanıcı kayıtları üzerinde kimlik doğrulama, rol kontrolü ve demo amaçlı token üretimi sağlar.【F:packages/security/src/index.ts†L1-L58】

## Kurulum

```bash
pnpm add @monorepo/security
```

## Sağlanan API

| Sembol | Açıklama |
| --- | --- |
| `User` | Kullanıcı id, kullanıcı adı ve rol listesini temsil eder.【F:packages/security/src/index.ts†L7-L11】 |
| `SecurityManager.addUser` | Bellek içi kullanıcı deposuna yeni kullanıcı ekler.【F:packages/security/src/index.ts†L19-L27】 |
| `SecurityManager.authenticate` | Kullanıcı adından kullanıcıyı döndürür veya `null` verir.【F:packages/security/src/index.ts†L29-L36】 |
| `SecurityManager.hasRole` | Kullanıcının bir role sahip olup olmadığını kontrol eder.【F:packages/security/src/index.ts†L38-L44】 |
| `SecurityManager.generateToken` | Basit base64 token üretir ve kullanıcı bilgisiyle birlikte döndürür.【F:packages/security/src/index.ts†L46-L57】 |

## Kullanım Örneği

```ts
import { SecurityManager } from "@monorepo/security";

const manager = new SecurityManager();
manager.addUser({ id: "1", username: "demo", roles: ["admin"] });

const user = manager.authenticate("demo");
if (user && manager.hasRole(user, "admin")) {
  const { token } = manager.generateToken(user);
  console.log(token);
}
```

## En İyi Pratikler

- Bellek içi depolama yerine gerçek kullanıcı deposuna bağlandığınızda `SecurityManager`ı adaptör pattern’iyle genişletin.【F:packages/security/src/index.ts†L19-L57】
- Base64 token yalnızca demo amaçlıdır; üretimde JWT veya başka imzalı token çözümlerine geçin.【F:packages/security/src/index.ts†L46-L57】

## Test

Rol kontrolü ve token üretimini kapsayan birim testler ekleyerek güvenlik regresyonlarını azaltın.
