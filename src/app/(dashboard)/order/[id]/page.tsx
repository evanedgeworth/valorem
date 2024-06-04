"use client";

import { Accordion, Button, Spinner, Dropdown } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
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
import ChangeOrder from "./components/changeOrder";
import ActiveOrder from "./components/activeOrder";
import Warranties from "./components/warranties";
import Settings from "./components/settings";
import History from "./components/history";
import { compareArrays, formatToUSD } from "@/utils/commonUtils";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
interface COProduct extends Product {
  status: string;
}
import { calculateTotalPrice } from "@/utils/commonUtils";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditMenu, setShowEditMenu] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const selectedTab = searchParams.get("view") || "details";
  const { user, organization } = useContext(UserContext);
  const router = useRouter();
  const currentOrganization = user?.user_organizations?.find((org) => organization?.id === org.organization);

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  async function getOrders() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", params.id).single();
    if (order) {
      setOrder(order);
      if (order.change_order) {
        getPreviousOrder();
      }
    }
    if (error) alert(error.message);
  }

  async function getProducts() {
    setProductsLoading(true);
    let { data: products, error } = await supabase.from("order_items").select("*, item_id!inner(*)").eq("order_id", params.id).returns<Product[]>();
    if (products) {
      setProducts(products);
      coProducts.current = products;
      setProductsLoading(false);
    }
  }

  async function getPreviousOrder() {
    let { data: order, error } = await supabase
      .from("orders")
      .select("id")
      .eq("order_id", orderId)
      .neq("id", params.id)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (order) {
      getPreviousProducts(order.id);
    }
    if (error) alert(error.message);
  }

  async function getPreviousProducts(id: number) {
    let { data: products, error } = await supabase.from("order_items").select("*, item_id!inner(*)").eq("order_id", id);
    if (products) {
      previousProducts.current = products;
      getChangeOrder();
    }
  }

  function handleTabChange(selectedTab: string) {
    router.push(`/order/${params.id}?orderId=${order?.order_id}&view=${selectedTab}`);
  }

  function getChangeOrder() {
    let currentProducts = coProducts.current;

    let resultArray = compareArrays(previousProducts.current, currentProducts);
    // console.log("RESULTS", resultArray, "PREV", previousProducts.current, "CURRENT", currentProducts);
    setProducts(resultArray);
  }

  async function createChangeOrder() {
    let orderId: number | null = null;
    let allProducts: any[] = [...products, ...addedProducts];

    let totalCost = calculateTotalPrice(allProducts, "price");

    if (order?.id !== order?.order_id || products.length > 0) {
      type OrderWithoutId = Omit<Order, "id">;
      const { id, created_at, ...newOrder }: any = order;
      const { data: orderSuccess, error } = await supabase
        .from("orders")
        .insert([
          {
            ...newOrder,
            change_order: true,
            cost: totalCost,
          },
        ])
        .select()
        .limit(1)
        .single();
      if (orderSuccess) {
        orderId = orderSuccess.id;
      }
      if (error) {
        alert(error.message);
      }
    } else {
      orderId = +params.id;
    }

    let allProductsUpdatedId = allProducts
      .filter((item) => item.status !== "removed")
      .map((item) => {
        const { status, id, created_at, ...updatedProduct } = item;
        return { ...updatedProduct, order_id: orderId, item_id: item.item_id.id };
      });

    const { data, error } = await supabase.from("order_items").insert(allProductsUpdatedId).select();
    if (error) {
      alert(error.message);
    }
    if (data) {
      router.push(`/order/${orderId}?orderId=${params.id}`);
    }
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
          <li className="w-full cursor-pointer">
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
          </li>
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
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order.project_name}</h1>
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
              {moment(order.created_at).format("MMMM DD, YYYY hh:mm a")}
            </p>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Address: </b>
              {order.address}
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
                    {order.access_instructions}
                  </p>
                  <p className="mb-2 text-sm text-gray-900 dark:text-white">
                    <strong>Allocated Amount: </strong>
                    {formatToUSD(calculateTotalPrice(products, "retail_price"))}
                  </p>
                  <p className="mb-2 text-sm text-gray-900 dark:text-white">
                    <strong>Aquired Amount: </strong>
                    {formatToUSD(calculateTotalPrice(products, "price"))}
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>

            {currentOrganization?.type === "client" && order?.change_order && (
              <div className="flex flex-row justify-end gap-4 mt-4">
                <Button outline color="red" className="h-fit">
                  <MdClose size={20} />
                  Deny Changes
                </Button>
                <ApproveCOModal showModal={showApproveModal} setShowModal={setShowApproveModal} reload={getOrders} id={Number(params.id)} />
              </div>
            )}
            {order && <OrderTimeLine order={order} />}

            {!order.change_order && showEditMenu && (
              <div className="flex justify-end mb-5 gap-4">
                <CSVSelector
                  showModal={showUploadModal}
                  setShowModal={setShowUploadModal}
                  orderId={Number(params.id)}
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
                  orderId={Number(params.id)}
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
            ) : order.change_order ? (
              // <ChangeOrder products={products} />
              <ActiveOrder
                isEditing={showEditMenu}
                products={[...products, ...addedProducts]}
                remove={(newProduct) => {
                  let filtered = products.filter((item) => item.id !== newProduct.id);
                  setProducts(filtered);
                  setAddedProducts([...addedProducts, newProduct]);
                  setShowSubmitButton(true);
                }}
              />
            ) : (
              <ActiveOrder
                isEditing={showEditMenu}
                products={[...products, ...addedProducts]}
                remove={(newProduct) => {
                  let filtered = products.filter((item) => item.id !== newProduct.id);
                  setProducts(filtered);
                  setAddedProducts([...addedProducts, newProduct]);
                  setShowSubmitButton(true);
                }}
              />
            )}
          </section>
        )}

        {selectedTab === "warranties" && <Warranties products={products} />}
        {selectedTab === "history" && <History order={order} />}
        {selectedTab === "settings" && <Settings order={order} />}
      </section>
    );
}
