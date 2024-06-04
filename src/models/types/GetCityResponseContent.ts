import { CityCoordinates } from "./CityCoordinates";

 export type GetCityResponseContent = {
    /**
     * @type string
    */
    name: string;
    coordinates: CityCoordinates;
};