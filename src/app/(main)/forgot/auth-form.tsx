"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../types/supabase";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const resetPassword = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/callback?next=/update-password",
    });
    if (data) {
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full place-self-center lg:col-span-6">
      <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            Sign up
          </a>
          .
        </p>
        <form className="mt-4 space-y-6 sm:mt-6" action="#">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                //placeholder="••••••••"
                //required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full" onClick={resetPassword} isProcessing={isLoading}>
            {!isLoading && "Send Reset Password Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}
