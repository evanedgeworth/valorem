"use client";

import { Timeline, Table, Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import { AiOutlineCloudDownload, AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidChevronUp, BiSolidChevronDown } from "react-icons/bi";
// import DownloadPDF from "./downloadPDF";
import dynamic from "next/dynamic";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";

const DownloadPDF = dynamic(() => import("./downloadPDF"), {
  ssr: false,
});

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*").order("created_at");
    if (orders) {
      setOrders(MergeProductsbyKey(orders, "order_id"));
    }
  }

  function OrderStatus({ status }: { status: string }) {
    switch (status) {
      case "active":
        return (
          <Badge size="sm" color="success" className="justify-center">
            Active
          </Badge>
        );
      case "co":
        return (
          <Badge size="sm" color="warning" className="justify-center">
            Change Order
          </Badge>
        );
      default:
        return (
          <Badge size="sm" color="gray" className="justify-center">
            {status}
          </Badge>
        );
    }
  }

  return (
    <section className="p-5">
      <div className="flex justify-end mb-5">
        <NewOrderModal showModal={showModal} setShowModal={setShowModal} reload={getOrders} />
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
          <Table.HeadCell>
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
                <Table.Cell>{item[0].address}</Table.Cell>
                <Table.Cell>
                  <OrderStatus status={item[0].status || ""} />
                </Table.Cell>
                <Table.Cell>
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
                <Table.Cell className="p-1">{item[0].status === "co" && <AiOutlineExclamationCircle size={25} color="red" />}</Table.Cell>
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
                              {/* <Button color="light">
                                <AiOutlineCloudDownload size={20} className="mr-2" />
                                Download
                              </Button> */}
                              <DownloadPDF orderId={co.id} id={co.id} />
                            </div>
                            {/* <Timeline.Body>
                              <p>{co.description}</p>
                            </Timeline.Body> */}
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
    </section>
  );
}
