"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../../types/supabase";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import ConfirmationModal from "@/components/confirmation.modal";
import SignupProgress from "./signup-progress";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { onHandleNext, setFormData, formData } = useFormState();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    });
    if (error) {
      alert(error.message);
    }
    if (data) {
      setShowConfirmationModal(true);
    }
    router.refresh();
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  });

  // function onSubmit(data: any) {
  //   setFormData((prev: any) => ({ ...prev, ...data }));
  //   onHandleNext();
  // }

  return (
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Account Info</h1>
          <p className="text-sm font-light text-gray-500 dark:text-gray-300">Fill out this form to request access to Valorem.</p>
          <div className="mt-4 space-y-6 sm:mt-6">
            <div className="grid gap-6 sm:grid-rows-2">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">First Name</Label>
                  <TextInput id="first name" required {...register("firstName")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Last Name</Label>
                  <TextInput id="last name" required {...register("lastName")} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput id="email" placeholder="name@company.com" required type="email" {...register("email")} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <TextInput id="password" placeholder="••••••••" required type="password" {...register("password")} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <TextInput id="phone" required type="phone" {...register("phone", { required: true, minLength: 6, maxLength: 12 })} />
              </div>
            </div>

            <div className="flex items-center justify-between">
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
            <Button className="w-full" type="submit">
              Continue
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
      </div>
    </form>
  );
}
