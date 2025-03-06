import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordChangeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const newPassword = watch("newPassword", "");
  const currentPassword = watch("currentPassword", "");

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    lowercase: false,
    specialChar: false,
    differentFromPrevious: false,
  });

  const validatePassword = (password: string) => {
    setPasswordValidations({
      minLength: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      specialChar: /[!@#?]/.test(password),
      differentFromPrevious: password !== currentPassword,
    });
  };

  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-4">Password</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <Label htmlFor="currentPassword" value="Enter your current password" />
            <TextInput
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              {...register("currentPassword", { required: "Current password is required" })}
              color={errors.currentPassword ? "failure" : "gray"}
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="newPassword" value="Your new password" />
            <TextInput
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 10, message: "At least 10 characters required" },
                validate: {
                  lowercase: (value) => /[a-z]/.test(value) || "Must include at least one lowercase letter",
                  specialChar: (value) => /[!@#?]/.test(value) || "Must include at least one special character (! @ # ?)",
                },
              })}
              onChange={(e) => validatePassword(e.target.value)}
              color={errors.newPassword ? "failure" : "gray"}
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="confirmPassword" value="Confirm new password" />
            <TextInput
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) => value === newPassword || "Passwords do not match",
              })}
              color={errors.confirmPassword ? "failure" : "gray"}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <div>
          <div className="p-4 rounded-xl bg-gray-700">
            <h3>Password requirements:</h3>
            <p className="dark:text-gray-400 text-sm">Ensure that these requirements are met:</p>
            <ul className="mt-3 text-sm space-y-1">
              <li className="text-gray-400 flex gap-2 items-center">
                {passwordValidations.minLength ? <IoCheckmarkCircle size={18} className="text-green-500" /> : <IoCloseCircle size={18} />} At least 10 characters (and up to 100 characters)
              </li>
              <li className="text-gray-400 flex gap-2 items-center">
                {passwordValidations.lowercase ? <IoCheckmarkCircle size={18} className="text-green-500" /> : <IoCloseCircle size={18} />} At least one lowercase character
              </li>
              <li className="text-gray-400 flex gap-2 items-center">
                {passwordValidations.specialChar ? <IoCheckmarkCircle size={18} className="text-green-500" /> : <IoCloseCircle size={18} />} Inclusion of at least one special character (! @ # ?)
              </li>
              <li className="text-gray-400 flex gap-2 items-center">
                {passwordValidations.differentFromPrevious ? <IoCheckmarkCircle size={18} className="text-green-500" /> : <IoCloseCircle size={18} />} Significantly different from your previous passwords
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-t-gray-200 pt-4 dark:border-t-gray-600">
        <Button type="submit" color="gray">
          Save changes
        </Button>
      </div>
    </form>
  );
}
