"use client";

import { Card, Button, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
import NewProductModal from "./newProduct.modal";
import { MergeProductsbyKey } from "@/utils/commonUtils";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  async function getOrders() {
    let { data: order, error } = await supabase.from("orders").select("*").eq("id", params.id).single();
    if (order) {
      setOrder(order);
    }
  }

  async function getProducts() {
    let { data: products, error } = await supabase.from("order_items").select("*").eq("order_id", params.id).returns<Product[]>();
    if (products) {
      setProducts(MergeProductsbyKey(products, "room"));
    }
  }

  return (
    <section className="p-5">
      <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{order?.project_name}</h5>
      <p className="mb-2 text-sm text-gray-900 dark:text-white">
        <b>Date Created: </b>
        {moment(order?.created_at).format("MMMM DD, YYYY HH:mm a")}
      </p>
      <p className="mb-2 text-sm text-gray-900 dark:text-white">
        <b>Address: </b>
        {order?.address}
      </p>
      <div className="flex justify-end mb-5">
        <NewProductModal showModal={showModal} setShowModal={setShowModal} reload={getProducts} orderId={Number(params.id)} />
      </div>
      <div className="flex flex-col gap-4">
        {products.map((item: ProductArray) => (
          <Card key={item[0].id} className="overflow-x-auto">
            <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].room}</h5>
            <Table>
              <Table.Head>
                {/* <Table.HeadCell>Product name</Table.HeadCell> */}
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Qty</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Total Price</Table.HeadCell>
              </Table.Head>
              {item.map((product: Product) => (
                <Table.Body className="divide-y" key={product.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    {/* <Table.Cell className="font-medium text-gray-900 dark:text-white">{product.name}</Table.Cell> */}
                    <Table.Cell>{product.item_id.description}</Table.Cell>
                    <Table.Cell>{product.quantity}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>{Math.floor(product.price || 0 * product.quantity)}</Table.Cell>
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
