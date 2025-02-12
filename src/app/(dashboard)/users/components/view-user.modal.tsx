
"use client";

import { UserOrganization } from "@/types";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer } from "flowbite-react";

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

  console.log('=======', data);

  return (
    <>
      <Drawer open={open} onClose={onClose} position="right">

        <Drawer.Items>
          <div className="w-96">

          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
