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
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  async function handleGetSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }

  async function handleGetUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      console.log("RUNNING GET USER", user);
      setUser(user);
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
    handleGetSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") handleGetUser();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, SignOut }}>{children}</UserContext.Provider>;
}
