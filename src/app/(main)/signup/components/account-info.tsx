"use client";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
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
  const router = useRouter();
  const { onHandleNext, setFormData, formData, setStep } = useFormState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch("password");

  const onSubmit = handleSubmit((data) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    if (formData.accountType === "client") {
      setStep(3);
    } else {
      setStep(4);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full place-self-center lg:col-span-6">
      <div className="w-full place-self-center lg:col-span-6">
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Account Info</h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-300">Fill out this form to request access to Valorem.</p>
        <div className="mt-4 space-y-6 sm:mt-6">
          <div className="grid gap-6 sm:grid-rows-2">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-1">
                <Label htmlFor="firstName">First Name *</Label>
                <TextInput id="firstName" {...register("firstName", { required: "First Name is required" })} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className="flex flex-col flex-1">
                <Label htmlFor="lastName">Last Name *</Label>
                <TextInput id="lastName" {...register("lastName", { required: "Last Name is required" })} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-1">
                <Label htmlFor="email">Email Address *</Label>
                <TextInput
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Invalid email format" } })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col flex-1">
                <Label htmlFor="phone">Phone</Label>
                <TextInput id="phone" type="tel" {...register("phone", { minLength: { value: 6, message: "Phone number must be at least 6 characters" }, maxLength: { value: 12, message: "Phone number must be at most 12 characters" } })} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-1">
                <Label htmlFor="password">Password *</Label>
                <TextInput id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div className="flex flex-col flex-1">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
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
                By signing up, you agree to our Terms of Use and Privacy Policy.
              </Label>
            </div>
          </div>
        </div>
        <Button className="w-full mt-8" type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
}
