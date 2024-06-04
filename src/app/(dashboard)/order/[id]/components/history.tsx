import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import moment from "moment";
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderArray = [Order];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Timeline } from "flowbite-react";
import { useRouter } from "next/navigation";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import DownloadPDF from "../../downloadPDF";

export default function History({ order }: { order: Order }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orders.length !== 0) {
      getProducts();
    }
  }, [orders]);

  async function getOrders() {
    let { data: orders, error } = await supabase.from("orders").select("*").eq("order_id", order.order_id).order("created_at");
    if (orders) {
      setOrders(orders);
      //   setOrders(MergeProductsbyKey(orders, "order_id"));
    }
  }

  function PriceChangeStatus({ currentItem, previousItem }: { currentItem: number | null; previousItem: number | null }) {
    let status;
    status = (currentItem || 0) - (previousItem || 0);
    if (status > 0) {
      return (
        <div className="flex-row flex">
          <BsArrowUpShort color="rgb(132 204 22 / var(--tw-text-opacity))" />
          <span className="font-normal text-lime-500 text-sm">{status}</span>
        </div>
      );
    } else if (status < 0) {
      return (
        <div className="flex-row flex">
          <BsArrowDownShort color="rgb(224 36 36 / var(--tw-text-opacity))" />
          <span className="font-normal text-red-600 text-sm">{status}</span>
        </div>
      );
    } else return null;
  }

  async function getProducts() {
    const orderIds = orders.flatMap((item) => item.id).join(",");
    let { data, count } = await supabase
      .from("products")
      .select("*")
      .filter("orderId", "in", "(" + orderIds + ")")
      .order("created_at");
    if (data) {
      setProducts(data);
    }
  }

  return (
    <section className="p-5">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>

      <Timeline>
        {[...orders].reverse().map((co, index, array) => (
          <Timeline.Item key={co.id}>
            <Timeline.Point />
            <Timeline.Content>
              <div className="flex flex-row justify-between">
                <div>
                  <Timeline.Time>{moment(co.created_at).format("MMMM DD, YYYY")}</Timeline.Time>
                  <Timeline.Title>
                    <a className="hover:underline cursor-pointer" onClick={() => router.push(`/order/view/${co.id}?orderId=${co.order_id}`)}>
                      {co.order_id + "-" + (orders.length - index)}
                    </a>
                    <span className="flex flex-row text-sm">
                      <p className="flex gap-1">
                        <p>Total:</p>${co.cost}
                      </p>
                      <PriceChangeStatus currentItem={co?.cost} previousItem={array[index + 1]?.cost} />
                    </span>
                    <p className="text-sm">
                      {"Items: "}
                      {products.reduce((count, product) => {
                        if (product.orderId === co.id) {
                          return count + 1;
                        }
                        return count;
                      }, 0)}
                    </p>
                  </Timeline.Title>
                </div>
                <DownloadPDF orderId={co.id} id={co.id} />
              </div>
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    </section>
  );
}
