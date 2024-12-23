"use client";

import { Accordion, Button, Spinner, Dropdown } from "flowbite-react";
import { useState, useEffect, useRef, useContext, useMemo } from "react";
import moment from "moment";
import NewProductModal from "./components/newProduct.modal";
import ApproveCOModal from "./components/approve.modal";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MdClose, MdDashboard, MdCheck, MdOutlineModeEdit } from "react-icons/md";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import ConfirmationModal from "@/components/confirmation.modal";
import OrderTimeLine from "./components/timeLine";
import ActiveOrder from "./components/activeOrder";
import Warranties from "./components/warranties";
import Settings from "./components/settings";
import History from "./components/history";
import { checkPermission, compareArrays, formatToUSD, parseCurrencyToNumber } from "@/utils/commonUtils";

import { calculateTotalPrice } from "@/utils/commonUtils";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Order, Property, Scope, ScopeItem } from "@/types";

export default function OrderDetails({ orderId }: { orderId: string }) {

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', 'detail', orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const res = await request({
        url: `/scope/${orderId}`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    }
  });

  const order = data as Scope;

  const propertyId = order?.property?.id;
  const { data: propertyData } = useQuery({
    queryKey: ['properties', 'detail', propertyId],
    enabled: Boolean(propertyId),
    queryFn: async () => {
      const res = await request({
        url: `/properties/${propertyId}`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
  });

  const property = (propertyData || {}) as Property;

  const [products, setProducts] = useState<ScopeItem[]>([]);
  const [addedProducts, setAddedProducts] = useState<ScopeItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditMenu, setShowEditMenu] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("view") || "details";
  const { user, role } = useContext(UserContext);
  const router = useRouter();

  async function getOrders() {
    refetch();
  }

  async function getProducts() {
    refetch();
  }


  function handleTabChange(selectedTab: string) {
    router.replace(`/order/${orderId}?orderId=${orderId}&view=${selectedTab}`);
  }

  async function createChangeOrder() {
    let orderId: number | null = null;
  }

  const scopeItemRevision = order?.scopeItemRevisions[order.scopeItemRevisions.length - 1];
  const allocatedAmount = useMemo(() => {
    let total = 0;
    scopeItemRevision?.scopeItems?.forEach(item => {
      total += parseCurrencyToNumber(item.targetClientPrice) * item.quantity;
    });
    return total;
  }, [scopeItemRevision]);


  if (isLoading) {
    return (
      <div className="mx-auto mt-10">
        <Spinner />
      </div>
    )
  }
  if (order && user)
    return (
      <section className="p-5 w-full">
        <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("details")}
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-l-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "details"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
              aria-current="page"
            >
              <MdDashboard size={20} />
              Details
            </div>
          </li>
          {/* <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("warranties")}
              className={`flex items-center justify-center gap-3 w-full p-4 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "warranties"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <HiClipboardList size={20} />
              Warranties
            </div>
          </li> */}
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("history")}
              className={`flex items-center justify-center gap-3 w-full p-4 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "history"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <BiHistory size={20} />
              History
            </div>
          </li>
          <li className="w-full cursor-pointer">
            <div
              onClick={() => handleTabChange("settings")}
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:hover:bg-gray-700 ${
                selectedTab === "settings"
                  ? "text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none bg-gray-100"
                  : "dark:bg-gray-800 bg-white"
              }`}
            >
              <HiAdjustments size={20} />
              Settings
            </div>
          </li>
        </ul>
        {selectedTab === "details" && (
          <section className="p-5">
            <div className="flex justify-between">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order.projectName}</h1>
              <Dropdown
                label=""
                placement="left-start"
                renderTrigger={() => (
                  <span className="dark:text-white">
                    <BsThreeDotsVertical size={20} className="cursor-pointer" />
                  </span>
                )}
              >
                <Dropdown.Item onClick={() => setShowEditMenu(!showEditMenu)}>
                  {showEditMenu ? <IoEyeOff size={15} className="mr-2" /> : <IoEye size={15} className="mr-2" />}
                  Edit
                </Dropdown.Item>
              </Dropdown>
            </div>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Date Created: </b>
              {moment(order.createdAt).format("MMMM DD, YYYY hh:mm a")}
            </p>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Address: </b>
              {`${property?.address?.address1}${
                    (property?.address?.address2 && " " + property?.address?.address2) || ""
                  }, ${property?.address?.city} ${property?.address?.state} ${property?.address?.postalCode || ''}`}
            </p>

            <Accordion className=" border-0">
              <Accordion.Panel>
                <Accordion.Title className=" hover:bg-transparent dark:hover:bg-transparent border-0 focus:ring-0 bg-transparent px-0">
                  Details
                </Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-sm text-gray-900 dark:text-white">
                    <strong>Access Instructions:</strong>
                    <br />
                    {property?.accessInstructions}
                  </p>
                  <p className="mb-2 text-sm text-gray-900 dark:text-white">
                    <strong>Allocated Amount: </strong>
                    {formatToUSD(allocatedAmount)}
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>


            {order.scopeStatus !== 'APPROVED' && showEditMenu && (
              <div className="flex justify-end mb-5 gap-4">
                <CSVSelector
                  showModal={showUploadModal}
                  setShowModal={setShowUploadModal}
                  orderId={Number(order.id)}
                  addProduct={(newProduct) => {
                    setAddedProducts([...addedProducts, ...newProduct]), setShowSubmitButton(true);
                  }}
                />
                <Button onClick={() => router.push(`/add-event/${order.id}`)}>+ Add Event</Button>
                <NewProductModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  addProduct={(newProduct) => {
                    setAddedProducts([...addedProducts, newProduct]), setShowSubmitButton(true);
                  }}
                  orderId={Number(order.id)}
                />
                {showSubmitButton && (
                  <Button className="h-fit" onClick={() => setShowSubmitConfirmation(true)}>
                    <MdCheck size={20} />
                    Submit Changes
                  </Button>
                )}
                <ConfirmationModal
                  title="Submit Order?"
                  description="Are you sure you would like to submit updates to this order?"
                  showModal={showSubmitConfirmation}
                  setShowModal={setShowSubmitConfirmation}
                  handleConfirm={createChangeOrder}
                  handleCancel={() => setShowSubmitConfirmation(false)}
                />
              </div>
            )}
            {productsLoading ? (
              <div className="flex justify-center items-center">
                <Spinner aria-label="Loading" size="xl" />
              </div>
            ) : (
              <ActiveOrder
                isEditing={showEditMenu}
                remove={(newProduct) => {
                  let filtered = products.filter((item) => item.id !== newProduct.id);
                  setProducts(filtered);
                  setAddedProducts([...addedProducts, newProduct]);
                  setShowSubmitButton(true);
                }}
                refresh={getProducts}
                products={scopeItemRevision?.scopeItems}
              />
            )}
          </section>
        )}

        {selectedTab === "history" && <History order={order} seeAll />}
        {selectedTab === "settings" && <Settings order={order} refetch={() => refetch()}  />}
      </section>
    );
}
