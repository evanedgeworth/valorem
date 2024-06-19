"use server";
import request from "@/utils/request";
import { Button, Spinner, Dropdown, Accordion, AccordionPanel, AccordionTitle, AccordionContent } from "flowbite-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import OrderTimeLine from "./components/timeLine";
import OrderPage from "./order-page";
import { MdClose, MdDashboard, MdCheck, MdOutlineModeEdit } from "react-icons/md";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { useRouter, useSearchParams } from "next/navigation";
import { BiHistory } from "react-icons/bi";

async function getOrder(orderId: string) {
  const response = await request({
    url: `/order/${orderId}`,
    method: "GET",
  });

  return response.data;
}

export default async function Page({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  return <OrderPage order={order} />;
}
