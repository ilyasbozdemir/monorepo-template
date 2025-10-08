# Katkıda Bulunma Rehberi - SUA v1.0.0

## Katkıda Bulunma Kuralları
- Kod, dokümantasyon ve hata düzeltmeleri kabul edilir.
- Kod standartları: Prettier ve ESLint kurallarına uyun.
- Commit mesajları açıklayıcı ve kısa olmalıdır (ör. `fix: düzeltilen bug` veya `feat: yeni özellik`).

## Branch ve PR Süreci
- Ana branch: `main`
- Geliştirme branch’i: `develop`
- PR açarken açıklayıcı bir başlık ve açıklama yazın.
- Hangi issue’yu çözdüğünüzü açıklamada belirtin.
- PR’lar, ilgili testlerin çalıştığından ve lint kurallarına uyulduğundan emin olduktan sonra merge edilecektir.

## Kodlama Standartları
- **Next.js + TypeScript + Tailwind** kullanımı
- **.NET Core** için PascalCase, interface başına `I` kullanımı
- Dockerfile ve CI/CD değişikliklerinde dikkatli olun
- Monorepo yapısına uygun olarak package sınırlarına dikkat edin

## Test ve Lint
- Unit ve e2e testler ekleyin
- Lint ve formatter kurallarına uymak zorunludur
- `pnpm test` ve `pnpm lint` komutlarını çalıştırarak kontrol edin

## Güvenlik ve Gizlilik
- Hassas bilgileri (API key, secret) repoya eklemeyin
- Açıkları özel olarak [SECURITY.md](./SECURITY.md) üzerinden bildirin
- Özel veriler veya müşteri bilgilerini paylaşmayın

## Yardım ve İletişim
- Sorularınız veya katkı ile ilgili tartışmalar için GitHub Issues kullanın
- Özel durumlar için geliştiriciye GitHub profilindeki iletişim alanından ulaşabilirsiniz: [@ilyasbozdemir](https://github.com/ilyasbozdemir)
