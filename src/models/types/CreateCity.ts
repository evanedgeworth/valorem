import { ThrottlingErrorResponseContent } from "./ThrottlingErrorResponseContent";
import { ServiceErrorResponseContent } from "./ServiceErrorResponseContent";
import { CreateCityRequestContent } from "./CreateCityRequestContent";
import type { CreateCityResponseContent } from "./CreateCityResponseContent";

 /**
 * @description CreateCity 200 response
*/
export type CreateCity200 = CreateCityResponseContent;
/**
 * @description ThrottlingError 429 response
*/
export type CreateCity429 = ThrottlingErrorResponseContent;
/**
 * @description ServiceError 500 response
*/
export type CreateCity500 = ServiceErrorResponseContent;
export type CreateCityMutationRequest = CreateCityRequestContent;
/**
 * @description CreateCity 200 response
*/
export type CreateCityMutationResponse = CreateCityResponseContent;
export type CreateCityMutation = {
    Response: CreateCityMutationResponse;
    Request: CreateCityMutationRequest;
    Errors: CreateCity429 | CreateCity500;
};