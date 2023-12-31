"use client";

import { Button, Card, Toast, Table, Tabs } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import NewProductModal from "./components/newProduct.modal";
import { MergeProductsbyKey, numberWithCommas } from "@/utils/commonUtils";
import ApproveCOModal from "./components/approve.modal";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MdClose, MdDashboard } from "react-icons/md";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { BiHistory } from "react-icons/bi";
import OrderTimeLine from "./components/timeLine";
import ChangeOrder from "./components/changeOrder";
import ActiveOrder from "./components/activeOrder";
import Warranties from "./components/warranties";
import Settings from "./components/settings";
import History from "./components/history";
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];
interface COProduct extends Product {
  status: string;
}
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<ProductArray[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const selectedTab = searchParams.get("view") || "details";
  const { user, SignOut } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  async function getOrders() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", params.id).single();
    if (order) {
      setOrder(order);
      if (order.changeOrder) {
        getPreviousOrder();
      }
    }
  }

  async function getProducts() {
    let { data: products, error } = await supabase.from("products").select("*").eq("orderId", params.id);
    if (products) {
      setProducts(MergeProductsbyKey(products, "type"));
      coProducts.current = products;
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
    let { data: products, error } = await supabase.from("products").select("*").eq("orderId", id);
    if (products) {
      previousProducts.current = products;
      getChangeOrder();
    }
  }

  function handleTabChange(selectedTab: string) {
    router.push(`/order/9?orderId=1&view=${selectedTab}`);
  }

  function getChangeOrder() {
    let resultArray: COProduct[] = [];
    let ProductArray1 = coProducts.current;
    let ProductArray2 = previousProducts.current;

    ProductArray1.forEach((obj1) => {
      const noChange = ProductArray2.find((obj2) => obj2.description === obj1.description && obj2.price === obj1.price);
      const updatedPrice = ProductArray2.find((obj2) => obj2.description === obj1.description && obj2.price !== obj1.price);
      if (noChange) {
        resultArray.push({ ...noChange, status: "same" });
      } else if (updatedPrice) {
        resultArray.push({ ...updatedPrice, status: "updated" });
      } else {
        resultArray.push({ ...obj1, status: "new" });
      }
    });

    ProductArray2.forEach((obj2) => {
      const foundInResult = resultArray.find((obj) => obj.description === obj2.description);
      if (!foundInResult) {
        resultArray.push({ ...obj2, status: "removed" });
      }
    });

    setProducts(MergeProductsbyKey(resultArray, "type"));
  }

  if (order && user)
    return (
      <section className="p-5">
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
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order.project_name}</h1>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Date Created: </b>
              {moment(order.created_at).format("MMMM DD, YYYY HH:mm a")}
            </p>
            <p className="mb-2 text-sm text-gray-900 dark:text-white">
              <b>Address: </b>
              {order.address}
            </p>
            {user.role !== "contractor" && order?.changeOrder && (
              <div className="flex flex-row justify-end gap-4 mt-4">
                <Button outline color="red" className="h-fit">
                  <MdClose size={20} />
                  Deny Changes
                </Button>
                <ApproveCOModal showModal={showApproveModal} setShowModal={setShowApproveModal} reload={getOrders} id={Number(params.id)} />
              </div>
            )}
            {order && <OrderTimeLine order={order} />}

            {!order.changeOrder && (
              <div className="flex justify-end mb-5 gap-4">
                <CSVSelector
                  showModal={showUploadModal}
                  setShowModal={setShowUploadModal}
                  orderId={Number(params.id)}
                  handleCancel={() => setShowUploadModal(false)}
                  handleConfirm={() => {
                    setShowUploadModal(false);
                    getProducts();
                  }}
                />
                <NewProductModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  reload={() => {
                    getProducts(), setShowToast(true);
                  }}
                  orderId={Number(params.id)}
                />
              </div>
            )}
            {order.changeOrder ? <ChangeOrder products={products} /> : <ActiveOrder products={products} />}
          </section>
        )}

        {selectedTab === "warranties" && <Warranties products={products} />}
        {selectedTab === "history" && <History order={order} />}
        {selectedTab === "settings" && <Settings order={order} />}
      </section>
    );
}
