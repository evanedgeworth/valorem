"use client";

import { Accordion, Button, Spinner, Dropdown, Card, Timeline } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";

import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { HiAdjustments, HiArrowNarrowRight, HiCalendar, HiClipboardList, HiUserCircle } from "react-icons/hi";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
  // order_item_assignment: { user: { first_name: string; last_name: string }[] };
};
type Property = Database["public"]["Tables"]["properties"]["Row"];
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  properties: Property;
};
interface COProduct extends Product {
  status: string;
}
import { calculateTotalPrice } from "@/utils/commonUtils";
import { useSearchParams } from "next/navigation";
import CSVSelector from "@/components/csvSelector";
import ProductsTable from "./components/products-table";

// https://5hch5ftc93.execute-api.us-west-2.amazonaws.com/prod/orders/97

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [invoice, setInvoice] = useState<Invoice>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showEditMenu, setShowEditMenu] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const { user, selectedOrganization } = useContext(UserContext);

  useEffect(() => {
    // getProducts();
    // getOrder();
    getInvoice();
  }, []);

  async function getInvoice() {
    let { data: invoiceData, error } = await supabase.from("invoices").select("*").eq("id", params.id).single();
    if (invoiceData) {
      setInvoice(invoiceData);
      if (invoiceData.order) {
        await getOrder(invoiceData.order);
        await getProducts(invoiceData.order);
      }
    }
    if (error) alert(error.message);
  }

  async function getOrder(orderId: number) {
    let { data: order, error } = await supabase.from("orders").select("*, properties(*)").eq("id", orderId).returns<Order>();
    if (order) {
      setOrder(order);
    }
    if (error) alert(error.message);
  }

  async function getProducts(orderId: number) {
    setProductsLoading(true);
    let { data: products, error } = await supabase
      .from("order_items")
      .select("*, item_id!inner(*), order_item_assignments(id,user(id,first_name,last_name))")
      .eq("order_id", orderId)
      .returns<Product[]>();
    if (products) {
      setProducts(products);
      coProducts.current = products;
      setProductsLoading(false);
    }
  }

  if (order && user)
    return (
      <section className="p-5 w-full">
        <div className="container m-auto grid grid-cols-3 gap-4 h-full">
          <Card className="col-span-3 md:col-span-2 lg:col-span-2 justify-start flex max-h-[calc(100vh-(67px+1.25rem))]">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Date: {moment(invoice?.created_at).format("MM/DD/YYYY")}</h1>
            <div className="overflow-scroll flex-1">
              <ProductsTable products={products} />
            </div>
          </Card>
          <Card className="col-span-3 md:col-span-1 lg:col-span-1">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Invoice: #{invoice?.id}</h1>
            <div className="flex-1">
              <Timeline>
                <Timeline.Item>
                  <Timeline.Point icon={HiCalendar} />
                  <Timeline.Content>
                    <Timeline.Time>February 2022</Timeline.Time>
                    <Timeline.Body>Invoice Created</Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                  <Timeline.Point icon={HiCalendar} />
                  <Timeline.Content>
                    <Timeline.Time>March 2022</Timeline.Time>
                    <Timeline.Body>Project Started</Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              </Timeline>
            </div>
            <Button color="gray">Pay now</Button>
          </Card>
        </div>
      </section>
    );
}
