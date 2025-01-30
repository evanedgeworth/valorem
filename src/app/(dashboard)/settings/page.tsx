"use client";
import { useState } from "react";
import Password from "./password";
import Profile from "./profile";
export default function Settings() {
  const [selectedMenu, setSelectedMenu] = useState<"profile" | "password" | "notifications">("profile");

  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8lg:gap-20 lg:py-16">
        <div className="w-full place-self-center lg:col-span-6">
          {selectedMenu === "profile" && <Profile />}
          {selectedMenu === "password" && <Password />}
        </div>
      </div>
    </section>
  );
}
