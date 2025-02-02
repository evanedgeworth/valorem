"use client";
import { useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useFormState } from "./formState";
import request from "@/utils/request";
import { useToast } from "@/context/toastContext";
import { Market } from "@/types";
import { clientRoleId, contractorRoleId } from "@/utils/constants";

export type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  zipCode: number;
  state: string;
};

export default function Confirmation() {
  const { onHandleNext, setFormData, formData } = useFormState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleSignUp = async () => {
    setIsLoading(true);
    const data: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      roleId: formData.accountType === "client" ?  clientRoleId : contractorRoleId,
      organizationType: formData.accountType === "client" ?  "CLIENT" : "CONTRACTOR",
      marketIds: formData.markets ? formData.markets.map((item: Market) => item.id) : []
    };

    if (formData.accountType === 'client') {
      data.companyName = formData.companyName;
      data.companyAddress = formData.address;
      data.organizationName = formData.companyName;
      data.organizationAddress = formData.address;
    } else {
      data.organizationName = "Valorem Organization";
    }
    const res = await request({
      url: '/profiles',
      method: 'POST',
      data
    });

    if (res?.status === 200) {
      onHandleNext();
    } else {
      setIsLoading(false);
      showToast(res?.data?.message || 'Failed', 'error');
    }
  };

  function onSubmit() {
    handleSignUp();
  }

  return (
    <form className="w-full place-self-center lg:col-span-6">
      <div>
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Confirmation</h1>
          <div className="grid grid-cols-2">
            <div>
              <p className="mb-2 leading-none">First Name:</p>
              <p className="mb-4 font-medium sm:mb-5"> {formData.firstName}</p>
            </div>
            <div>
              <p className="mb-2 leading-none">Last Name:</p>
              <p className="mb-4 font-medium sm:mb-5">{formData.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="mb-2 leading-none">Email:</p>
              <p className="mb-4 font-medium sm:mb-5"> {formData.email}</p>
            </div>
            <div>
              <p className="mb-2 leading-none">Phone:</p>
              <p className="mb-4 font-medium sm:mb-5">{formData.phone}</p>
            </div>
          </div>

          {formData?.accountType === "client" && (
            <>
              <div className="grid grid-cols-2 pt-4 border-t border-gray-200">
                <div>
                  <p className="mb-2 leading-none">Company Name:</p>
                  <p className="mb-4 font-medium sm:mb-5"> {formData.companyName}</p>
                </div>
                <div>
                  <p className="mb-2 leading-none">Company Email:</p>
                  <p className="mb-4 font-medium sm:mb-5">{formData.companyEmail}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 leading-none">Company Address:</p>
                <p className="font-medium sm:mb-5">
                  {formData.companyAddress}
                </p>
              </div>
            </>
          )}
          <Button disabled={isLoading} className="w-full" onClick={onSubmit}>
            {isLoading ? <Spinner size="xs" /> : "Confirm Account"}
          </Button>
        </div>
      </div>
    </form>
  );
}
