"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeOrdersbyKey, checkPermission, debounce, formatToUSD } from "@/utils/commonUtils";
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
import request from "@/utils/request";
import type { Order, Scope } from "@/types";
import { useQuery } from "@tanstack/react-query";
import OrderHistory from "./orderHistory";

export default function OrderList() {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"projectName" | "createdAt">("createdAt");
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const selectedOrder = useRef<Scope | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<string | null>(null);
  const router = useRouter();
  const { user, selectedOrganization, role } = useContext(UserContext);

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['scopes', searchInput, sortBy],
    queryFn: async () => {
      const res = await request({
        url: `/scope`,
        method: "GET",
        params: {
          organizationId: selectedOrganization?.organizationId,
          includeProperty: true,
          searchInput,
          ascending: true,
          sortBy: sortBy
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId)
  });

  const orders: Scope[] = useMemo(() => {
    return data?.scope ? data?.scope : [];
  }, [data?.scope]);

  async function getOrders() {
    refetch();
  }


  async function handleRemoveOrder() {
    let orderId = selectedOrder.current?.id || "";
    setIsLoadingDelete(true);
    await request({
      url: `/scope/${orderId}`,
      method: "DELETE",
    });
    setIsLoadingDelete(false);

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
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Orders</h5>
        {checkPermission(role, "orders_create") && <NewOrderModal showModal={showModal} setShowModal={setShowModal} />}
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="search" value="Search" />
          </div>
          <TextInput placeholder="Project name" onChange={debounce((e) => setSearchInput(e.target.value))} className="w-60" />
        </div>

        <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
          <Dropdown.Header>
            <strong>Sort By</strong>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setSortBy("projectName")}>Project Name</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("createdAt")}>Starting Date</Dropdown.Item>
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
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell className="w-1">
              <span className="sr-only">View Order</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {orders.map((order: Scope) => (
              <Fragment key={order.id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={order.id}>
                  <Table.Cell className="p-4 cursor-pointer">
                    {viewHistory === order.id ? (
                      <TfiAngleUp size={18} onClick={() => setViewHistory(null)} />
                    ) : (
                      <TfiAngleDown size={18} onClick={() => setViewHistory(order.id)} />
                    )}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{order.id}</Table.Cell>
                  <Table.Cell>{order.projectName}</Table.Cell>
                  <Table.Cell>{moment(order.createdAt).format("MMMM DD, YYYY")}</Table.Cell>
                  <Table.Cell className="truncate">{`${order.property?.address?.address1}${(order.property?.address?.address2 && " " + order.property?.address?.address2) || ""
                    }, ${order.property?.address?.city} ${order.property?.address?.state} ${order.property?.address?.postalCode || ''}`}</Table.Cell>
                  <Table.Cell>
                    <OrderStatus status={order.scopeStatus || ""} />
                  </Table.Cell>
                  <Table.Cell className="w-32">
                    {checkPermission(role, "orders_view") && (
                      <Link
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                        href={{ pathname: `/order/${encodeURIComponent(order.id)}`, query: { orderId: order.id } }}
                      >
                        <p>View Order</p>
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell className="">
                    <div className="relative cursor-pointer">
                      <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                        {checkPermission(role, "orders_update") && (
                          <Dropdown.Item
                            onClick={() => {
                              selectedOrder.current = order;
                              setShowEditOrderModal(true);
                            }}
                          >
                            Edit
                          </Dropdown.Item>
                        )}
                        {checkPermission(role, "orders_view") && (
                          <Dropdown.Item onClick={() => router.push(`/order/${order.id}?orderId=${order.id}`)}>View</Dropdown.Item>
                        )}
                        {checkPermission(role, "orders_delete") && (
                          <Dropdown.Item
                            onClick={() => {
                              setShowDeleteConfirmModal(true);
                              selectedOrder.current = order;
                            }}
                          >
                            Delete
                          </Dropdown.Item>
                        )}
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
                {viewHistory === order.id && (
                  <Table.Cell colSpan={8}>
                    <OrderHistory orderId={order.id} />
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
        isLoading={isLoadingDelete}
      />
      <EditOrderModal showModal={showEditOrderModal} setShowModal={setShowEditOrderModal} order={selectedOrder.current} refresh={getOrders} />
    </section>
  );
}
