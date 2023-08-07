import AuthForm from "./auth-form";
export default function Login() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
        <AuthForm />
      </div>
    </section>
  );
}
