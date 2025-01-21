"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import request from "@/utils/request";
import { localStorageKey } from "@/utils/useLocalStorage";
import Cookies from 'js-cookie';
import moment from "moment";
import { useToast } from "@/context/toastContext";
import { PasswordHide, PasswordShow } from "@/components/icon";
import Link from "next/link";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

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
      showToast(res?.data?.message || 'Failed!', 'error')
      setIsloading(false);
    }
  };

  return (
    <div className="w-full place-self-center lg:col-span-6">
      <div className="mx-auto rounded-lg bg-[#252525CC] px-10 py-14 shadow dark:bg-gray-800 sm:max-w-xl">
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight ">Welcome back! Please <br />login into your account.</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }} className="mt-4 space-y-6 sm:mt-6" action="#">
          <div className="grid gap-4">
            <div>
              <TextInput id="email" placeholder="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <TextInput
                id="password"
                placeholder="Password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute top-2 right-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <PasswordHide /> : <PasswordShow />}
              </button>
            </div>
          </div>
          <Button color="light" type="submit" className="w-full" >
            {isLoading ? <Spinner /> : "Login"}
          </Button>
          <div className="flex items-center justify-between">
            <div></div>
            <Link href="/signup" className="text-base font-medium text-primary-600 hover:underline dark:text-white">
              Sign up here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
