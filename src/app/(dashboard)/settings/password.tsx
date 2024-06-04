"use client";
// import AuthForm from "./auth-form";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { Database } from "../../../../types/supabase";
import { UserContext } from "@/context/userContext";

export default function Password() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { user, SignOut } = useContext(UserContext);

  useEffect(() => {
    setPassword("");
  }, [user]);

  const handleSubmitChanges = async () => {
    const { data, error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      alert(error.message);
    }
    if (data) {
      console.log("DATA", data);
    }
    router.refresh();
  };

  return (
    <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
      <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Password</h1>
      <p className="text-sm font-light text-gray-500 dark:text-gray-300">Make changes to your account here.</p>
      <div className="mt-4 space-y-6 sm:mt-6">
        <div className="grid gap-6 sm:grid-rows-2">
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="confirm password">Confirm password</Label>
            <TextInput
              id="confirm password"
              placeholder="••••••••"
              required
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>
        <Button className="w-full" onClick={handleSubmitChanges}>
          Submit Changes
        </Button>
      </div>
    </div>
  );
}
