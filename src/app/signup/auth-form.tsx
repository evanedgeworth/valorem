"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    console.log("Signing in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data) {
      router.refresh();
    }
    if (error) {
      setError(true);
    }
  };

  return (
    <div className="w-full place-self-center lg:col-span-6">
      <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
        <a
          href="#"
          className="mb-4 inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="mr-2 h-8 w-8"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a>
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-300">
          Start your website in seconds. Don’t have an account?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </a>
          .
        </p>
        <div className="mt-4 space-y-6 sm:mt-6">
          <div className="grid gap-6 sm:grid-rows-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Select your country" />
              </div>
              <Select id="countries" required>
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <Checkbox id="remember" required />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full" onClick={handleSignIn}>
            Sign in to your account
          </Button>
        </div>
      </div>
    </div>
  );
}
