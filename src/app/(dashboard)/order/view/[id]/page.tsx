"use client";

import { Banner, Button, Spinner } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import moment from "moment";
import NewProductModal from "./components/newProduct.modal";
import ApproveCOModal from "./components/approve.modal";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MdClose, MdDashboard, MdCheck } from "react-icons/md";
import { PiWarningOctagonDuotone } from "react-icons/pi";
import { BiHistory } from "react-icons/bi";
import ConfirmationModal from "@/components/confirmation.modal";
import OrderTimeLine from "./components/timeLine";
import ChangeOrder from "./components/changeOrder";
import ActiveOrder from "./components/activeOrder";
import Warranties from "./components/warranties";
import Settings from "./components/settings";
import History from "./components/history";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
interface COProduct extends Product {
  status: string;
}
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
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
      if (order.change_order) {
        getPreviousOrder();
      }
    }
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
    let resultArray: COProduct[] = [];
    let ProductArray1 = coProducts.current;
    let ProductArray2 = previousProducts.current;

    ProductArray1.forEach((obj1) => {
      const noChange = ProductArray2.find((obj2) => obj2.item_id.description === obj1.item_id.description && obj2.price === obj1.price);
      const updatedPrice = ProductArray2.find((obj2) => obj2.item_id.description === obj1.item_id.description && obj2.price !== obj1.price);
      if (noChange) {
        resultArray.push({ ...noChange, status: "same" });
      } else if (updatedPrice) {
        resultArray.push({ ...updatedPrice, status: "updated" });
      } else {
        resultArray.push({ ...obj1, status: "new" });
      }
    });

    ProductArray2.forEach((obj2) => {
      const foundInResult = resultArray.find((obj) => obj.item_id.description === obj2.item_id.description);
      if (!foundInResult) {
        resultArray.push({ ...obj2, status: "removed" });
      }
    });

    setProducts(resultArray);
  }

  if (order && user)
    return (
      <section className="p-5 w-full">
        <Banner className=" mb-10">
          <div className="flex-col justify-between rounded-lg border border-gray-100 bg-amber-300 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
            <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
              <p className="flex items-center text-sm font-normal text-gray-800 dark:text-gray-400 gap-4">
                <PiWarningOctagonDuotone size={25} /> This page is view only. To modify an existing order go to the orders page.
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center"></div>
          </div>
        </Banner>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order.project_name}</h1>
        <p className="mb-2 text-sm text-gray-900 dark:text-white">
          <b>Date Created: </b>
          {moment(order.created_at).format("MMMM DD, YYYY HH:mm a")}
        </p>
        <p className="mb-2 text-sm text-gray-900 dark:text-white">
          <b>Address: </b>
          {order.address}
        </p>
        {order && <OrderTimeLine order={order} />}

        {productsLoading ? (
          <div className="flex justify-center items-center">
            <Spinner aria-label="Loading" size="xl" />
          </div>
        ) : order.change_order ? (
          <ChangeOrder products={products} />
        ) : (
          <ActiveOrder products={[...products, ...addedProducts]} />
        )}
      </section>
    );
}
