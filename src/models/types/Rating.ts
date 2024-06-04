export const rating = {
    "SUPER_HAPPY": "SUPER_HAPPY",
    "SOMEWHAT_HAPPY": "SOMEWHAT_HAPPY",
    "MEH": "MEH",
    "NOT_SO_HAPPY": "NOT_SO_HAPPY",
    "UNHAPPY": "UNHAPPY"
} as const;
export type Rating = (typeof rating)[keyof typeof rating];