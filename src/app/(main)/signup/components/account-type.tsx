"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import ConfirmationModal from "@/components/confirmation.modal";
import { useForm } from "react-hook-form";
import { useFormState } from "./formState";
import { BiChevronRight } from "react-icons/bi";
import classNames from "classnames";
import Link from "next/link";

type FormValues = {
  type: string;
};

export default function AccountType() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const { onHandleNext, setFormData, formData } = useFormState();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const type = watch("type");
  function onSubmit() {
    const data = { accountType: type };
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  }

  const types = [
    { value: "client", label: "I manage properties" },
    { value: "contractor", label: "I am a service provider" },
  ]

  return (
    <form className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight">Request access to Valorem</h1>
          <p className="text-lg font-light text-gray-400 mt-4">Tell us about yourself</p>
          <div className="mt-2 space-y-6">
            {
              types.map(item => (
                <div key={item.value}>
                <Button color="gray"  className={classNames("block w-full border hover:bg-gray-700", { "border-[#0C6291] text-white": item.value === type, "border-transparent text-gray-400": item.value !== type })} size="xl" onClick={() => setValue("type", item.value)}>
                  <div className="flex flex-1 justify-between cursor-pointer w-full items-center">
                    {item.label}
                    <BiChevronRight size={20} />
                  </div>
                </Button>
                </div>
              ))
            }
            <div className="pt-2">
              <Button disabled={!type} className=" flex flex-1 w-full" size="md" fullSized onClick={onSubmit}>
                Next: Account Info
              </Button>
            </div>
            <div>
              <p>Already have an account? <Link href="/login" className="text-[#0C6291]">Login here</Link></p>
            </div>
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
