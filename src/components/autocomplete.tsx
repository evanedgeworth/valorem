import { TextInput, TextInputProps } from "flowbite-react";
import { useState } from "react";

interface AutocompleteProps<T> extends Omit<TextInputProps, "onSelect"> {
  options: T[];
  onOptionSelect: (option: T) => void;
  getOptionLabel: (option: T) => string;
  isLoading?: boolean;
}

const Autocomplete = <T,>({ options, onOptionSelect, getOptionLabel, isLoading, ...props }: AutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setFilteredOptions(options.filter((option) => getOptionLabel(option).toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredOptions([]);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <TextInput
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Search..."
        {...props}
      />
      {isLoading && <div className="absolute top[100%] left-0 w[100%] bg-slate-50 p-4 text-center">Loading...</div>}
      {!isLoading && isFocused && filteredOptions.length > 0 && (
        <ul className="list-none p-0 m-0 absolute w-full top-full left-0 bg-white border border-gray-300 shadow-md max-h-56 overflow-y-auto z-50">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setInputValue(getOptionLabel(option));
                onOptionSelect(option);
              }}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
