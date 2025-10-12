# INSTALLATION.md

# MainAPP / MongoDBServerAPI – Dokploy Kurulum Rehberi

Bu rehber, Dokploy üzerinde MainAPP API’yi ayağa kaldırmak için gerekli adımları ve mantığı anlatır.

---

## 1. Ön Koşullar

- Dokploy sunucusu veya Docker destekli bir ortam  
- **Database Tipi:** Dokploy’da DB olarak App tipini seçin (MongoDB için)  
- MongoDB instance’ı (managed veya container)  
- .NET 8 runtime (API için)  
- Network erişimi: API <-> MongoDB

---

## 2. Repository Klonlama

```bash
git clone https://github.com/<your-org>/monorepo-template.git
cd monorepo-template/apps/backend/api/MongoDBServerAPI
```

---

## 3. Çevresel Değişkenler

API’nin MongoDB’ye bağlanabilmesi için gerekli env variable’lar:

```env
# main DB
MONGO_CONNECTION_STRING=mongodb://admin:secret@<MONGO_HOST>:27017

# internal / panel DB (opsiyonel)
MONGO_INTERNAL_CONNECTION_STRING=mongodb://internal_admin:internal_secret@<MONGO_INTERNAL_HOST>:27017

# .NET environment
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80
```

> Not: Dokploy’da environment variable’ları **Deployment Settings** üzerinden ayarlayabilirsiniz.

---

## 4. Dockerfile ve Build

- **API ve DB için Dockerfile’lar hazır olmalı:**
  - `Dockerfile` → main MongoDB
  - `Dockerfile.internal` → internal / panel DB
  - API Dockerfile → MongoDBServerAPI

- Dokploy’da build veya deploy sırasında Dockerfile’lar kullanılır.  
- Dockerfile’lar ayarlandıktan sonra tek cümle ile:  
> “TAMAM, Dockerfile’lar hazır, deploy’a geçebiliriz.”

---

## 5. API Deploy

- Dokploy’da deploy sırasında **image + env** veriyoruz.  
- Main ve internal DB’yi ayrı ayrı tanımlıyoruz.  
- Port mapping prod ortamında genellikle internal network üzerinden yapılır, host portları değiştirilebilir.

---

## 6. Healthcheck

API healthcheck endpoint’i:

```
GET /health
```

- Status: `Healthy` → Her şey yolunda  
- Status: `Unhealthy` → DB bağlantısı veya başka bir servis problemi

---

## 7. Notlar / İpuçları

- Local development için `docker-compose-development.yml` kullanılabilir.  
- Prod ortamında sadece **API container + DB bağlantısı** yeterli.  
- Internal DB opsiyonel, sadece panel/ayarları tutacak.  
- Dokploy’da DB tipi **App** olarak seçilmeli ve gerekli env’ler girilmeli.