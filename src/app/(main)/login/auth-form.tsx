"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import request, { saveSession } from "@/utils/request";
import { localStorageKey } from "@/utils/useLocalStorage";
import { useToast } from "@/context/toastContext";
import Link from "next/link";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSignIn = async () => {
    setIsloading(true);
    const res = await request({
      method: "POST",
      url: "/login",
      data: {
        email,
        password,
        deviceToken: "",
      },
    });

    if (res?.status === 200) {
      localStorage.setItem(localStorageKey.user, JSON.stringify(res.data.user));
      saveSession(res.data);
      router.push("/properties");
    } else {
      showToast(res.data?.message || "Failed!", "error");
      setIsloading(false);
    }
  };

  return (
    <div className="w-full place-self-center lg:col-span-6">
      <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            Sign up
          </Link>
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
          <Button className="w-full" onClick={handleSignIn} color="gray">
            {isLoading ? <Spinner /> : "Sign in to your account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
