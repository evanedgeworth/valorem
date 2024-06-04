"use client";
import { Card, Toast, Table } from "flowbite-react";
import { useState, useRef, useContext, Fragment, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import { useRouter } from "next/navigation";
import { MergeOrdersbyKey } from "@/utils/commonUtils";
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
interface COProduct extends Product {
  status: string;
}

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const router = useRouter();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [tableIsLoading, setTableIsLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    setTableIsLoading(true);
    let searchOrders = supabase.from("orders").select("*").order("created_at", { ascending: true });

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

  return (
    <section className="p-5">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h5 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Add Event</h5>
          <p className="mb-2 text-md text-gray-700 dark:text-white">select the order you would like to schedule an event for.</p>
        </div>
      </div>
      {!tableIsLoading && (
        <Table className="w-full cursor-pointer" hoverable>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Order ID</Table.HeadCell>
            <Table.HeadCell>Project Name</Table.HeadCell>
            <Table.HeadCell>Starting Date</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {orders.map((order) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={order[0].id}
                onClick={() => router.push(`/add-event/${order[0].id}`)}
              >
                <Table.Cell className="p-4 cursor-pointer"></Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{order[0].order_id}</Table.Cell>
                <Table.Cell>{order[0].project_name}</Table.Cell>
                <Table.Cell>{moment(order[0].start_date).format("MMMM DD, YYYY")}</Table.Cell>
                <Table.Cell className="truncate">{order[0].address}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </section>
  );
}
