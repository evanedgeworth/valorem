// request.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Database } from "../../types/supabase";

// optionally add base url
const client = axios.create({ baseURL: "https://5lkrv160l1.execute-api.us-west-2.amazonaws.com/prod" });

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
  const session = await getSession();

  client.defaults.headers.common.Authorization = `${session?.access_token}`;

  const onSuccess = (response: AxiosResponse) => response;
  const onError = (error: any) => {
    // optionally catch errors and add some additional logging here
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

// export default client;
