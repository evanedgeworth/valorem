
"use client";

import { UserOrganization } from "@/types";
import { getFullName } from "@/utils/commonUtils";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer } from "flowbite-react";
import UserRole from "./user-role";
import { IoMdClose } from "react-icons/io";

type ViewUserModalProps = {
  open: boolean;
  onClose: () => void;
  userOrganization: UserOrganization | null;
}

export function ViewUserModal({ open, onClose, userOrganization }: ViewUserModalProps) {

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-details', userOrganization?.userId],
    queryFn: async () => {
      const res = await request({
        url: `/profiles/${userOrganization?.userId}`,
        method: "GET",
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(userOrganization?.userId)
  });


  return (
    <>
      <Drawer open={open} onClose={onClose} position="right">

        <Drawer.Items>
          <div className="w-96">
            {
              userOrganization && (
                <div className="p-2 relative">
                  <IoMdClose className="absolute top-1 right-1 cursor-pointer" onClick={onClose} />
                  <div>
                    <p className="text-xl font-bold">{getFullName(userOrganization.user)}</p>
                    <p className="dark:text-gray-400">{userOrganization.user?.email}</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Role</p>
                    <div className="flex">
                      <UserRole role={userOrganization.role?.roleName} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Organization Name</p>
                    <p className="dark:text-gray-400">{userOrganization.name}</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Phone Number</p>
                    <p className="dark:text-gray-400">{userOrganization.user?.phone}</p>
                  </div>
                </div>
              )
            }
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
