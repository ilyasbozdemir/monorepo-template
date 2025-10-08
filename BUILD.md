# Build & Local Development

## Local Test (Docker)

Local geliştirme ve test için backend ve MongoDB’yi Docker içinde çalıştırabilirsiniz.

**Adımlar:**

1. Local Docker Compose dosyasını oluşturun/adını `docker-compose.local.yml` verin:

```yaml
version: "3.8"

services:
  mongodb:
    build:
      context: ./apps/backend/mongodb
      dockerfile: Dockerfile
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  api:
    build:
      context: ./apps/backend/api/MongoDBServerAPI
      dockerfile: Dockerfile
    container_name: backend-api
    restart: unless-stopped
    depends_on:
      - mongodb
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://+:58837
      MONGO_CONNECTION_STRING: "mongodb://admin:secret@mongodb:27017"
    ports:
      - "58837:58837"

volumes:
  mongodb_data:
```

2. Local ortamda çalıştırmak için:

```bash
docker-compose -f docker-compose.local.yml up --build
```

- `api` backend ve `mongodb` konteynerleri ayağa kalkacaktır.
- Backend `http://localhost:58837` üzerinden ulaşılabilir.
- MongoDB `mongodb://localhost:27017` ile bağlanabilir.

---

## Server / Prod

- Sunucuda da aynı dizin yapısı ile çalışabilir.
- Prod ortamda `docker-compose.yml` dosyası kullanabilir veya Kubernetes, Traefik gibi yapı ile entegre edebilirsiniz.
- Backend ve DB zaten containerize olduğu için deployment süreci kolaydır.

---

## Geliştirme (Dev Container / VS Code)

- Diğer servisleri veya frontend’i geliştirmek için Dev Container veya VS Code Remote Container kullanılabilir.
- Backend ve MongoDB local olarak ayağa alındığında, frontend veya diğer servisler bunlara bağlanabilir.
- Bu sayede local geliştirme ortamınız server ile tutarlı olur.