"use client";

import { Timeline, Table, Badge, Dropdown } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import { AiOutlineCloudDownload, AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidChevronUp, BiSolidChevronDown, BiDotsVerticalRounded } from "react-icons/bi";
import DownloadPDF from "./downloadPDF";
import dynamic from "next/dynamic";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { HiCheck, HiClock } from "react-icons/hi";
import ConfirmationModal from "@/components/confirmation.modal";
import EditOrderModal from "./editOrder.modal";
import { useRouter } from "next/navigation";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";

export default function ClientView() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const selectedOrder = useRef<Order | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*").order("created_at");
    if (orders) {
      setOrders(MergeProductsbyKey(orders, "order_id"));
    }
  }

  function PriceChangeStatus({ currentItem, previousItem }: { currentItem: number | null; previousItem: number | null }) {
    let status;
    status = (currentItem || 0) - (previousItem || 0);
    if (status > 0) {
      return (
        <div className="flex-row flex">
          <BsArrowUpShort color="rgb(132 204 22 / var(--tw-text-opacity))" />
          <span className="font-normal text-lime-500 text-sm">{status}</span>
        </div>
      );
    } else if (status < 0) {
      return (
        <div className="flex-row flex">
          <BsArrowDownShort color="rgb(224 36 36 / var(--tw-text-opacity))" />
          <span className="font-normal text-red-600 text-sm">{status}</span>
        </div>
      );
    } else return null;
  }

  async function handleRemoveOrder() {
    let order_id = selectedOrder.current?.id;
    const { error } = await supabase.from("orders").delete().eq("id", order_id);
    setShowDeleteConfirmModal(false);
    getOrders();
  }

  function OrderStatus({ status }: { status: string }) {
    switch (status) {
      case "active":
        return (
          <Badge size="xs" color="success" className="justify-center" icon={HiCheck}>
            Active
          </Badge>
        );
      case "co":
        return (
          <Badge size="xs" color="warning" className="justify-center whitespace-nowrap" icon={HiClock}>
            Change Order
          </Badge>
        );
      default:
        return (
          <Badge size="xs" color="gray" className="justify-center">
            {status}
          </Badge>
        );
    }
  }

  return (
    <section className="p-5">
      <div className="flex justify-between mb-8">
        <h5 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Ongoing orders</h5>
        <NewOrderModal showModal={showModal} setShowModal={setShowModal} />
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Starting Date</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell className="w-1">
            <span className="sr-only">View Order</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {orders.map((item: OrderArray) => (
            <>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item[0].id}>
                <Table.Cell className="p-4 cursor-pointer">
                  {viewHistory === item[0].id ? (
                    <TfiAngleUp size={18} onClick={() => setViewHistory(null)} />
                  ) : (
                    <TfiAngleDown size={18} onClick={() => setViewHistory(item[0].id)} />
                  )}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item[0].order_id}</Table.Cell>
                <Table.Cell>{item[0].project_name}</Table.Cell>
                <Table.Cell>{moment(item[0].created_at).format("MMMM DD, YYYY")}</Table.Cell>
                <Table.Cell className="truncate">{item[0].address}</Table.Cell>
                <Table.Cell>
                  <OrderStatus status={item[0].status || ""} />
                </Table.Cell>
                <Table.Cell className=" w-32">
                  {item[0].status !== "co" ? (
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                      href={`/order/${encodeURIComponent(item[item.length - 1].order_id)}`}
                    >
                      <p>View Order</p>
                    </Link>
                  ) : (
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                      href={{ pathname: `/order/co/${encodeURIComponent(item[item.length - 1].id)}`, query: { orderId: item[0].id } }}
                    >
                      <p>View CO</p>
                    </Link>
                  )}
                </Table.Cell>
                {/* <Table.Cell className="">{item[0].status === "co" && <AiOutlineExclamationCircle size={25} color="red" />}</Table.Cell> */}
                <Table.Cell className="">
                  {/* <BiDotsVerticalRounded size={25} /> */}
                  <div className="relative cursor-pointer">
                    <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                      <Dropdown.Item
                        onClick={() => {
                          selectedOrder.current = item[0];
                          setShowEditOrderModal(true);
                        }}
                      >
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          item[0].status !== "co"
                            ? router.push(`/order/${encodeURIComponent(item[item.length - 1].order_id)}`)
                            : router.push(`/order/co/${encodeURIComponent(item[item.length - 1].id)}?orderId=${item[0].id}`);
                        }}
                      >
                        View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setShowDeleteConfirmModal(true);
                          selectedOrder.current = item[0];
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </Table.Cell>
              </Table.Row>
              {viewHistory === item[0].id && (
                <Table.Cell colSpan={8}>
                  <div className="p-4">
                    <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Order history</h5>

                    <Timeline>
                      {[...item].reverse().map((co, index, array) => (
                        <Timeline.Item key={co.id}>
                          <Timeline.Point />
                          <Timeline.Content>
                            <div className="flex flex-row justify-between">
                              <div>
                                <Timeline.Time>{moment(co.created_at).format("MMMM DD, YYYY")}</Timeline.Time>
                                <Timeline.Title>
                                  {co.order_id + "-" + (item.length - index)}
                                  <p>
                                    <b>| Total</b>
                                  </p>
                                  <PriceChangeStatus currentItem={co?.cost} previousItem={array[array.length - 1]?.cost} />
                                </Timeline.Title>
                              </div>
                              <DownloadPDF orderId={co.id} id={co.id} />
                            </div>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </Table.Cell>
              )}
            </>
          ))}
        </Table.Body>
      </Table>
      <ConfirmationModal
        showModal={showDeleteConfirmModal}
        setShowModal={setShowDeleteConfirmModal}
        title="Delete Order"
        description="Are you sure you would like to remove this order? This action is permanent."
        handleCancel={() => setShowDeleteConfirmModal(false)}
        handleConfirm={handleRemoveOrder}
      />
      <EditOrderModal showModal={showEditOrderModal} setShowModal={setShowEditOrderModal} order={selectedOrder.current} refresh={getOrders} />
    </section>
  );
}
