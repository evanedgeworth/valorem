import { Market } from "@/types";
import request from "@/utils/request";
import useDebounce from "@/utils/useDebounce";
import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Label } from "flowbite-react";
import { useState } from "react";

export default function MarketSelect() {
  const [inputValue, setInputValue] = useState("");
  const [marketValue, setMarketValue] = useState<Market[]>([]);

  const debouncedSearch = useDebounce(inputValue, 500);
  const { data, isLoading } = useQuery({
    queryKey: ["markets", debouncedSearch],
    queryFn: async () => {
      const res = await request({
        url: `/markets?searchInput=${debouncedSearch}`,
        method: "GET",
      });

      if (res?.status !== 200) {
        throw new Error(res.data.message);
      }

      return res.data;
    },
  });

  const markets: Market[] = data?.markets || [];

  return (
    <div>
      <Label htmlFor="markets">Markets</Label>
      <Autocomplete
        multiple
        id="multiple-limit-tags"
        options={markets}
        getOptionLabel={(option) => `${option.zipCode}, ${option.city}, ${option.stateId}`}
        onChange={(e, data) => setMarketValue(data)}
        onInputChange={(e, v) => {
          setInputValue(v);
        }}
        value={marketValue || []}
        size="small"
        loading={isLoading}
        disableCloseOnSelect
        ChipProps={{
          className: "text-gray-900 dark:text-white"
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for markets"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-10"
            inputProps={{
              ...params.inputProps,
              style: { fontSize: "14px" },
              className: classNames("text-gray-900 dark:text-white", params.inputProps.className)
            }}
          />
        )}
      />
    </div>
  )
}