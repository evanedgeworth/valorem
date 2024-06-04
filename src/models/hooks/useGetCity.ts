import client from "@kubb/swagger-client/client";
import { useQuery } from "@tanstack/react-query";
import type { GetCityQueryResponse, GetCityPathParams, GetCity404, GetCity429, GetCity500 } from "../types/GetCity";
import type { UseBaseQueryOptions, UseQueryResult, QueryKey, WithRequired } from "@tanstack/react-query";

 type GetCityClient = typeof client<GetCityQueryResponse, GetCity404 | GetCity429 | GetCity500, never>;
type GetCity = {
    data: GetCityQueryResponse;
    error: GetCity404 | GetCity429 | GetCity500;
    request: never;
    pathParams: GetCityPathParams;
    queryParams: never;
    headerParams: never;
    response: GetCityQueryResponse;
    client: {
        parameters: Partial<Parameters<GetCityClient>[0]>;
        return: Awaited<ReturnType<GetCityClient>>;
    };
};
export const getCityQueryKey = (cityId: GetCityPathParams["cityId"]) => [{ url: "/city/:cityId", params: { cityId: cityId } }] as const;
export type GetCityQueryKey = ReturnType<typeof getCityQueryKey>;
export function getCityQueryOptions<TData = GetCity["response"], TQueryData = GetCity["response"]>(cityId: GetCityPathParams["cityId"], options: GetCity["client"]["parameters"] = {}): WithRequired<UseBaseQueryOptions<GetCity["response"], GetCity["error"], TData, TQueryData>, "queryKey"> {
    const queryKey = getCityQueryKey(cityId);
    return {
        queryKey,
        queryFn: async () => {
            const res = await client<GetCity["data"], GetCity["error"]>({
                method: "get",
                url: `/city/${cityId}`,
                ...options
            });
            return res.data;
        },
    };
}
/**
 * @link /city/:cityId
 */
export function useGetCity<TData = GetCity["response"], TQueryData = GetCity["response"], TQueryKey extends QueryKey = GetCityQueryKey>(cityId: GetCityPathParams["cityId"], options: {
    query?: Partial<UseBaseQueryOptions<GetCity["response"], GetCity["error"], TData, TQueryData, TQueryKey>>;
    client?: GetCity["client"]["parameters"];
} = {}): UseQueryResult<TData, GetCity["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getCityQueryKey(cityId);
    const query = useQuery<GetCity["data"], GetCity["error"], TData, any>({
        ...getCityQueryOptions<TData, TQueryData>(cityId, clientOptions),
        queryKey,
        ...queryOptions
    }) as UseQueryResult<TData, GetCity["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}