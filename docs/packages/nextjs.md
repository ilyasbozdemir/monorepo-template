# @monorepo/nextjs

`@monorepo/nextjs`, monorepodaki Next.js uygulamalarında paylaşılacak server action ve yardımcıları barındırmak için açılmış bir iskelettir. Şu anda kaynak dosyalar boş olduğundan, paket herhangi bir export sağlamaz.【f1640a†L1-L4】【b975d8†L1-L2】

## Planlanan Kullanım

- Next.js 15 server action’larını paketleyip diğer uygulamalarla paylaşmak.
- Koleksiyon ve veritabanı yönetimiyle ilgili ortak action’ları `src/actions` altında toplamak.

## Nasıl Genişletilir?

1. `src/index.ts` dosyasında export etmek istediğiniz action veya yardımcıları dışa aktarın.【f1640a†L1-L4】
2. Her action için Jest/Playwright gibi uygun testler ekleyerek `pnpm --filter @monorepo/nextjs test` komutuna hazırlayın.

> Paket şu an boş olduğundan, ilk fonksiyonunuzu ekledikten sonra dokümanı güncelleyip örnek kullanım eklemeyi unutmayın.
