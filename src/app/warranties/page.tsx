"use client";

import { Timeline, Table, Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Warranty = Database["public"]["Tables"]["warranties"]["Row"];
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import { AiOutlineCloudDownload, AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidChevronUp, BiSolidChevronDown } from "react-icons/bi";
// import DownloadPDF from "./downloadPDF";
import dynamic from "next/dynamic";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";

const DownloadPDF = dynamic(() => import("./downloadPDF"), {
  ssr: false,
});

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);

  useEffect(() => {
    getWarrenties();
  }, []);

  async function getWarrenties() {
    let { data: warranties, error } = await supabase.from("warranties").select("*").order("created_at");
    if (warranties) {
      setWarranties(warranties);
    }
  }

  function TimeLeft({ start_date, period }: { start_date: string | null; period: number | null }) {
    return moment().to(moment(start_date).add(period, "days"), true);
  }

  return (
    <section className="p-5">
      <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">Warranties</h2>
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
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>
                  <TimeLeft start_date={item.start_date} period={item.period} />
                </Table.Cell>
                <Table.Cell>{item.period + " days"}</Table.Cell>
                <Table.Cell>
                  <Link
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                    href={`/order/${encodeURIComponent(item.id)}`}
                  >
                    <p>View Product</p>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
