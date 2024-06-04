import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { CreateCityMutationRequest, CreateCityMutationResponse, CreateCity429, CreateCity500 } from "../types/CreateCity";
import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";

 type CreateCityClient = typeof client<CreateCityMutationResponse, CreateCity429 | CreateCity500, CreateCityMutationRequest>;
type CreateCity = {
    data: CreateCityMutationResponse;
    error: CreateCity429 | CreateCity500;
    request: CreateCityMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: CreateCityMutationResponse;
    client: {
        parameters: Partial<Parameters<CreateCityClient>[0]>;
        return: Awaited<ReturnType<CreateCityClient>>;
    };
};
/**
 * @link /city
 */
export function useCreateCity(options: {
    mutation?: UseMutationOptions<CreateCity["response"], CreateCity["error"], CreateCity["request"]>;
    client?: CreateCity["client"]["parameters"];
} = {}): UseMutationResult<CreateCity["response"], CreateCity["error"], CreateCity["request"]> {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation<CreateCity["response"], CreateCity["error"], CreateCity["request"]>({
        mutationFn: async (data) => {
            const res = await client<CreateCity["data"], CreateCity["error"], CreateCity["request"]>({
                method: "post",
                url: `/city`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}