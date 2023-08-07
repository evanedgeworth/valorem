"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";

export default function NewOrderModal({
  showModal,
  setShowModal,
  reload,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  reload: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [trade, setTrade] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  async function handleCreateOrder() {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ project_name: name, start_date: null, address: address, description: description, size: size, trade: trade }])
      .select();
    if (data) {
      alert("Order has been created");
    }
    if (error) {
      alert(error);
    }
    reload();
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Order</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Order</h3>
            <div>
              <Label htmlFor="countries">Trade</Label>
              <Select id="countries" required value={trade} onChange={(e) => setTrade(e.target.value)}>
                <option disabled selected></option>
                <option>Exterior / Landscaping</option>
                <option>MEP / General</option>
                <option>Living Room</option>
                <option>Family Room / Den</option>
                <option>Dining Room</option>
                <option>Kitchen / Nook</option>
                <option>Master Bedroom</option>
                <option>Applicances</option>
                <option>Bedroom</option>
                <option>Laundry Room</option>
                <option>Garage</option>
                <option>Flooring</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Project Name</Label>
              <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Address</Label>
              <TextInput required value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <Label>Main Sqft</Label>
              <TextInput required type="number" value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />
            </div>
            <div className="max-w-md" id="textarea">
              <Label htmlFor="comment">Description</Label>
              <Textarea
                id="comment"
                placeholder="Please give a detailed description..."
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreateOrder}>Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
