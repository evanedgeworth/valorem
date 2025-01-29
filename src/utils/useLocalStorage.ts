"use client"
import { useState, useEffect } from "react";

export const localStorageKey = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  roleId: 'roleId',
  expiresAt: 'expiresAt',
  user: 'currentUser',
  organization: 'currentOrganization',
  userOrganization: 'userOrganization'
}

export function getLocalStorage(key:string) {
  let currentValue;

  try {
    currentValue = JSON.parse(localStorage.getItem(key) || String({}));
  } catch (error) {
    currentValue = null;
  }

  return currentValue;
}

const useLocalStorage = (key: string, defaultValue: unknown) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
