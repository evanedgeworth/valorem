"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import AuthForm from "./auth-form";

import type { Database } from "../../../types/supabase";

export default async function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    // router.refresh();
  };

  const handleSignIn = async (e: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data) {
      router.refresh();
    }
    // if (error) {
    //   setError(true);
    // }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // router.refresh();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-20 lg:py-16">
        <AuthForm />
        <div className="mr-auto place-self-center lg:col-span-6">
          <img
            className="mx-auto hidden lg:flex"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
            alt="illustration"
          />
        </div>
      </div>
    </section>
  );
}
