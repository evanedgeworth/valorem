"use client";

import { Timeline, Table, Badge, Dropdown } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
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
import { UserContext } from "@/context/userContext";

export default function ClientView() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const selectedOrder = useRef<Order | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const router = useRouter();
  const { user, SignOut } = useContext(UserContext);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orders.length !== 0) {
      getProducts();
    }
  }, [orders]);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*").order("created_at");
    if (orders) {
      setOrders(MergeProductsbyKey(orders, "order_id"));
    }
  }

  async function getProducts() {
    const orderIds = orders.flatMap((innerArray) => innerArray.map((item) => item.id)).join(",");
    let { data, count } = await supabase
      .from("products")
      .select("*")
      .filter("orderId", "in", "(" + orderIds + ")")
      .order("created_at");
    if (data) {
      setProducts(data);
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
    let order_id = selectedOrder.current?.id || "";
    const { error } = await supabase.from("orders").delete().eq("id", order_id);
    setShowDeleteConfirmModal(false);
    getOrders();
  }

  function OrderStatus({ status }: { status: string }) {
    switch (status) {
      case "fulfilled":
        return (
          <Badge size="xs" color="success" className="justify-center" icon={HiCheck}>
            Fulfilled
          </Badge>
        );
      case "approved":
        return (
          <Badge size="xs" color="cyan" className="justify-center whitespace-nowrap" icon={HiClock}>
            Approved
          </Badge>
        );
      case "closed":
        return (
          <Badge size="xs" color="yellow" className="justify-center whitespace-nowrap" icon={HiClock}>
            Closed
          </Badge>
        );
      case "ordered":
        return (
          <Badge size="xs" color="cyan" className="justify-center whitespace-nowrap" icon={HiClock}>
            Ordered
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
        <h5 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{user?.role === "client" ? "Ongoing orders" : "Active Orders"}</h5>
        {user?.role === "client" && <NewOrderModal showModal={showModal} setShowModal={setShowModal} />}
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Starting Date</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          {user?.role === "client" && <Table.HeadCell></Table.HeadCell>}
          <Table.HeadCell className="w-1">
            <span className="sr-only">View Order</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {orders.map((item: OrderArray) => (
            <Fragment key={item[0].id}>
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
                  <OrderStatus status={item[item.length - 1].status || ""} />
                </Table.Cell>
                <Table.Cell className=" w-32">
                  <Link
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                    href={{ pathname: `/order/${encodeURIComponent(item[item.length - 1].id)}`, query: { orderId: item[0].id } }}
                  >
                    <p>{!item[item.length - 1].changeOrder ? "View Order" : "View CO"}</p>
                  </Link>
                </Table.Cell>
                {user?.role === "client" && (
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
                )}
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
                                  <span className="flex flex-row text-sm">
                                    <p className="flex gap-1">
                                      <p>Total:</p>${co.cost}
                                    </p>
                                    <PriceChangeStatus currentItem={co?.cost} previousItem={array[array.length - 1]?.cost} />
                                  </span>
                                  <p className="text-sm">
                                    {"Items: "}
                                    {products.reduce((count, product) => {
                                      if (product.orderId === co.id) {
                                        return count + 1;
                                      }
                                      return count;
                                    }, 0)}
                                  </p>
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
            </Fragment>
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
