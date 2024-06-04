"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeOrdersbyKey, formatToUSD } from "@/utils/commonUtils";
import { BiSolidPackage, BiDotsVerticalRounded } from "react-icons/bi";
import DownloadPDF from "./downloadPDF";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { HiCheck, HiClock } from "react-icons/hi";
import ConfirmationModal from "@/components/confirmation.modal";
import EditOrderModal from "./editOrder.modal";
import { useRouter } from "next/navigation";
import { BsArrowUpShort, BsArrowDownShort, BsPlus } from "react-icons/bs";
import { BiSortDown } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import Loading from "../../(main)/loading";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
type Orginizations = Database["public"]["Tables"]["organizations"]["Row"];

export default function ClientView() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"project_name" | "start_date">("project_name");
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const selectedOrder = useRef<Order | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const router = useRouter();
  const { user, organization, allOrganizations } = useContext(UserContext);
  const [selectedOrginization, setSelectedOrginization] = useState<string>("");
  const currentOrganization = user?.user_organizations?.find((org) => organization?.id === org.organization);

  // useEffect(() => {
  //   if (allOrganizations.length > 0) {
  //     setSelectedOrginization(allOrganizations[0].id);
  //   }
  // }, [allOrganizations]);

  useEffect(() => {
    if (organization) {
      getOrders();
    }
  }, [sortBy, searchInput, organization?.id]);

  useEffect(() => {
    if (orders.length !== 0) {
      getProducts();
    }
  }, [orders]);

  async function getOrders() {
    setTableIsLoading(true);
    let searchOrders = supabase.from("orders").select("*").order(sortBy, { ascending: true });
    if (searchInput) searchOrders.textSearch("project_name", searchInput);
    searchOrders.eq("organization", organization?.id || 0);

    await searchOrders.then(({ data: orders, error }) => {
      if (error) {
        console.error(error);
      }
      if (orders) {
        setOrders(MergeOrdersbyKey(orders, "order_id"));
      }
    });
    setTableIsLoading(false);
  }

  async function getProducts() {
    const orderIds = orders.flatMap((innerArray) => innerArray.map((item) => item.id)).join(",");
    let { data, count } = await supabase
      .from("order_items")
      .select("*")
      .filter("order_id", "in", "(" + orderIds + ")")
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
          <span className="font-normal text-lime-500 text-sm">{formatToUSD(status)}</span>
        </div>
      );
    } else if (status < 0) {
      return (
        <div className="flex-row flex">
          <BsArrowDownShort color="rgb(224 36 36 / var(--tw-text-opacity))" />
          <span className="font-normal text-red-600 text-sm">{formatToUSD(status)}</span>
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
      case "active":
        return (
          <Badge size="xs" color="success" className="justify-center" icon={HiClock}>
            Active
          </Badge>
        );
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
          <Badge size="xs" color="cyan" className="justify-center whitespace-nowrap" icon={BiSolidPackage}>
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
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Active Orders</h5>
        {currentOrganization?.type === "client" && <NewOrderModal showModal={showModal} setShowModal={setShowModal} />}
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="search" value="Search" />
          </div>
          <TextInput placeholder="Project name" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
        </div>
        {/* {allOrganizations.length > 1 && (
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="countries" value="Select your organization" />
            </div>
            <Select id="countries" required onChange={(e) => setSelectedOrginization(e.target.value)}>
              {allOrganizations.map((item: Orginizations) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        )} */}

        <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
          <Dropdown.Header>
            <strong>Sort By</strong>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setSortBy("project_name")}>Project Name</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("start_date")}>Starting Date</Dropdown.Item>
        </Dropdown>
      </div>
      {tableIsLoading ? (
        <div className=" ml-auto mr-auto mt-72 text-center">
          <Spinner size="xl" />
        </div>
      ) : orders.length !== 0 ? (
        <Table striped className="w-full">
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Order ID</Table.HeadCell>
            <Table.HeadCell>Project Name</Table.HeadCell>
            <Table.HeadCell>Starting Date</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            {currentOrganization?.type === "client" && <Table.HeadCell></Table.HeadCell>}
            <Table.HeadCell className="w-1">
              <span className="sr-only">View Order</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {orders.map((order: OrderArray) => (
              <Fragment key={order[0].id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={order[0].id}>
                  <Table.Cell className="p-4 cursor-pointer">
                    {viewHistory === order[0].id ? (
                      <TfiAngleUp size={18} onClick={() => setViewHistory(null)} />
                    ) : (
                      <TfiAngleDown size={18} onClick={() => setViewHistory(order[0].id)} />
                    )}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{order[0].order_id}</Table.Cell>
                  <Table.Cell>{order[0].project_name}</Table.Cell>
                  <Table.Cell>{moment(order[0].start_date).format("MMMM DD, YYYY")}</Table.Cell>
                  <Table.Cell className="truncate">{order[0].address}</Table.Cell>
                  <Table.Cell>
                    <OrderStatus status={order[0].status || ""} />
                  </Table.Cell>
                  <Table.Cell className="w-32">
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                      href={{ pathname: `/order/${encodeURIComponent(order[0].id)}`, query: { orderId: order[0].order_id } }}
                    >
                      <p>{!order[0].change_order ? "View Order" : "View CO"}</p>
                    </Link>
                  </Table.Cell>
                  {currentOrganization?.type === "client" && (
                    <Table.Cell className="">
                      <div className="relative cursor-pointer">
                        <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                          <Dropdown.Item
                            onClick={() => {
                              selectedOrder.current = order[0];
                              setShowEditOrderModal(true);
                            }}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => router.push(`/order/${order[0].id}?orderId=${order[0].order_id}`)}>View</Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setShowDeleteConfirmModal(true);
                              selectedOrder.current = order[0];
                            }}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
                {viewHistory === order[0].id && (
                  <Table.Cell colSpan={8}>
                    <div className="p-4">
                      <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Order history</h5>

                      <Timeline>
                        {[...order].slice(0, 3).map((co, index, array) => (
                          <Timeline.Item key={co.id}>
                            <Timeline.Point />
                            <Timeline.Content>
                              <div className="flex flex-row justify-between">
                                <div>
                                  <Timeline.Time>{moment(co.created_at).format("MMMM DD, YYYY")}</Timeline.Time>
                                  <Timeline.Title>
                                    <a
                                      className="hover:underline cursor-pointer"
                                      onClick={() => router.push(`/order/view/${co.id}?orderId=${co.order_id}`)}
                                    >
                                      {co.order_id + "-" + (order.length - index)}
                                    </a>
                                    <span className="flex flex-row text-sm">
                                      <p className="flex gap-1">
                                        <p>Total:</p>${co.cost}
                                      </p>
                                      <PriceChangeStatus currentItem={co?.cost} previousItem={array[index + 1]?.cost} />
                                    </span>
                                    <p className="text-sm">
                                      {"Items: "}
                                      {products.reduce((count, product) => {
                                        if (product.order_id === co.id) {
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
                      {order.length > 3 && (
                        <div className="flex justify-center items-center">
                          <Link
                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                            href={{
                              pathname: `/order/${encodeURIComponent(order[0].id)}`,
                              query: { orderId: order[0].id, view: "history" },
                            }}
                          >
                            View More
                          </Link>
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                )}
              </Fragment>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="mx-auto my-24">
          <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white text-center">No Results</h5>
          <p className="mb-2 text-sm text-gray-400 dark:text-white text-center">There are currently no orders.</p>
        </div>
      )}
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
