"use client";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
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

export default function VerifyEmail() {
  const router = useRouter();
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
        <div className="mx-auto sm:max-w-xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight">Verify your email adress</h1>
          <p className="mb-10 text-gray-500 dark:text-gray-400">
            We&apos;ve just sent an email to {formData.email}.<br />
            Click the link in the email to verify it&apos;s you.
          </p>

          <Button className="w-full" onClick={onSubmit} color="gray">
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}
