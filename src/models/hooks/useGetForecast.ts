import client from "@kubb/swagger-client/client";
import { useQuery } from "@tanstack/react-query";
import type { GetForecastQueryResponse, GetForecastPathParams, GetForecast429, GetForecast500 } from "../types/GetForecast";
import type { UseBaseQueryOptions, UseQueryResult, QueryKey, WithRequired } from "@tanstack/react-query";

 type GetForecastClient = typeof client<GetForecastQueryResponse, GetForecast429 | GetForecast500, never>;
type GetForecast = {
    data: GetForecastQueryResponse;
    error: GetForecast429 | GetForecast500;
    request: never;
    pathParams: GetForecastPathParams;
    queryParams: never;
    headerParams: never;
    response: GetForecastQueryResponse;
    client: {
        parameters: Partial<Parameters<GetForecastClient>[0]>;
        return: Awaited<ReturnType<GetForecastClient>>;
    };
};
export const getForecastQueryKey = (cityId: GetForecastPathParams["cityId"]) => [{ url: "/city/:cityId/forecast", params: { cityId: cityId } }] as const;
export type GetForecastQueryKey = ReturnType<typeof getForecastQueryKey>;
export function getForecastQueryOptions<TData = GetForecast["response"], TQueryData = GetForecast["response"]>(cityId: GetForecastPathParams["cityId"], options: GetForecast["client"]["parameters"] = {}): WithRequired<UseBaseQueryOptions<GetForecast["response"], GetForecast["error"], TData, TQueryData>, "queryKey"> {
    const queryKey = getForecastQueryKey(cityId);
    return {
        queryKey,
        queryFn: async () => {
            const res = await client<GetForecast["data"], GetForecast["error"]>({
                method: "get",
                url: `/city/${cityId}/forecast`,
                ...options
            });
            return res.data;
        },
    };
}
/**
 * @link /city/:cityId/forecast
 */
export function useGetForecast<TData = GetForecast["response"], TQueryData = GetForecast["response"], TQueryKey extends QueryKey = GetForecastQueryKey>(cityId: GetForecastPathParams["cityId"], options: {
    query?: Partial<UseBaseQueryOptions<GetForecast["response"], GetForecast["error"], TData, TQueryData, TQueryKey>>;
    client?: GetForecast["client"]["parameters"];
} = {}): UseQueryResult<TData, GetForecast["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getForecastQueryKey(cityId);
    const query = useQuery<GetForecast["data"], GetForecast["error"], TData, any>({
        ...getForecastQueryOptions<TData, TQueryData>(cityId, clientOptions),
        queryKey,
        ...queryOptions
    }) as UseQueryResult<TData, GetForecast["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}