"use client";
import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { Market } from "@/types";
import { useState } from "react";
import useDebounce from "@/utils/useDebounce";
import classNames from "classnames";

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  city: string;
  zipCode: number;
  state: string;
  markets: Market[];
};

export default function CompanyForm() {
  const { onHandleNext, setFormData, formData } = useFormState();
  const [inputValue, setInputValue] = useState("");
  const [marketValue, setMarketValue] = useState<Market[]>([]);

  const debouncedSearch = useDebounce(inputValue, 500);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CompanyFormValues>();

  const onSubmit = handleSubmit((data) => {
    setFormData((prev: any) => ({ ...prev, ...data, markets }));
    onHandleNext();
  });

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
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div>
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight">Company Info</h1>
          <div className="mt-4 space-y-6 sm:mt-6">
            <div className="grid gap-6 sm:grid-rows-2">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="companyName">Company Name*</Label>
                  <TextInput id="companyName" {...register("companyName", { required: "Company Name is required" })} />
                  {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
                </div>

                <div className="flex flex-col flex-1">
                  <Label htmlFor="companyEmail">Company Email*</Label>
                  <TextInput
                    id="companyEmail"
                    type="email"
                    placeholder="name@company.com"
                    {...register("companyEmail", {
                      required: "Company Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {errors.companyEmail && <p className="text-red-500 text-sm">{errors.companyEmail.message}</p>}
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="companyAddress">Address</Label>
                  <TextInput id="companyAddress" {...register("companyAddress", { required: "Company Address is required" })} />
                  {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress.message}</p>}
                </div>
              </div>
            </div>

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
                      style: { fontSize: "14px"},
                      className: classNames("text-gray-900 dark:text-white", params.inputProps.className)
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Button className="w-full" type="submit" color="gray">
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
