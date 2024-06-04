import { getUserDetails } from "@/app/supabase-server";
import { Suspense } from "react";
import InvoiceTable from "./invoice-table";
export default async function Page() {
  const [user] = await Promise.all([getUserDetails()]);

  return (
    user && (
      <Suspense>
        <InvoiceTable user={user} />
      </Suspense>
    )
  );
}
