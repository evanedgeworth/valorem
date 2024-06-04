"use client";

import { Button, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];

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

  return <section className=" p-5"></section>;
}
