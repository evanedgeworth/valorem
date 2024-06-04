"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import { useRouter } from "next/navigation";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Catalog = Database["public"]["Tables"]["materials"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
import { Button, Datepicker, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import { UserContext } from "@/context/userContext";

export default function AddEventModal({ products, orderId }: { products: Product[]; orderId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toDateString());
  const { user } = useContext(UserContext);
  const router = useRouter();

  async function handleScheduleEvent() {
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          type: type,
          date_time: startDate,
          contractor_id: user?.id,
          order_id: Number(orderId),
        },
      ])
      .select()
      .limit(1)
      .single();
    if (data) {
      router.push(`/calendar`);
    }
    if (error) {
      alert(error.message);
    }
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>Continue ({products.length})</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Schedule {type}</h3>
            <div>
              <Label>Type of Event</Label>
              <Select id="type" required value={type} onChange={(e) => setType(e.target.value)}>
                <option>Delivery</option>
                <option>Installation</option>
                <option>Inspection</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="countries">Date</Label>
              <Datepicker onSelectedDateChanged={(e) => setStartDate(e.toDateString())} value={startDate} />
            </div>
            <div>
              <Label>Time</Label>
              <TextInput id="small" type="time" sizing="sm" />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleScheduleEvent}>Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
