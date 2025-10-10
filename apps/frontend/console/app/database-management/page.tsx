import { DatabaseLayout } from "@/components/database/DatabaseLayout";

import PageClient from "./page.client";


export default async function Page() {
  return (
    <DatabaseLayout>
      <PageClient />
    </DatabaseLayout>
  );
}
