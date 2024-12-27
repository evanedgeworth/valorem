"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Datepicker } from "flowbite-react";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import request from "@/utils/request";
import SelectProperty from "./selectProperty";

type Inputs = {
  trade: string;
  projectName: string;
  address: string;
  dueDate: Date;
  size: number;
  description: string;
  additionalDetails: string;
  propertyId: string;
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
  const { user, selectedOrganization } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope`,
        method: 'POST',
        data: body
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess(data, variables, context) {
      router.push(`/order/${encodeURIComponent(data.id)}`);
      setShowModal(false);
    },
  });

  async function handleCreateOrder(data: Inputs) {
    mutate({
      ...data,
      organizationId: selectedOrganization?.organizationId
    });
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
              <div>
                <SelectProperty
                  onChange={(v) => setValue("propertyId", v)}
                />
              </div>
              <div>
                <Label>Project Name</Label>
                <TextInput placeholder="Enter a name" {...register("projectName")} required />
              </div>

              <div>
                <Label>Due Date</Label>
                <Datepicker
                  {...register("dueDate")}
                  required
                  minDate={new Date()}
                  onSelectedDateChanged={(date) => setValue('dueDate', date)}
                />
              </div>
              {/* <div>
                <Label>Main Sqft</Label>
                <TextInput type="number" {...register("size")} required />
              </div> */}

              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Description</Label>
                <Textarea placeholder="Please give a detailed description..." rows={4} {...register("additionalDetails")} required />
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
