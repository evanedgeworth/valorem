"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";

export default function NewProductModal({
  showModal,
  setShowModal,
  reload,
  orderId,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  reload: () => void;
  orderId: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  async function handleAddProduct() {
    console.log(name, description, quantity, price, size, type, orderId);
    const { data, error } = await supabase
      .from("products")
      .insert([{ name: name, description: description, quantity: quantity, price: price, size: size, type: type, orderId: orderId }])
      .select();
    if (data) {
      alert("Order has been created");
    }
    if (error) {
      console.log(error);
      alert(error);
    }
    reload();
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Product</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Product</h3>
            <div>
              <Label htmlFor="countries">Type</Label>
              <Select id="countries" required value={type} onChange={(e) => setType(e.target.value)}>
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
              <Label>Product Name</Label>
              <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Sqft</Label>
              <TextInput required type="number" value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />
            </div>
            <div>
              <Label>Quantity</Label>
              <TextInput required type="number" value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
            </div>
            <div>
              <Label>Price</Label>
              <TextInput required type="number" value={price} onChange={(e) => setPrice(e.target.valueAsNumber)} />
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
              <Button onClick={handleAddProduct}>Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
