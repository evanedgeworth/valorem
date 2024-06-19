// request.js
import { getSession } from "@/app/supabase-server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { Database } from "../../types/supabase";

// optionaly add base url
const client = axios.create({ baseURL: "https://5lkrv160l1.execute-api.us-west-2.amazonaws.com/prod" });

const request = async ({ ...options }) => {
  const supabase = createClientComponentClient<Database>();
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  const session = await getSession();

  client.defaults.headers.common.Authorization = `${session?.access_token}`;

  const onSuccess = (response: any) => response;
  const onError = (error: any) => {
    // optionaly catch errors and add some additional logging here
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
