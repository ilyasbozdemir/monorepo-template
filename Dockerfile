# Node image
FROM node:24-alpine

# Bash ve dosya dönüştürücü ekle
RUN apk add --no-cache bash dos2unix

# Global pnpm kurulumu
RUN npm install -g pnpm

# Çalışma dizini
WORKDIR /app

# Sadece package dosyalarını önce kopyala (cache için)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Monorepo bağımlılıklarını yükle (devDependencies dahil)
RUN pnpm install --recursive --dev

# Tüm dosyaları kopyala
COPY . .

# Script’i LF yap ve executable yap
RUN dos2unix ./scripts/build-all-packages.sh
RUN chmod +x ./scripts/build-all-packages.sh

# Tüm paketleri build et
RUN bash ./scripts/build-all-packages.sh

# Örnek Next.js demo app dizinine geç ve bağımlılıkları yükle
WORKDIR /app/examples/nextjs-demo
RUN pnpm install
RUN pnpm build

# Portu aç
EXPOSE 3000

# Prod server başlat
CMD ["pnpm", "start", "--port", "3000"]
