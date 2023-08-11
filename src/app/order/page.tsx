"use client";

import { Timeline, Table, Badge } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
import NewOrderModal from "./newOrder.modal";
import Link from "next/link";
import { MergeProductsbyKey } from "@/utils/commonUtils";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidChevronUp, BiSolidChevronDown } from "react-icons/bi";

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<OrderArray[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*").order("created_at");
    if (orders) {
      setOrders(MergeProductsbyKey(orders, "order_id"));
    }
  }

  function OrderStatus({ status }: { status: string }) {
    switch (status) {
      case "active":
        return (
          <Badge size="sm" color="success" className="justify-center">
            Active
          </Badge>
        );
      case "co":
        return (
          <Badge size="sm" color="warning" className="justify-center">
            Change Order
          </Badge>
        );
      default:
        return (
          <Badge size="sm" color="gray" className="justify-center">
            {status}
          </Badge>
        );
    }
  }

  return (
    <section className="p-5">
      <div className="flex justify-end mb-5">
        <NewOrderModal showModal={showModal} setShowModal={setShowModal} reload={getOrders} />
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Project Name</Table.HeadCell>
          <Table.HeadCell>Starting Date</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">View Order</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {orders.map((item: OrderArray) => (
            <>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item[0].id}>
                <Table.Cell className="p-1 cursor-pointer">
                  {viewHistory === item[0].id ? (
                    <BiSolidChevronUp size={25} onClick={() => setViewHistory(null)} />
                  ) : (
                    <BiSolidChevronDown size={25} onClick={() => setViewHistory(item[0].id)} />
                  )}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item[0].order_id}</Table.Cell>
                <Table.Cell>{item[0].project_name}</Table.Cell>
                <Table.Cell>{moment(item[0].created_at).format("MMMM DD, YYYY")}</Table.Cell>
                <Table.Cell>{item[0].address}</Table.Cell>
                <Table.Cell>
                  <OrderStatus status={item[0].status || ""} />
                </Table.Cell>
                <Table.Cell>
                  {item[0].status !== "co" ? (
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                      href={`/order/${encodeURIComponent(item[item.length - 1].id)}`}
                    >
                      <p>View Order</p>
                    </Link>
                  ) : (
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
                      href={`/order/co/${encodeURIComponent(item[item.length - 1].id)}`}
                    >
                      <p>View CO</p>
                    </Link>
                  )}
                </Table.Cell>
                <Table.Cell className="p-1">{item[0].status === "co" && <AiOutlineExclamationCircle size={25} color="red" />}</Table.Cell>
              </Table.Row>
              {viewHistory === item[0].id && (
                <Table.Cell colSpan={8}>
                  <div className="p-4">
                    <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Order history</h5>

                    <Timeline>
                      {[...item].reverse().map((co, index) => (
                        <Timeline.Item>
                          <Timeline.Point />
                          <Timeline.Content>
                            <Timeline.Time>{moment(co.created_at).format("MMMM DD, YYYY")}</Timeline.Time>
                            <Timeline.Title>{co.order_id + "-" + index}</Timeline.Title>
                            <Timeline.Body>
                              <p>{co.description}</p>
                            </Timeline.Body>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </Table.Cell>
              )}
            </>
          ))}
        </Table.Body>
      </Table>
      {/* <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="p-4"></th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Expand/Collapse Row</span>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[14rem]">
              Product
            </th>
            <th scope="col" className="px-4 py-3 min-w-[10rem]">
              Category
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[6rem]">
              Brand
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[6rem]">
              Price
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[6rem]">
              Stock
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[12rem]">
              Total Sales
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
            <th scope="col" className="px-4 py-3 min-w-[7rem]">
              Status
              <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                />
              </svg>
            </th>
          </tr>
        </thead>
        <tbody data-accordion="table-column">
          <tr
            className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
            id="table-column-header-0"
            data-accordion-target="#table-column-body-0"
            aria-expanded="false"
            aria-controls="table-column-body-0"
          >
            <td className="px-4 py-3 w-4"></td>
            <td className="p-3 w-4">
              <svg data-accordion-icon="" className="w-6 h-6 shrink-0" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </td>
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                alt="iMac Front Image"
                className="h-8 w-auto mr-3"
              />
              Apple iMac 27&#34;
            </th>
            <td className="px-4 py-3">PC</td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple</td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">$2999</td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">200</td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">245</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="w-fit bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-100 dark:text-green-800">
                Active
              </div>
            </td>
          </tr>
          <tr className=" flex-1 overflow-x-auto w-full" id="table-column-body-0" aria-labelledby="table-column-header-0">
            <td className="p-4 border-b dark:border-gray-700" colSpan={9}>
              <div>
                <h6 className="mb-2 text-base leading-none font-medium text-gray-900 dark:text-white">Details</h6>
                <div className="text-base text-gray-500 dark:text-gray-400 max-w-screen-md">
                  Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon
                  Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table> */}
    </section>
  );
}
