"use client";
import { createContext, useState, useEffect, useContext } from "react";

import { useRouter } from "next/navigation";
import useLocalStorage, { localStorageKey } from "@/utils/useLocalStorage";
import request from "@/utils/request";
import { CategoryItem, Organization, OrganizationRole, Role, User, UserOrganization } from "@/types";
import Cookies from "js-cookie";

type UserContext = {
  user: User | undefined;
  selectedOrganization: Organization | undefined;
  setSelectedOrganization: (value: Organization) => void;
  setUser: (value: User) => void;
  allOrganizations: Organization[];
  categoryItems: CategoryItem[];
  customCategoryItems: CategoryItem[];
  signOut: () => Promise<void>;
  role: OrganizationRole | undefined;
  handleGetCustomCatalog: (organizationId: string) => Promise<CategoryItem[]>;
};

export const UserContext = createContext<UserContext>({} as UserContext);

export default function UserProvider({ children }: { children: JSX.Element[] }) {
  const [user, setUser] = useLocalStorage(localStorageKey.user, {} as User);
  const [selectedOrganization, setSelectedOrganization] = useLocalStorage(localStorageKey.organization, {} as Organization);
  const [role, setRole] = useLocalStorage("currentRole", {} as Role);

  const [categoryItems, setCategoryItems] = useLocalStorage("categoryItems", [] as CategoryItem[]);
  const [customCategoryItems, setCustomCategoryItems] = useLocalStorage("customCategoryItems", [] as CategoryItem[]);

  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const router = useRouter();

  async function signOut(page?:string) {
    await request({
      url: '/logout'
    });
    localStorage.clear();
    setSelectedOrganization(null);
    setUser(null);
    setRole(null);
    Cookies.remove(localStorageKey.accessToken);
    Cookies.remove(localStorageKey.refreshToken);
    Cookies.remove(localStorageKey.roleId);
    router.replace(page || '/signup');
  }

  async function handleGetOrganizations(user: any, userOrganization: UserOrganization | null) {
    const userId = user.id;
    const res = await request({
      url: `/user_organizations`,
      params: {
        filterType: "user",
        includeRoles: true,
        id: userId,
      }
    });

    if (res?.status === 403) {
      signOut('/signup');
    }

    const firstOrganization = res?.data?.userOrganizations?.[0];
    if (userOrganization?.organizationId) {
      setSelectedOrganization(userOrganization);
      setRole(userOrganization.role);
      Cookies.set(localStorageKey.roleId, userOrganization.roleId);

      handleGetCustomCatalog(userOrganization.organizationId);
    } else if(firstOrganization) {
      setSelectedOrganization(firstOrganization);
      setRole(firstOrganization.role);
      Cookies.set(localStorageKey.roleId, firstOrganization.roleId);

      handleGetCustomCatalog(firstOrganization.organizationId);
    }

    setAllOrganizations(res.data?.userOrganizations || []);

    return res.data?.userOrganizations;
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

  async function handleGetCustomCatalog(organizationId: string) {
    const res = await request({
      url: `/category-items`,
      params: {
        all: true,
        organizationId
      }
    });

    if (res?.data?.categoryItems) {
      setCustomCategoryItems(res.data.categoryItems);
    }

    return res?.data?.categoryItems || [];
  }

  useEffect(() => {
    const token = Cookies.get(localStorageKey.accessToken);
    const user = localStorage.getItem(localStorageKey.user);
    const userOrganization = localStorage.getItem(localStorageKey.organization);

    if (token && user) {
      const userData = JSON.parse(user);
      const organization = userOrganization ? JSON.parse(userOrganization) : null;
      handleGetOrganizations(userData, organization);
      handleGetProfile(userData);
      handleGetCategory();

    } else {
      localStorage.clear();
      setSelectedOrganization(null);
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user, setUser, selectedOrganization, setSelectedOrganization, allOrganizations, signOut, role, categoryItems, customCategoryItems,
        handleGetCustomCatalog
      }}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext)