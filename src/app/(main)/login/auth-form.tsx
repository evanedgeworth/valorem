"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../types/supabase";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import request from "@/utils/request";
import { localStorageKey } from "@/utils/useLocalStorage";
import Cookies from 'js-cookie';
import moment from "moment";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    setIsloading(true);
    const res = await request({
      method: 'POST',
      url: '/login',
      data: {
        email,
        password,
        deviceToken: ''
      }
    });

    if (res?.status === 200) {
      localStorage.setItem(localStorageKey.user, JSON.stringify(res.data.user));
      const expiresAt = moment.unix(res.data.expiresAt).toDate();
      Cookies.set(localStorageKey.accessToken, res.data.accessToken, {
        expires: expiresAt,
        secure: true,
        sameSite: 'Strict',
      });
      Cookies.set(localStorageKey.refreshToken, res.data.refreshToken, {
        expires: expiresAt,
        secure: true,
        sameSite: 'Strict',
      });
      router.push("/dashboard");
    } else {
      alert(res.data?.message || 'Failed');
      setIsloading(false);
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
              <TextInput id="email" placeholder="name@company.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                //placeholder="••••••••"
                //required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-start">
              <div className="flex h-5 items-center">
                <Checkbox id="remember" required />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div> */}
            <a href="/forgot" className="text-sm font-medium text-primary-600 hover:underline dark:text-white">
              Forgot password?
            </a>
          </div>
          <Button className="w-full" onClick={handleSignIn}>
            {isLoading ? <Spinner /> : "Sign in to your account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
