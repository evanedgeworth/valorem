"use client";

import { useFormState, FormProvider } from "./components/formState";
import AuthForm from "./components/account-info";
import CompanyForm from "./components/company-form";
import SignupProgress from "./components/signup-progress";
import Confirmation from "./components/confirmation";
import AccountType from "./components/account-type";
import VerifyEmail from "./components/verifyEmail";

function ActiveStepFormComponent() {
  const { step, formData } = useFormState();
  if (formData?.accountType === "client") {
    switch (step) {
      case 1:
        return <AccountType />;
      case 2:
        return <AuthForm />;
      case 3:
        return <CompanyForm />;
      case 4:
        return <Confirmation />;
      case 5:
        return <VerifyEmail />;
      default:
        return null;
    }
  } else {
    switch (step) {
      case 1:
        return <AccountType />;
      case 2:
        return <AuthForm />;
      case 3:
        return <Confirmation />;
      case 4:
        return <VerifyEmail />;
      default:
        return null;
    }
  }
}

export default function Home() {
  return (
    <FormProvider>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
          <SignupProgress />
          <ActiveStepFormComponent />
        </div>
      </section>
    </FormProvider>
  );
}
