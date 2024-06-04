import { getUserDetails } from "@/app/supabase-server";
import UserTable from "./user-table";
import { Suspense } from "react";
export default async function Page() {
  const [user] = await Promise.all([getUserDetails()]);

  return (
    user && (
      <Suspense>
        <UserTable user={user} />
      </Suspense>
    )
  );
}
