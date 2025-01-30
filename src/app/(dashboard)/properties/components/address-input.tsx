import { useState } from "react";
import Autocomplete from "react-google-autocomplete";

export default function AddressInput({
  value,
  onChange,
}: {
  value?: string;
  onChange: (place: google.maps.places.PlaceResult) => void;
}) {
  const [select, setSelect] = useState(false);

  if (select) {
    return (
      <input
        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
        value={value}
        readOnly
      />
    );
  }

  return (
    <Autocomplete
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
      onPlaceSelected={(place) => {
        setSelect(true);
        setTimeout(() => {
          setSelect(false);
        }, 1000);
        onChange(place);
      }}
      options={{
        types: ["address"],
        componentRestrictions: { country: "us" },
      }}
      defaultValue={value}
    />
  );
}
