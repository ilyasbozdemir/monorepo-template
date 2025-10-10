import PageClient from "./page.client";

export const metadata = {
  robots: "noindex",
};

export default async function Page() {
  return (
    <>
      <PageClient />
    </>
  );
}
