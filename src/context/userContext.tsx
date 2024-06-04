"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FC, PropsWithChildren } from "react";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/utils/useLocalStorage";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];
type Orginization = Database["public"]["Tables"]["organizations"]["Row"];
type UserContext = {
  user: User | undefined;
  organization: Orginization | undefined;
  setOrganization: (value: Orginization) => void;
  allOrganizations: Orginization[];
  SignOut: () => Promise<void>;
};

export const UserContext = createContext<UserContext>({} as UserContext);

export default function UserProvider({ children }: { children: JSX.Element[] }) {
  const supabase = createClientComponentClient<Database>();
  // const [user, setUser] = useState<User>();
  const [user, setUser] = useLocalStorage("currentUser", {} as User);
  // const [organization, setOrganization] = useLocalStorage("currentUserOrganizations", {} as Orginization);
  const [organization, setOrganization] = useState<Orginization>();
  const [allOrganizations, setAllOrganizations] = useState<Orginization[]>([]);
  const [session, setSession] = useState<Session>();
  const router = useRouter();

  async function handleGetSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
      // handleGetUser();
      // handleGetOrganizations();
    }
  }

  async function handleGetUser() {
    let { data: user, error } = await supabase
      .from("profiles")
      .select("*, user_organizations!inner(*)")
      .eq("id", session?.user.id || "")
      .single();
    if (user) {
      setUser(user);
    }
    if (error) {
      console.log(error);
    }
  }

  async function handleGetOrganizations() {
    let { data: orgs, error } = await supabase
      .from("user_organizations")
      .select("organizations(*)")
      .eq("user", session?.user.id || "");
    if (orgs) {
      let formattedOrganizations: Orginization[] = orgs
        .flatMap((item) => item.organizations || []) // Flatten and filter out null values
        .filter(Boolean);

      setOrganization(formattedOrganizations[0]);
      setAllOrganizations(orgs.flatMap((item) => item.organizations || []));
    }
    if (error) {
      setAllOrganizations([]);
      console.log(error);
    }
  }

  async function SignOut() {
    let { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      // setUser(undefined);
      router.refresh();
    }
  }

  // useEffect(() => {
  //   handleGetSession();
  // }, []);

  useEffect(() => {
    if (session) {
      handleGetUser();
      handleGetOrganizations();
    }
  }, [session]);

  useEffect(() => {
    handleGetSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") handleGetSession();
      if (event == "SIGNED_OUT") {
        router.replace("/");
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, organization, setOrganization, allOrganizations, SignOut }}>{children}</UserContext.Provider>;
}
