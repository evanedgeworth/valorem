"use client";
// import AuthForm from "./auth-form";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../types/supabase";
import Profile from "./profile";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<"profile" | "settings" | "notifications">("profile");
  const [companyAddress, setCompanyAddress] = useState("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

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
      console.log("DATA", data);
    }
    router.refresh();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
        <div className="w-full place-self-center lg:col-span-6">
          <div className="flex mb-6">
            <Button.Group className="mx-auto">
              <Button onClick={() => setSelectedMenu("profile")} color={selectedMenu === "profile" ? "info" : "gray"}>
                Profile
              </Button>
              <Button onClick={() => setSelectedMenu("settings")} color={selectedMenu === "settings" ? "info" : "gray"}>
                Settings
              </Button>
              <Button onClick={() => setSelectedMenu("notifications")} color={selectedMenu === "notifications" ? "info" : "gray"}>
                Notifications
              </Button>
            </Button.Group>
          </div>
          {selectedMenu === "profile" && <Profile />}
        </div>
      </div>
    </section>
  );
}
