"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";

type CompanyFormValues = {
  companyName: string;
  companyEmail: string;
  address: string;
  city: string;
  zipCode: number;
  state: string;
};

export default function Confirmation() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { onHandleNext, setFormData, formData } = useFormState();

  const handleSignUp = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=dashboard`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        },
      },
    });
    if (error) alert(error.message);
    if (user) {
      if (formData.accountType === "client") {
        let organization = await handleCreateOrgination();
        if (organization) {
          await handleAddUserToOrg(user.id, organization.id);
        }
      } else {
        // Not a client
        onHandleNext();
      }
    }
  };

  async function handleCreateOrgination() {
    const { data: organization, error } = await supabase
      .from("organizations")
      .insert([{ name: formData.companyName, address: formData.address + " " + formData.city + " " + formData.state + ", " + formData.zipCode }])
      .select()
      .single();
    if (error) alert(error.message);
    if (organization) {
      return organization;
    }
  }

  async function handleAddUserToOrg(userId: string, organizationId: string) {
    const { data, error } = await supabase
      .from("user_organizations")
      .insert([{ user: userId, organization: organizationId, type: "client", role: "admin" }])
      .select();

    if (error) alert(error.message);
    if (data) onHandleNext();
  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>();

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
              <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">First Name:</p>
              <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white"> {formData.firstName}</p>
            </div>
            <div>
              <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Last Name:</p>
              <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white">{formData.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Email:</p>
              <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white"> {formData.email}</p>
            </div>
            <div>
              <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Phone:</p>
              <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white">{formData.phone}</p>
            </div>
          </div>

          {formData?.accountType === "client" && (
            <>
              <div className="grid grid-cols-2 pt-4 border-t border-gray-200">
                <div>
                  <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Company Name:</p>
                  <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white"> {formData.companyName}</p>
                </div>
                <div>
                  <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Company Email:</p>
                  <p className="mb-4 font-medium text-gray-900 sm:mb-5 dark:text-white">{formData.companyEmail}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 leading-none text-gray-500 dark:text-gray-400">Company Address:</p>
                <p className="font-medium text-gray-900 sm:mb-5 dark:text-white">
                  {formData.address}
                  <br />
                  {formData.city + " " + formData.state + ", " + formData.zipCode}
                </p>
              </div>
            </>
          )}
          <Button className="w-full" onClick={onSubmit}>
            Confirm Account
          </Button>
        </div>
      </div>
    </form>
  );
}
