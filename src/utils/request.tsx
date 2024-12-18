import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { localStorageKey } from "./useLocalStorage";
import Cookies from "js-cookie";

// optionally add base url
const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export async function getSession() {
  const supabase = createClientComponentClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const request = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const accessToken = typeof window !== 'undefined' ? Cookies.get(localStorageKey.accessToken) : '';
  if (accessToken) {
    client.defaults.headers.common.Authorization = `${accessToken}`;
  }

  const onSuccess = (response: AxiosResponse) => response;
  const onError = (error: any) => {
    // optionally catch errors and add some additional logging here
    return error?.response;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

// export default client;
