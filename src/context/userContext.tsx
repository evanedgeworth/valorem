"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FC, PropsWithChildren } from "react";

import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
import useLocalStorage, { localStorageKey } from "@/utils/useLocalStorage";
import request from "@/utils/request";
import { Role } from "@/types";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];
type Organization = {
  organizationId: string;
  roleId: string;
  userId: string;
}
type UserContext = {
  user: User | undefined;
  selectedOrganization: Organization | undefined;
  setSelectedOrganization: (value: Organization) => void;
  allOrganizations: Organization[];
  signOut: () => Promise<void>;
  role: Role | undefined;
  isClientRole: boolean;
};

export const UserContext = createContext<UserContext>({} as UserContext);

export default function UserProvider({ children }: { children: JSX.Element[] }) {
  const [user, setUser] = useLocalStorage("currentUser", {} as User);
  const [selectedOrganization, setSelectedOrganization] = useLocalStorage("currentOrganization", {} as Organization);
  const [role, setRole] = useLocalStorage("currentRole", {} as Role);

  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const router = useRouter();

  async function signOut() {
    await request({
      url: '/logout'
    });
    localStorage.clear();
    router.replace('/login');
  }

  async function handleGetUser(user: any) {
    const role = await request({
      url: `/roles/${user.roleId}`
    });
    if (role.data) {
      setRole(role.data);
    }
  }

  async function handleGetOrganizations(user: any) {
    const res = await request({
      url: `/user_organizations?filterType=user&id=${user.id}`
    });

    if (res.status === 403) {
      signOut();
    }
    const userOrganization = res.data?.userOrganizations?.[0];
    if (userOrganization) {
      setSelectedOrganization(userOrganization);
      setAllOrganizations(res.data?.userOrganizations);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(localStorageKey.accessToken);
    const user = localStorage.getItem(localStorageKey.user);

    if (token && user) {
      handleGetUser(JSON.parse(user));
      handleGetOrganizations(JSON.parse(user));
    }
  }, []);

  const isClientRole = role?.type === 'CLIENT';
  return (
    <UserContext.Provider value={{ user, selectedOrganization, setSelectedOrganization, allOrganizations, signOut, role, isClientRole }}>{children}</UserContext.Provider>
  );
}
