"use client";
// import AuthForm from "./auth-form";
import { Button, Checkbox, Label, TextInput, Select } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { Database } from "../../../../types/supabase";
import { UserContext } from "@/context/userContext";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { user, SignOut } = useContext(UserContext);

  useEffect(() => {
    setEmail(user?.email || "");
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleSubmitChanges = async () => {
    setIsloading(true);
    const { data, error } = await supabase.auth.updateUser(
      {
        email: email,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
      { emailRedirectTo: `${location.origin}/auth/callback` }
    );
    if (error) {
      alert(error.message);
    }
    if (data) {
      updateProfile();
      console.log(data);
    }
  };

  async function updateProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .update({ email: email, first_name: firstName, last_name: lastName, phone: phone })
      .eq("id", user?.id || "")
      .select();
    if (data) {
      router.refresh();
    }
    setIsloading(false);
  }

  return (
    <div className="mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
      <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Account Info</h1>
      <p className="text-sm font-light text-gray-500 dark:text-gray-300">Make changes to your account here.</p>
      <div className="mt-4 space-y-6 sm:mt-6">
        <div className="grid gap-6 sm:grid-rows-2">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="email">First Name</Label>
              <TextInput id="first name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="email">Last Name</Label>
              <TextInput id="last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" placeholder="name@company.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <TextInput id="phone" required value={phone} type="phone" onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <Button className="w-full" onClick={handleSubmitChanges} isProcessing={isLoading}>
          {!isLoading && "Submit Changes"}
        </Button>
      </div>
    </div>
  );
}
