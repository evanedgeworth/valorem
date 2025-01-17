import AuthForm from "./auth-form";
import Image from "next/image";
import Valorem from "../../../../public/auth.png";

export default function Login() {
  return (
    <section className="relative bg-gray-900 text-white min-h-screen">
      <Image
        src={Valorem}
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
        className="z-0"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
        <AuthForm />
      </div>
    </section>
  );
}
