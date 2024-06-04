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
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export default function AccountType() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { onHandleNext, setFormData, formData } = useFormState();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(accountType: string) {
    const data = { accountType: accountType };
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  }

  return (
    <form className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Request Access</h1>
          <p className="text-sm font-light text-gray-500 dark:text-gray-300">What type of user are you?</p>
          <div className="mt-4 space-y-6 sm:mt-6">
            <Button className=" flex flex-1 justify-between" outline fullSized onClick={() => onSubmit("client")}>
              <div className="flex flex-1 justify-between cursor-pointer">
                I&apos;m a client
                <BiChevronRight size={20} />
              </div>
            </Button>
            <Button className="w-full" outline onClick={() => onSubmit("supplier")}>
              <div className="flex flex-1 justify-between cursor-pointer">
                I&apos;m a supplier
                <BiChevronRight size={20} />
              </div>
            </Button>
            <Button className="w-full" outline onClick={() => onSubmit("vendor")}>
              <div className="flex flex-1 justify-between cursor-pointer">
                I&apos;m a vendor
                <BiChevronRight size={20} />
              </div>
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
