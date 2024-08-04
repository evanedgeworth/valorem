import { SetStateAction, SyntheticEvent, useState } from "react";

import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { List, TextInput } from "flowbite-react";
import { Autocomplete, TextField } from "@mui/material";

export default function PlaceAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: google.maps.places.AutocompletePrediction) => void;
}) {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGoogle({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });
  const [selectedPlace, setSelectedPlace] = useState<string | google.maps.places.AutocompletePrediction | null>("");

  return (
    <Autocomplete
      freeSolo
      limitTags={1}
      id="multiple-limit-tags"
      options={placePredictions}
      // onChange={(evt, value) => {
      //   setSelectedPlace(value);
      // }}
      onChange={(ev, value) => {
        if (typeof value !== "string" && !!value) {
          onChange(value);
        }
      }}
      onInputChange={(e, value) => {
        getPlacePredictions({ input: value || "" });
      }}
      loading={isPlacePredictionsLoading}
      // value={selectedPlace}
      value={value}
      size="small"
      getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
      sx={{
        ".MuiAutocomplete-input": {
          backgroundColor: "transparent",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-0"
        />
      )}
    />
  );
}
