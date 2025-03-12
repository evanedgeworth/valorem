import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/app/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";


  if (token_hash && type) {
    const supabase = await createServerSupabaseClient();

  await supabase.auth.admin.generateLink({ email: "testadmin@mailinator.com", type: "recovery" })


    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // redirect user to email confirmation page
      redirect("/email-confirmation");
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
