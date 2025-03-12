
"use client";

import { UserOrganization } from "@/types";
import { getFullName, groupBy } from "@/utils/commonUtils";
import { Avatar, Button, Drawer } from "flowbite-react";
import UserRole from "./user-role";
import { IoMdClose } from "react-icons/io";
import UserStatus from "@/components/userStatus";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";

type ViewUserModalProps = {
  open: boolean;
  onClose: () => void;
  userOrganization: UserOrganization | null;
}

export function ViewUserModal({ open, onClose, userOrganization }: ViewUserModalProps) {

  const { data } = useQuery({
    queryKey: ['user-details', userOrganization?.userId],
    queryFn: async () => {
      const res = await request({
        url: `/profiles/${userOrganization?.userId}`,
        params: {
          includeMarkets: true
        },
        method: "GET",
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(userOrganization?.userId) && open
  });

  const markets: string[] = groupBy(data?.markets || [], 'city').map(item => item.key);

  return (
    <>
      <Drawer open={open} onClose={onClose} position="right">
        <Drawer.Items>
          <div className="w-96">
            {
              userOrganization && (
                <div className="p-2 relative">
                  <IoMdClose className="absolute top-1 right-1 cursor-pointer" onClick={onClose} />
                  <div className="flex gap-3 items-center">
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      src={data?.profile?.profileImage?.fileUrl}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xl font-bold">{getFullName(userOrganization.user)}</p>
                      <p className="dark:text-gray-400">{userOrganization.user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Role</p>
                    <div className="flex">
                      <UserRole role={userOrganization.role?.roleName} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Status</p>
                    <div className="flex">
                      <UserStatus status={userOrganization?.user?.status} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Organization Name</p>
                    <p className="dark:text-gray-400">{userOrganization.name || '-'}</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">Markets</p>
                    <p className="dark:text-gray-400">{markets.join(', ')}</p>
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
