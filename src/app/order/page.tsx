"use client";

import { Button, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*");
    if (orders) {
      setOrders(orders);
    }
  }

  return (
    <section className=" p-5">
      <div className="flex justify-end mb-5">
        <NewOrderModal showModal={showModal} setShowModal={setShowModal} reload={getOrders} />
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Starting Date</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">View Order</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {orders.map((item: Order) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item.id}</Table.Cell>
              <Table.Cell>{item.project_name}</Table.Cell>
              <Table.Cell>{moment(item.created_at).format("MMMM DD, YYYY")}</Table.Cell>
              <Table.Cell>{item.address}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                <Link className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" href={`/order/${encodeURIComponent(item.id)}`}>
                  <p>View Order</p>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
