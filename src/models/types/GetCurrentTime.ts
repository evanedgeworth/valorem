import { ThrottlingErrorResponseContent } from "./ThrottlingErrorResponseContent";
import { ServiceErrorResponseContent } from "./ServiceErrorResponseContent";
import type { GetCurrentTimeResponseContent } from "./GetCurrentTimeResponseContent";

 /**
 * @description GetCurrentTime 200 response
*/
export type GetCurrentTime200 = GetCurrentTimeResponseContent;
/**
 * @description ThrottlingError 429 response
*/
export type GetCurrentTime429 = ThrottlingErrorResponseContent;
/**
 * @description ServiceError 500 response
*/
export type GetCurrentTime500 = ServiceErrorResponseContent;
/**
 * @description GetCurrentTime 200 response
*/
export type GetCurrentTimeQueryResponse = GetCurrentTimeResponseContent;
export type GetCurrentTimeQuery = {
    Response: GetCurrentTimeQueryResponse;
    Errors: GetCurrentTime429 | GetCurrentTime500;
};