"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import ConfirmationModal from "@/components/confirmation.modal";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export default function AuthForm() {

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const { onHandleNext, setFormData, formData } = useFormState();


  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => {
    console.log('========', data);
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  });

  console.log(errors);

  return (
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight ">Account details</h1>
          <div className="mt-4 space-y-6 sm:mt-6">
            <div className="grid gap-6 sm:grid-rows-2">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="firstName">First Name *</Label>
                  <TextInput id="firstName" required {...register("firstName")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Last Name *</Label>
                  <TextInput id="lastName" required {...register("lastName")} />
                </div>
              </div>
              <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Email Address *</Label>
                  <TextInput id="email" required type="email" {...register("email")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label>Phone</Label>
                  <TextInput id="phone" type="phone" {...register("phone", { required: false, minLength: 6, maxLength: 12 })} />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="password">Password *</Label>
                  <TextInput id="password" required {...register("password")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <TextInput id="confirmPassword" required {...register("confirmPassword")} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <Checkbox id="remember" required />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="remember">
                  By signing up, you are creating a Valorem account, and you agree to Valorem’s Terms of Use and Privacy Policy.
                </Label>
              </div>
            </div>
          </div>
          <Button className="w-full mt-8" type="submit">
            Next: Company Info
          </Button>
        </div>
      </div>
      <ConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        title="Confirm your email"
        description="We have sent an email to the email provided. Please confirm the email to login."
        handleCancel={() => router.push("/")}
        handleConfirm={() => router.push("/")}
      />
    </form>
  );
}
