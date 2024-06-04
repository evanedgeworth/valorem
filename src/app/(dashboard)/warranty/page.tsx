"use client";

import { Timeline, Table, Badge, Button } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Warranty = Database["public"]["Tables"]["warranties"]["Row"];
// type Warranty = Database["public"]["Tables"]["warranties"]["Row"] & { order_id: { address?: string } };
import NewWarrantyModal from "./addWarrenty.modal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UserContext } from "@/context/userContext";

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const { user, organization } = useContext(UserContext);
  const currentOrganization = user?.user_organizations?.find((org) => organization?.id === org.organization);

  useEffect(() => {
    getWarrenties();
  }, []);

  async function getWarrenties() {
    let { data: warranties, error } = await supabase.from("warranties").select("*, order_id(address)").order("created_at");
    if (warranties) {
      setWarranties(warranties);
    }
  }

  function TimeLeft({ start_date, period }: { start_date: string | null; period: number | null }) {
    return moment().to(moment(start_date).add(period, "days"), true);
  }

  return (
    <section className="p-5">
      <div className="flex justify-between mb-8">
        <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">Warranties</h2>
        {currentOrganization?.type === "client" && <NewWarrantyModal showModal={showModal} setShowModal={setShowModal} reload={getWarrenties} />}
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Product Name</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Time Left</Table.HeadCell>
          <Table.HeadCell>Warrenty Period</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">View Order</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {warranties.map((item) => (
            <>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                {/* <Table.Cell>{item.order_id?.address}</Table.Cell> */}
                <Table.Cell>
                  <TimeLeft start_date={item.start_date} period={item.period} />
                </Table.Cell>
                <Table.Cell>{item.period + " days"}</Table.Cell>
                <Table.Cell>
                  {item.link && (
                    <a
                      target="_blank"
                      href={item.link || ""}
                      rel="noopener noreferrer"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                    >
                      <p>View Warranty</p>
                    </a>
                  )}
                </Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
