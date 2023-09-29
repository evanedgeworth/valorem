"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FC, PropsWithChildren } from "react";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
type User = Database["public"]["Tables"]["profiles"]["Row"];

export const UserContext = createContext<any | null>(null);

export default function UserProvider({ children }: any) {
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  async function handleGetSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  }

  async function handleGetUser() {
    let { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user.id || "")
      .single();
    if (user) {
      setUser(user);
    }
    if (error) {
      console.log(error);
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
    if (session) {
      handleGetUser();
    }
  }, [session]);

  useEffect(() => {
    handleGetSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, SignOut }}>{children}</UserContext.Provider>;
}
