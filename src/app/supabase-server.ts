import { Database } from "../../types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];

export const createServerSupabaseClient = cache(() => createServerComponentClient<Database>({ cookies }));

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();
  try {
    const { data: userDetails } = await supabase
      .from("profiles")
      .select("*, user_organizations(*)")
      .eq("id", session?.user.id || "")
      .returns<User>()
      .single();
    return userDetails;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
