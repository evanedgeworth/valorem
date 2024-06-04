import { ThrottlingErrorResponseContent } from "./ThrottlingErrorResponseContent";
import { ServiceErrorResponseContent } from "./ServiceErrorResponseContent";
import type { GetForecastResponseContent } from "./GetForecastResponseContent";

 export type GetForecastPathParams = {
    /**
     * @type string
    */
    cityId: string;
};
/**
 * @description GetForecast 200 response
*/
export type GetForecast200 = GetForecastResponseContent;
/**
 * @description ThrottlingError 429 response
*/
export type GetForecast429 = ThrottlingErrorResponseContent;
/**
 * @description ServiceError 500 response
*/
export type GetForecast500 = ServiceErrorResponseContent;
/**
 * @description GetForecast 200 response
*/
export type GetForecastQueryResponse = GetForecastResponseContent;
export type GetForecastQuery = {
    Response: GetForecastQueryResponse;
    PathParams: GetForecastPathParams;
    Errors: GetForecast429 | GetForecast500;
};