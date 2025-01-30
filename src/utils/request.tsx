import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLocalStorage, localStorageKey } from "./useLocalStorage";
import Cookies from "js-cookie";
import { Session, User } from "@/types";
import moment from "moment";

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export function saveSession(data: Session) {
  Cookies.set(localStorageKey.accessToken, data.accessToken, {
    sameSite: 'Strict',
  });
  Cookies.set(localStorageKey.refreshToken, data.refreshToken, {
    sameSite: 'Strict',
  });
  Cookies.set(localStorageKey.expiresAt, String(data.expiresAt), {
    sameSite: 'Strict',
  });
}

export async function getAccessToken(): Promise<string | null> {
  const expiresAt = Cookies.get(localStorageKey.expiresAt);
  const accessToken = Cookies.get(localStorageKey.accessToken);

  if (expiresAt && moment().isAfter(moment.unix(Number(expiresAt)))) {
    const newSession = await refreshToken();
    return newSession ? newSession : null;
  }

  return accessToken ? accessToken : null;
}

export async function refreshToken() {
  const user: User = await getLocalStorage(localStorageKey.user);
  const refreshToken = Cookies.get(localStorageKey.refreshToken);

  try {
    const { data, status } = await client.get(`/profiles/${user.id}/refresh?token=${refreshToken}`);
    if (status === 200) {
      saveSession(data);
      return data.accessToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error Refreshing Token:", error);
    return null;
  }
}


const request = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    client.defaults.headers.common.Authorization = `${accessToken}`;
  }

  const roleId = typeof window !== 'undefined' ? Cookies.get(localStorageKey.roleId) : '';
  if (roleId) {
    client.defaults.headers.common['Role-Id'] = `${roleId}`;
  }

  const onSuccess = (response: AxiosResponse) => response;
  const onError = (error: any) => {
    // optionally catch errors and add some additional logging here
    return error?.response;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
