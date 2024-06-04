"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";
import { Router } from "next/router";

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  zipCode: number;
  state: string;
};

export default function VerifyEmail() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { onHandleNext, setFormData, formData } = useFormState();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>();

  function onSubmit() {
    router.push("/login");
  }

  return (
    <form className="w-full place-self-center lg:col-span-6">
      <div>
        <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Verify Email</h1>
          <p className="mb-10 text-gray-500 dark:text-gray-400">
            We&apos;ve just sent an email to {formData.email}.<br />
            Click the link in the email to verify it&apos;s you.
          </p>

          <Button className="w-full" onClick={onSubmit}>
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}
