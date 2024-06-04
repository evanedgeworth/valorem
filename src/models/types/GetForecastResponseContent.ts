import { Rating } from "./Rating";
import { ForecastResult } from "./ForecastResult";

 export type GetForecastResponseContent = {
    rating?: Rating;
    forecast?: ForecastResult;
};