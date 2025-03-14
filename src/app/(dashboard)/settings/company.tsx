"use client";
import { Button, Label, TextInput } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import request from "@/utils/request";
import { useToast } from "@/context/toastContext";
import MarketSelect from "@/components/market-select";

interface CompanyInfoFormInputs {
  companyName: string;
  companyEmail: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  markets: string[];
}

export default function CompanyInfoForm() {
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<CompanyInfoFormInputs>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      markets: []
    },
  });

  useEffect(() => {

  }, [setValue]);

  const onSubmit: SubmitHandler<CompanyInfoFormInputs> = async (data) => {
    const res = await request({
      method: "PUT",
      url: "/company/info",
      data,
    });
    
    if (res.status === 200) {
      showToast("Successfully updated company info", "success");
    } else {
      showToast(res.data.message || "Failed to update", "error");
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold leading-tight tracking-tight">Company Info</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <div className="grid gap-4">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="companyName">Company name*</Label>
              <TextInput id="companyName" required {...register("companyName")} />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="companyEmail">Company email</Label>
              <TextInput id="companyEmail" required type="email" {...register("companyEmail")} />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="street">Street</Label>
              <TextInput id="street" required {...register("street")} />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="city">City</Label>
              <TextInput id="city" required {...register("city")} />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="zipCode">Zip code</Label>
              <TextInput id="zipCode" required {...register("zipCode")} />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="state">State</Label>
              <TextInput id="state" required {...register("state")} />
            </div>
          </div>
          <div className="flex flex-col">
            <MarketSelect
            />
   
          </div>
        </div>
        <div className="border-t border-t-gray-200 pt-4 dark:border-t-gray-600">
          <Button type="submit" isProcessing={isSubmitting} color="gray">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
