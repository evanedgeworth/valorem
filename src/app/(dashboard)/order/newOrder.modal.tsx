"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Datepicker } from "flowbite-react";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
type Inputs = {
  trade: string;
  name: string;
  address: string;
  date: Date;
  size: number;
  description: string;
  access: string;
};

export default function NewOrderModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (value: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  // const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<any>({ lat: "", long: "" });
  // const [trade, setTrade] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  // const [size, setSize] = useState<number>(0);
  // const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const { user, organization } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  async function handleCreateOrder(data: Inputs) {
    const { data: newOrder, error } = await supabase
      .from("orders")
      .insert([
        {
          project_name: data.name,
          start_date: startDate.toDateString(),
          address: address,
          location: `POINT(${location.lat} ${location.long})`,
          description: data.description,
          size: data.size,
          trade: data.trade,
          access_instructions: data.access,
          organization: organization?.id,
        },
      ])
      .select()
      .limit(1)
      .single();
    if (newOrder) {
      router.push(`/order/${encodeURIComponent(newOrder.order_id)}`);
    }
    if (error) {
      alert(error.message);
    }
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Order</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit(handleCreateOrder)}>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Order</h3>
              {/* <div>
                <Label htmlFor="countries">Trade</Label>
                <Select required {...register("trade")}>
                  <option disabled></option>
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
              </div> */}
              <div>
                <Label>Project Name</Label>
                <TextInput placeholder="Enter a name" {...register("name")} required />
              </div>
              <div>
                <Label htmlFor="email">Address</Label>
                {/* <TextInput required value={address} onChange={(e) => setAddress(e.target.value)} ref={inputRef.current} /> */}
                <Autocomplete
                  {...register("address")}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                  className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                  onPlaceSelected={(place) => {
                    setAddress(place.formatted_address);
                    setLocation({ lat: place.geometry.location.lat(), long: place.geometry.location.lng() });
                  }}
                  options={{
                    types: ["address"],
                    componentRestrictions: { country: "us" },
                  }}
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Datepicker
                  {...register("date")}
                  required
                  minDate={new Date()}
                  value={startDate.toDateString()}
                  onSelectedDateChanged={(e) => setStartDate(e)}
                />
                {/* <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} /> */}
              </div>
              <div>
                <Label>Main Sqft</Label>
                <TextInput type="number" {...register("size")} required />
              </div>
              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Access Instructions</Label>
                <Textarea placeholder="Please give detailed instructions..." rows={4} {...register("description")} required />
              </div>
              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Description</Label>
                <Textarea placeholder="Please give a detailed description..." rows={4} {...register("access")} required />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
