"use client";
import { createContext, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import useLocalStorage, { localStorageKey } from "@/utils/useLocalStorage";
import request from "@/utils/request";
import { Organization, Role, User } from "@/types";
import Cookies from "js-cookie";

type UserContext = {
  user: User | undefined;
  selectedOrganization: Organization | undefined;
  setSelectedOrganization: (value: Organization) => void;
  allOrganizations: Organization[];
  signOut: () => Promise<void>;
  role: Role | undefined;
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
    Cookies.remove(localStorageKey.accessToken);
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
    const token = Cookies.get(localStorageKey.accessToken);
    const user = localStorage.getItem(localStorageKey.user);

    if (token && user) {
      handleGetUser(JSON.parse(user));
      handleGetOrganizations(JSON.parse(user));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, selectedOrganization, setSelectedOrganization, allOrganizations, signOut, role }}>{children}</UserContext.Provider>
  );
}
