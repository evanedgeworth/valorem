import { Resend } from "resend";
import { Database } from "../../../../types/supabase";
import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import EmailTemplate from "@/components/email-template";
// type User = Database['public']['Tables']['users']['Row'];

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      // const supabase = createRouteHandlerClient<Database>({ cookies });
      const { email, firstName, lastName }: { email: string; firstName: string; lastName: string } = await req.json();

      // Send email link. Also create their user on the database
      const {
        data: { user },
        error,
      } = await supabase.auth.admin.generateLink({
        type: "invite",
        email: email,
      });

      //Updates their name on the database
      await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user?.id || "")
        .select();

      // Sends a welcome email
      const resendResponse = await resend.emails.send({
        from: "Valorem <team@blakecross.com>",
        to: user?.email || "",
        subject: "You been invited to join Valorem",
        react: EmailTemplate({
          message:
            "We invite you to discover Valorem, a powerful procurement solution. Streamline processes, enhance collaboration, and achieve cost savings effortlessly.",
        }),
      });

      return new Response(JSON.stringify(user), {
        status: 200,
      });
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify({ error: { statusCode: 500, message: err.message } }), {
        status: 500,
      });
    }
  }
}
