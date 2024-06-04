import { CityCoordinates } from "./CityCoordinates";

 export type CreateCityResponseContent = {
    /**
     * @type string
    */
    cityId: string;
    /**
     * @type string
    */
    name: string;
    coordinates: CityCoordinates;
};