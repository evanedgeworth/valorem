"use client";
// import AuthForm from "./auth-form";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../../../types/supabase";
import Password from "./password";
import Profile from "./profile";
export default function Settings() {
  const [selectedMenu, setSelectedMenu] = useState<"profile" | "password" | "notifications">("profile");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
        <div className="w-full place-self-center lg:col-span-6">
          <div className="flex mb-6">
            <Button.Group className="mx-auto">
              <Button onClick={() => setSelectedMenu("profile")} color={selectedMenu === "profile" ? "info" : "gray"}>
                Profile
              </Button>
              <Button onClick={() => setSelectedMenu("password")} color={selectedMenu === "password" ? "info" : "gray"}>
                Password
              </Button>
              <Button onClick={() => setSelectedMenu("notifications")} color={selectedMenu === "notifications" ? "info" : "gray"}>
                Notifications
              </Button>
            </Button.Group>
          </div>
          {selectedMenu === "profile" && <Profile />}
          {selectedMenu === "password" && <Password />}
        </div>
      </div>
    </section>
  );
}
