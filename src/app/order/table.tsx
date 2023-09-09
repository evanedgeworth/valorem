"use client";

import { Timeline, Table, Badge, Dropdown } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
import Link from "next/link";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import DownloadPDF from "./downloadPDF";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { HiCheck, HiClock } from "react-icons/hi";
import ConfirmationModal from "@/components/confirmation.modal";
import EditOrderModal from "./editOrder.modal";
import { useRouter } from "next/navigation";

export default function ContractorView() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
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
    <>
      <Table striped>
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Starting Date</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
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
                    // <BiSolidChevronUp size={25} onClick={() => setViewHistory(null)} />
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
              </Table.Row>
              {viewHistory === item[0].id && (
                <Table.Cell colSpan={8}>
                  <div className="p-4">
                    <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Order history</h5>

                    <Timeline>
                      {[...item].reverse().map((co, index) => (
                        <Timeline.Item key={co.id}>
                          <Timeline.Point />
                          <Timeline.Content>
                            <div className="flex flex-row justify-between">
                              <div>
                                <Timeline.Time>{moment(co.created_at).format("MMMM DD, YYYY")}</Timeline.Time>
                                <Timeline.Title>{co.order_id + "-" + (item.length - index)}</Timeline.Title>
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
    </>
  );
}
