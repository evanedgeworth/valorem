import { NoSuchResourceResponseContent } from "./NoSuchResourceResponseContent";
import { ThrottlingErrorResponseContent } from "./ThrottlingErrorResponseContent";
import { ServiceErrorResponseContent } from "./ServiceErrorResponseContent";
import type { GetCityResponseContent } from "./GetCityResponseContent";

 export type GetCityPathParams = {
    /**
     * @type string
    */
    cityId: string;
};
/**
 * @description GetCity 200 response
*/
export type GetCity200 = GetCityResponseContent;
/**
 * @description NoSuchResource 404 response
*/
export type GetCity404 = NoSuchResourceResponseContent;
/**
 * @description ThrottlingError 429 response
*/
export type GetCity429 = ThrottlingErrorResponseContent;
/**
 * @description ServiceError 500 response
*/
export type GetCity500 = ServiceErrorResponseContent;
/**
 * @description GetCity 200 response
*/
export type GetCityQueryResponse = GetCityResponseContent;
export type GetCityQuery = {
    Response: GetCityQueryResponse;
    PathParams: GetCityPathParams;
    Errors: GetCity404 | GetCity429 | GetCity500;
};