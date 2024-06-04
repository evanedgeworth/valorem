"use client";

import { Timeline, Table, Badge, Button, Dropdown } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import moment from "moment";
import NewWarrantyModal from "@/app/(dashboard)/warranty/addWarrenty.modal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UserContext } from "@/context/userContext";
import { BiDotsVerticalRounded } from "react-icons/bi";
type Warranty = Database["public"]["Tables"]["warranties"]["Row"];
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type ProductArray = [Product];

export default function Warranties({ products }: { products: Product[] }) {
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
    let productIds = products.map((item) => item.id).join(",");

    let { data: warranties, error } = await supabase
      .from("warranties")
      .select("*")
      .filter("product_id", "in", "(" + productIds + ")");

    if (warranties) {
      setWarranties(warranties);
    }
  }

  function TimeLeft({ start_date, period }: { start_date: string | null; period: number | null }) {
    return moment().to(moment(start_date).add(period, "days"), true);
  }

  return (
    <section className="p-5">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Warranties</h1>
      <div className="flex justify-end mb-8">
        {currentOrganization?.type === "client" && <NewWarrantyModal showModal={showModal} setShowModal={setShowModal} reload={getWarrenties} />}
      </div>
      {warranties.length > 0 ? (
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Order ID</Table.HeadCell>
            <Table.HeadCell>Product Name</Table.HeadCell>
            <Table.HeadCell>Time Left</Table.HeadCell>
            <Table.HeadCell>Warrenty Period</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">View Order</span>
            </Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {warranties.map((item) => (
              <>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
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
                  <Table.Cell className="">
                    {/* <BiDotsVerticalRounded size={25} /> */}
                    <div className="relative cursor-pointer">
                      <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                        <Dropdown.Item>View Warranty</Dropdown.Item>
                        <Dropdown.Item>Request Service</Dropdown.Item>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="mx-auto my-24 text-center">
          <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No products added</h5>
          <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Select 'Add Product' to get started.`}</p>
        </div>
      )}
    </section>
  );
}
