"use client";

import { Card, Button, Table } from "flowbite-react";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import { useSearchParams } from "next/navigation";
import { BiCheck } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import ApproveCOModal from "./approve.modal";
import { UserContext } from "@/context/userContext";
type Product = Database["public"]["Tables"]["products"]["Row"];
interface COProduct extends Product {
  status: string;
}
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];

export default function ChangeOrder({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<Product[]>([]);
  const coProducts = useRef<any[]>([]);
  const previousProducts = useRef<any[]>([]);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { user, SignOut } = useContext(UserContext);

  useEffect(() => {
    getProducts();
    getPreviousOrder();
    getOrder();
  }, []);

  async function getOrder() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (order) {
      setOrder(order);
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

  async function getProducts() {
    let { data: products, error } = await supabase.from("products").select("*").eq("orderId", params.id);
    if (products) {
      coProducts.current = products;
    }
  }

  function getChangeOrder() {
    let resultArray: COProduct[] = [];
    let ProductArray1 = coProducts.current;
    let ProductArray2 = previousProducts.current;

    ProductArray1.forEach((obj1) => {
      const noChange = ProductArray2.find((obj2) => obj2.name === obj1.name && obj2.price === obj1.price);
      const updatedPrice = ProductArray2.find((obj2) => obj2.name === obj1.name && obj2.price !== obj1.price);
      if (noChange) {
        resultArray.push({ ...noChange, status: "same" });
      } else if (updatedPrice) {
        resultArray.push({ ...updatedPrice, status: "updated" });
      } else {
        resultArray.push({ ...obj1, status: "new" });
      }
    });

    ProductArray2.forEach((obj2) => {
      const foundInResult = resultArray.find((obj) => obj.name === obj2.name);
      if (!foundInResult) {
        resultArray.push({ ...obj2, status: "removed" });
      }
    });
    setProducts(MergeProductsbyKey(resultArray, "type"));
  }

  return (
    <section className="p-5">
      <div className="flex justify-between">
        <div>
          <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Change Order</h5>
          <p className="mb-2 text-sm text-gray-900 dark:text-white">
            <b>Order: </b>
            {order?.project_name}
          </p>
          <p className="mb-2 text-sm text-gray-900 dark:text-white">
            <b>Date Created: </b>
            {moment(order?.created_at).format("MMMM DD, YYYY HH:mm a")}
          </p>
          <p className="mb-2 text-sm text-gray-900 dark:text-white">
            <b>Address: </b>
            {order?.address}
          </p>
        </div>
        {user?.role !== "contractor" && (
          <div className="flex flex-row justify-end gap-4 mt-4">
            <Button outline color="red">
              <MdClose size={20} />
              Deny Changes
            </Button>
            <ApproveCOModal showModal={showApproveModal} setShowModal={setShowApproveModal} reload={() => ""} id={params.id} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {products.map((item: any) => (
          <Card key={item[0].id} className="overflow-x-auto">
            <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].type}</h5>
            <Table>
              <Table.Head>
                <Table.HeadCell>Product name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Qty</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Total Price</Table.HeadCell>
              </Table.Head>
              {item.map((product: COProduct) => (
                <Table.Body className="divide-y" key={product.id}>
                  <Table.Row
                    className={
                      `dark:border-gray-700 dark:bg-gray-800 ` +
                      ((product.status === "updated" && ` bg-amber-200 dark:bg-amber-800`) ||
                        (product.status === "removed" && ` bg-red-200 dark:bg-red-800`))
                    }
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white max-w-xs">{product.name}</Table.Cell>
                    <Table.Cell className="max-w-xs">{product.description}</Table.Cell>
                    <Table.Cell>{product.quantity}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>{Math.floor(product.price * product.quantity)}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </Card>
        ))}
      </div>
    </section>
  );
}
