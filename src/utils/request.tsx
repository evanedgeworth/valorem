import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { localStorageKey } from "./useLocalStorage";
import Cookies from "js-cookie";

// optionally add base url
const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

const request = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const accessToken = typeof window !== 'undefined' ? Cookies.get(localStorageKey.accessToken) : '';
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
