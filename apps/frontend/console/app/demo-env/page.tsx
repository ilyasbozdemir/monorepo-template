import PageClient from "./page.client";

export default async function Page() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <>
      <PageClient />
    </>
  );
}
