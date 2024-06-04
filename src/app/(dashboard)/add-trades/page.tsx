"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Checkbox, Label, TextInput, Select, Badge, Datepicker, FileInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { states, Trades } from "@/utils/defaults";
import TextField from "@mui/material/TextField";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Database } from "../../../../types/supabase";
import { IoCloseCircle } from "react-icons/io5";

type trade = {
  name: string;
  file: any;
  is_licensed: boolean;
  expiration_date?: string;
};

export default function AddTrades() {
  const [trades, setTrades] = useState<trade[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<trade[]>();

  // function onSubmit(data: trade[]) {
  //   const tradesArray = Object.values(data);
  //   console.log(tradesArray);
  // }

  async function onSubmit(data: trade[]) {
    setIsUploading(true);
    // formats form data into array
    const tradesArray = Object.values(data);

    // get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // attaches user to each trade and removes file
    const formattedTradesForTable = tradesArray.map(({ file, ...rest }) => ({
      ...rest,
      user: session?.user.id,
    }));

    const { data: tradesResponse, error } = await supabase.from("skill-trades").insert(formattedTradesForTable);
    if (tradesResponse) {
      router.push("/dashboard");
    }
    if (error) {
      alert(error.message);
    }
    setIsUploading(false);
  }

  function alphabeticalSorting(a: trade, b: trade) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  return (
    <div className="p-5 lg:col-span-6 w-full">
      <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Add Trades</h1>
      <p className="text-sm font-light text-gray-500 dark:text-gray-300">
        By uploading and submitting your trade license, you agree and acknowledge that we reserve the right to verify the authenticity and validity of
        the provided document. We may conduct checks to ensure compliance with regulatory requirements and internal policies. Submission of false,
        expired, or misleading information may result in the rejection of your application and potential legal consequences.
      </p>
      <div className="mt-4 space-y-6 sm:mt-6">
        <div>
          <Label htmlFor="trades" value="Trades" />

          <Autocomplete
            multiple
            freeSolo
            limitTags={2}
            id="multiple-limit-tags"
            options={Trades}
            getOptionLabel={(option) => option}
            onChange={(e, data) => setTrades(data.map((item) => ({ name: item, file: undefined, is_licensed: true })))}
            value={trades?.map((item) => item.name)}
            size="small"
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox id="remember" checked={selected} className="mr-2" />
                {option}
              </li>
            )}
            sx={{
              ".MuiAutocomplete-input": {
                backgroundColor: "transparent",
              },
            }}
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Badge
                  {...getTagProps({ index })}
                  icon={IoCloseCircle}
                  color={"blue"}
                  onClick={() => getTagProps({ index }).onDelete(index)}
                  className="cursor-pointer mr-1"
                  key={option}
                >
                  {option}
                </Badge>
              ));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-0"
              />
            )}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {trades.sort(alphabeticalSorting)?.map((trade, index) => {
            const fieldName = `trades[${index}]`;
            setValue(`${index}.name`, trade.name);
            const isChecked = watch(`${index}.is_licensed`);
            return (
              <fieldset name={fieldName} key={fieldName}>
                <div key={trade.name}>
                  <div className="flex justify-between items-center mb-4">
                    <Label htmlFor={trade.name} value={trade.name} {...register(`${index}.name`)} />
                    <div>
                      <Label htmlFor="expiration" value="Expiration Date" />
                      <Controller
                        name={`${index}.expiration_date`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Datepicker {...register(`${index}.expiration_date`)} required onSelectedDateChanged={onChange} value={value} />
                        )}
                      />
                    </div>
                  </div>
                  {!isChecked && <FileInput className="mb-4" {...register(`${index}.file`)} required />}
                  {/* <label className="flex justify-center min-w-[300px] h-[300px] px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none bg-gray-100 dark:bg-gray-800">
                <span className="flex flex-col justify-center items-center space-x-2 ">
                  <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                  <span className="font-medium text-gray-600">Click here to upload your file or drag and drop</span>
                </span>
                <input type="file" name="file_upload" className="hidden" onChange={(e) => handleAddFile(e, trade.name)} />
              </label> */}
                  <div className="flex items-center gap-2">
                    <Checkbox {...register(`${index}.is_licensed`)} />
                    <Label htmlFor="accept" className="flex">
                      This trade is not licensed
                    </Label>
                  </div>
                </div>
              </fieldset>
            );
          })}

          <div className="flex justify-end">
            <Button type="submit" isProcessing={isUploading}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
