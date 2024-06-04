import client from "@kubb/swagger-client/client";
import { useQuery } from "@tanstack/react-query";
import type { GetCurrentTimeQueryResponse, GetCurrentTime429, GetCurrentTime500 } from "../types/GetCurrentTime";
import type { UseBaseQueryOptions, UseQueryResult, QueryKey, WithRequired } from "@tanstack/react-query";

 type GetCurrentTimeClient = typeof client<GetCurrentTimeQueryResponse, GetCurrentTime429 | GetCurrentTime500, never>;
type GetCurrentTime = {
    data: GetCurrentTimeQueryResponse;
    error: GetCurrentTime429 | GetCurrentTime500;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetCurrentTimeQueryResponse;
    client: {
        parameters: Partial<Parameters<GetCurrentTimeClient>[0]>;
        return: Awaited<ReturnType<GetCurrentTimeClient>>;
    };
};
export const getCurrentTimeQueryKey = () => [{ url: "/current-time" }] as const;
export type GetCurrentTimeQueryKey = ReturnType<typeof getCurrentTimeQueryKey>;
export function getCurrentTimeQueryOptions<TData = GetCurrentTime["response"], TQueryData = GetCurrentTime["response"]>(options: GetCurrentTime["client"]["parameters"] = {}): WithRequired<UseBaseQueryOptions<GetCurrentTime["response"], GetCurrentTime["error"], TData, TQueryData>, "queryKey"> {
    const queryKey = getCurrentTimeQueryKey();
    return {
        queryKey,
        queryFn: async () => {
            const res = await client<GetCurrentTime["data"], GetCurrentTime["error"]>({
                method: "get",
                url: `/current-time`,
                ...options
            });
            return res.data;
        },
    };
}
/**
 * @link /current-time
 */
export function useGetCurrentTime<TData = GetCurrentTime["response"], TQueryData = GetCurrentTime["response"], TQueryKey extends QueryKey = GetCurrentTimeQueryKey>(options: {
    query?: Partial<UseBaseQueryOptions<GetCurrentTime["response"], GetCurrentTime["error"], TData, TQueryData, TQueryKey>>;
    client?: GetCurrentTime["client"]["parameters"];
} = {}): UseQueryResult<TData, GetCurrentTime["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getCurrentTimeQueryKey();
    const query = useQuery<GetCurrentTime["data"], GetCurrentTime["error"], TData, any>({
        ...getCurrentTimeQueryOptions<TData, TQueryData>(clientOptions),
        queryKey,
        ...queryOptions
    }) as UseQueryResult<TData, GetCurrentTime["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}