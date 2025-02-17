import { Checkbox, Label, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";

type MultiSelectProps = {
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (data: string[]) => void;
};

export default function MultiSelect({ label, options, onChange, placeholder }: MultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(false)}>
        <Label className="mb-2 block">{label}</Label>
        {
          isOpen && (
            <RiArrowUpSLine className="dark:text-gray-400" size={22} />
          )
        }
      </div>
      <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
        {
          isOpen ? (
            <div>
              <TextInput
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2 w-full"
                icon={IoSearch}
              />
              <div>
                {filteredOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 p-2 cursor-pointer">
                    <Checkbox
                      value={option.value}
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleChange(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-between dark:text-gray-400 items-center cursor-pointer" onClick={() => setIsOpen(true)}>
              <p>{placeholder}</p>
              <RiArrowDownSLine size={22} />
            </div>
          )
        }
      </div>
    </div>
  );
}