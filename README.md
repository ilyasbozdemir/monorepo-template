# Monorepo Template

Bu monorepo şablonu, **Next.js, Node.js, TypeScript ve Turbo repo yönetimi** ile çalışır. Paketler `packages/*` içinde lokal olarak bulunur ve uygulamalar `apps/*` veya `examples/*` altında çalışır.

## Başlangıç

1. **Node ve pnpm sürümünü kontrol et**
```bash
node -v   # >=18
pnpm -v   # >=10
```

2. **Root dizinde bağımlılıkları kur**
```bash
pnpm install
```
> Bu komut workspace içindeki tüm paketleri ve npm bağımlılıklarını kurar. Local paketler symlink ile bağlanır.

3. **Build işlemi (root üzerinden)**
```bash
pnpm run build
```
> Tüm paketleri derler ve `dist` dizinlerini oluşturur. Local paketler diğer projelerde kullanılabilir.

4. **Uygulamayı çalıştır**
```bash
pnpm --filter apps/<app-name> dev
```
> Belirli bir uygulamayı geliştirme modunda çalıştırır. Local paketler import edildiğinde otomatik olarak güncel build kullanılır.

## Paket Yönetimi

- Local paketler `packages/*` altında bulunur.  
- Paketler arası bağımlılık symlink ile bağlanır.  
- Root üzerinden tüm paketler build edildiğinde, bağımlılıklar otomatik olarak güncellenir.

