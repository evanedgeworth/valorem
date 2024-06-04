export type ForecastResult = ({
    /**
     * @type number, float
    */
    rain: number;
} | {
    /**
     * @type number
    */
    sun: number;
});