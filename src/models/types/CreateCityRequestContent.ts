import { CityCoordinates } from "./CityCoordinates";

 export type CreateCityRequestContent = {
    /**
     * @type string
    */
    name: string;
    coordinates: CityCoordinates;
};