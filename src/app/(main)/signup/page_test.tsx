"use client";
import { useState } from "react";
import AuthForm from "./components/account-info";
import CompanyForm from "./components/company-form";
import SignupProgress from "./components/signup-progress";
export default function Login() {
  const [formStep, setFormStep] = useState(0);

  // const handleSignUp = async () => {
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${location.origin}/auth/callback`,
  //       data: {
  //         first_name: firstName,
  //         last_name: lastName,
  //         phone: phone,
  //       },
  //     },
  //   });
  //   if (error) {
  //     alert(error.message);
  //   }
  //   if (data) {
  //     setShowConfirmationModal(true);
  //   }
  //   router.refresh();
  // };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
        {/* <SignupProgress /> */}
        <CompanyForm />
        <AuthForm />
      </div>
    </section>
  );
}
