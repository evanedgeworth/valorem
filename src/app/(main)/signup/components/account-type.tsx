"use client";
import { Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";
import { BiChevronRight } from "react-icons/bi";
import classNames from "classnames";
import Link from "next/link";

type FormValues = {
  accountType: string;
};

export default function AccountType() {
  const { onHandleNext, setFormData, formData } = useFormState();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const accountType = watch("accountType");
  function onSubmit(type: string) {
    const data = { accountType: type };
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  }

  const types = [
    { value: "client", label: "I manage properties" },
    { value: "contractor", label: "I am a service provider" },
  ];

  return (
    <form className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Request Access</h1>
          <p className="text-sm font-light text-gray-500 dark:text-gray-300">What type of user are you?</p>
          <div className="mt-4 space-y-6 sm:mt-6">
            {types.map((item) => (
              <div key={item.value}>
                <Button className="w-full" outline onClick={() => onSubmit(item.value)} color="gray">
                  <div className="flex flex-1 justify-between cursor-pointer">
                    {item.label}
                    <BiChevronRight size={20} />
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
