"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FC, PropsWithChildren } from "react";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";

export const UserContext = createContext<any | null>(null);

export default function UserProvider({ children }: any) {
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<any>();
  const router = useRouter();

  async function handleGetUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      console.log(user);
    }
  }

  async function SignOut() {
    let { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setUser(null);
      router.push("/");
    }
  }

  useEffect(() => {
    handleGetUser();
  }, []);
  return <UserContext.Provider value={{ user, SignOut }}>{children}</UserContext.Provider>;
}
