"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useUserContext } from "@/context/userContext";
import { useForm } from "react-hook-form";
import request from "@/utils/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationRole, Role } from "@/types";
import { useToast } from "@/context/toastContext";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
};

export default function AddUserModal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { showToast } = useToast();
  const { selectedOrganization } = useUserContext();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const roleId = watch("roleId");

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await request({
        url: `/roles`,
        method: "GET",
        params: {
          organizationType: "VALOREM",
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await request({
        url: "/profiles",
        method: "POST",
        data,
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    onSuccess: () => {
      setShowModal(false);
      showToast("Successfully added user", "success");
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });
  const roles: OrganizationRole[] = data?.roles || [];

  async function handleAddUser(formData: Inputs) {
    mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      roleId: formData.roleId,
      organizationType: "VALOREM",
      marketIds: [],
    });
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)} color="gray">
        + Add User
      </Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleAddUser)}>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <TextInput id="firstName" required {...register("firstName")} />
                </div>
                <div className="flex flex-col flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <TextInput id="lastName" required {...register("lastName")} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput id="email" type="email" required {...register("email")} />
              </div>

              <div className="flex flex-col flex-1">
                <Label htmlFor="password">Password</Label>
                <TextInput
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="area">Role</Label>
                <Select id="area" required value={roleId || ""} onChange={(e) => setValue("roleId", e.target.value)}>
                  <option value="" disabled>
                    Select an option...
                  </option>
                  {roles.map((option) => (
                    <option key={option.roleId} value={option.roleId}>
                      {option.roleName}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end">
                <Button type="submit" isProcessing={isPending} color="gray">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
