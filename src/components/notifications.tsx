"use client";
import { Dropdown, Spinner } from "flowbite-react";
import { NotificationIcon } from "./icon";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { Fragment, useEffect, useState } from "react";
import { Notification } from "@/types";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await request({
        url: `/notifications`,
        method: "GET",
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: false
  });

  const notifications: Notification[] = data?.notifications || [];

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  return (
    <Dropdown
      inline
      label=""
      placement="bottom"
      renderTrigger={() => (
        <div>
          <span onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-200">
            <NotificationIcon />
          </span>
        </div>
      )}
      size={"sm"}
    >
      <Dropdown.Header>
        <span className="flex justify-center">Notifications</span>
      </Dropdown.Header>
      {
        notifications.filter(item => item.message.body).map(item => (
          <Fragment key={item.id}>
            <Dropdown.Item>
              {item.message?.body}
            </Dropdown.Item>
            <Dropdown.Divider />
          </Fragment>
        ))
      }
      {
        isLoading && (
          <Dropdown.Item>
            <Spinner />
          </Dropdown.Item>
        )
      }
    </Dropdown>
  );
}