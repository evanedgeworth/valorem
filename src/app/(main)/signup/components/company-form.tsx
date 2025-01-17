"use client";
import { Button, Checkbox, Label, TextInput, Select, Badge } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { useFormState } from "./formState";
import Autocomplete from "@mui/material/Autocomplete";
import { states, Markets } from "@/utils/defaults";
import TextField from "@mui/material/TextField";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  zipCode: number;
  state: string;
  markets: string[];
};

export default function CompanyForm() {
  const { onHandleNext, setFormData, formData } = useFormState();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CompanyFormValues>();

  const onSubmit = handleSubmit((data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  });

  const fetchAllMarkets = async (nextToken = '') => {
    const res = await request({
      url: `/markets${nextToken ? `?nextToken=${nextToken}` : ''}`,
      method: 'GET',
    });
  
    if (res?.status !== 200) {
      throw new Error(res.data.message);
    }
  
    const { markets, nextToken: newNextToken } = res.data;
  
    if (newNextToken) {
      const nextMarkets: any[] = await fetchAllMarkets(newNextToken);
      return [...markets, ...nextMarkets];
    }
  
    return markets;
  };


  // const {} = useQuery({
  //   queryKey: ['markets'],
  //   queryFn: async () => {
  //     const res = await fetchAllMarkets();
  //     return res;
  //   },
  // })

  return (
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div>
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight">Company Info</h1>
          {/* <p className="text-sm font-light text-gray-500 dark:text-gray-300">Fill out this form to request access to Valorem.</p> */}
          <div className="mt-4 space-y-6 sm:mt-6">
            <div className="grid gap-6 sm:grid-rows-2">
              <div className="flex flex-row gap-4">

                <div className="flex flex-col flex-1">
                  <Label htmlFor="company">Company Name*</Label>
                  <TextInput required {...register("companyName")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Company Email*</Label>
                  <TextInput placeholder="name@company.com" required type="email" {...register("companyEmail")} />
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Street Address</Label>
                  <TextInput id="first name" required {...register("address")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">City</Label>
                  <TextInput id="last name" required {...register("city")} />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Zip Code</Label>
                  <TextInput id="zip code" type="number" required {...register("zipCode")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="state" value="State" />
                  <Select id="state" required {...register("state")}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="markets" value="Markets" />
              <Controller
                control={control}
                name="markets"
                rules={{
                  required: true,
                  minLength: 5,
                }}
                render={({ field: { onChange, value }, fieldState, formState }) => (
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={Markets}
                    getOptionLabel={(option) => option}
                    onChange={(e, data) => onChange(data)}
                    value={value}
                    size="small"
                    disableCloseOnSelect
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox id="remember" checked={selected} className="mr-2" />
                        {option}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full text-white p-10"
                        error={fieldState?.invalid || value?.length < 1}
                        helperText={fieldState?.invalid && "Please select at least 5 markets."}
                      />
                    )}
                  />
                )}
              />
            </div>
            <div>
            <Button className="w-full" type="submit">
              Next: Confirmation
            </Button>
            <Button fullSized className="bg-transparent border-white border mt-3">
              Add Later
            </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
