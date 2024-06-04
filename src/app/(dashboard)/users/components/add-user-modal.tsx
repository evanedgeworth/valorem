"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Datepicker, Radio } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];
type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function AddUserModal({ reloadTable }: { reloadTable: () => Promise<void> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [type, setType] = useState<"client" | "supplier" | "vendor">("client");
  const [role, setRole] = useState<"admin" | "billing" | "viewer">("admin");
  const router = useRouter();
  const { user, organization } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  async function handleAddUser(data: Inputs) {
    setIsSending(true);
    try {
      let response = await fetch("/api/send-invite-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });
      let resendResponse = await response.json();
      await supabase
        .from("user_organizations")
        .insert([{ user: resendResponse.id, organization: organization?.id, type: type, role: type === "client" ? role : "viewer" }])
        .select();
      await reloadTable();
      setShowModal(false);
    } catch (e) {
      console.log(e);
    }
    setIsSending(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add User</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleAddUser)}>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">First Name</Label>
                  <TextInput id="first name" required {...register("firstName")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="email">Last Name</Label>
                  <TextInput id="last name" required {...register("lastName")} />
                </div>
              </div>
              <div>
                <Label htmlFor="countries">Email</Label>
                <TextInput id="email" type="email" required {...register("email")} />
              </div>
              <div>
                <Label htmlFor="countries">Role</Label>
                <Button.Group id="type" className="w-full">
                  <Button color={type === "client" ? undefined : "gray"} fullSized value="client" target="client" onClick={() => setType("client")}>
                    Client
                  </Button>
                  <Button color={type === "supplier" ? undefined : "gray"} fullSized value="supplier" onClick={() => setType("supplier")}>
                    Supplier
                  </Button>
                  <Button color={type === "vendor" ? undefined : "gray"} fullSized value="vendor" onClick={() => setType("vendor")}>
                    Vendor
                  </Button>
                </Button.Group>
              </div>
              {type === "client" && (
                <div>
                  <Label htmlFor="countries">Access</Label>
                  <Button.Group id="type" className="w-full">
                    <Button color={role === "admin" ? undefined : "gray"} fullSized value="admin" target="client" onClick={() => setRole("admin")}>
                      Admin
                    </Button>
                    <Button color={role === "billing" ? undefined : "gray"} fullSized value="billing" onClick={() => setRole("billing")}>
                      Billing
                    </Button>
                    <Button color={role === "viewer" ? undefined : "gray"} fullSized value="viewer" onClick={() => setRole("viewer")}>
                      Viewer
                    </Button>
                  </Button.Group>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" isProcessing={isSending}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
