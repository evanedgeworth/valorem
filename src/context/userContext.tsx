"use client";
import { createContext, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import useLocalStorage, { localStorageKey } from "@/utils/useLocalStorage";
import request from "@/utils/request";
import { CategoryItem, Organization, Role, User } from "@/types";
import Cookies from "js-cookie";

type UserContext = {
  user: User | undefined;
  selectedOrganization: Organization | undefined;
  setSelectedOrganization: (value: Organization) => void;
  setUser: (value: User) => void;
  allOrganizations: Organization[];
  categoryItems: CategoryItem[];
  signOut: () => Promise<void>;
  role: Role | undefined;
};

export const UserContext = createContext<UserContext>({} as UserContext);

export default function UserProvider({ children }: { children: JSX.Element[] }) {
  const [user, setUser] = useLocalStorage("currentUser", {} as User);
  const [selectedOrganization, setSelectedOrganization] = useLocalStorage("currentOrganization", {} as Organization);
  const [role, setRole] = useLocalStorage("currentRole", {} as Role);

  const [categoryItems, setCategoryItems] = useLocalStorage("categoryItems", [] as CategoryItem[]);

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
    if (role?.data) {
      setRole(role.data);
    }
  }

  async function handleGetOrganizations(user: any) {
    const res = await request({
      url: `/user_organizations?filterType=user&id=${user.id}`
    });

    if (res?.status === 403) {
      signOut();
    }
    const userOrganization = res.data?.userOrganizations?.[0];
    if (userOrganization) {
      setSelectedOrganization(userOrganization);
      setAllOrganizations(res.data?.userOrganizations);
    }
  }

  async function handleGetProfile(user: any) {
    const res = await request({
      url: `/profiles/${user.id}`,
      params: {
        includeMarkets: true
      }
    });



  }

  async function handleGetCategory() {
    const res = await request({
      url: `/category-items`,
      params: {
        all: true,
      }
    });

    
    if (res?.data?.categoryItems) {
      setCategoryItems(res.data.categoryItems);
    }
  }

  useEffect(() => {
    const token = Cookies.get(localStorageKey.accessToken);
    const user = localStorage.getItem(localStorageKey.user);

    if (token && user) {
      const userData = JSON.parse(user)
      handleGetUser(userData);
      handleGetOrganizations(userData);
      handleGetProfile(userData);
      handleGetCategory();
    } else {
      localStorage.clear();
      setSelectedOrganization(null);
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, selectedOrganization, setSelectedOrganization, allOrganizations, signOut, role, categoryItems }}>{children}</UserContext.Provider>
  );
}
