"use client";

import { useRef, useContext } from "react";
import { Button, Label, Modal, TextInput, Textarea, Datepicker } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import request from "@/utils/request";
import SelectProperty from "./selectProperty";

type Inputs = {
  trade: string;
  projectName: string;
  address: string;
  dueDate: Date;
  budget: number;
  description: string;
  additionalDetails: string;
  propertyId: string;
};

export default function NewOrderModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (value: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
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
        data: {
          ...body,
          organizationId: selectedOrganization?.organizationId
        }
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
      budget: Number(data.budget),
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
              <div>
                <Label>Budget</Label>
                <TextInput type="number" {...register("budget")} required />
              </div>

              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Description</Label>
                <Textarea placeholder="Please give a detailed description..." rows={4} {...register("additionalDetails")} required />
              </div>

              <div className="flex justify-end">
                <Button disabled={isPending} type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
