import AuthForm from "./auth-form";
import Image from "next/image";

export default function Login() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-20 lg:py-16">
        <AuthForm />
        <div className="mr-auto place-self-center lg:col-span-6">
          <img
            className="mx-auto hidden lg:flex"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
            alt="illustration"
          />
        </div>
      </div>
    </section>
  );
}
