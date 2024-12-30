"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Label, Modal, TextInput, Textarea, Datepicker, Spinner } from "flowbite-react";
import { Scope } from "@/types";
import { useForm } from "react-hook-form";
import request from "@/utils/request";
import { useMutation } from "@tanstack/react-query";

type Inputs = {
  projectName: string;
  dueDate: Date;
  budget: number;
  additionalDetails: string;
  propertyId: string;
};

export default function EditOrderModal({
  showModal,
  setShowModal,
  order,
  refresh,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  order: Scope | null;
  refresh: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const { register, setValue, handleSubmit } = useForm<Inputs>();

  useEffect(() => {
    if (order) {
      setValue('projectName', order.projectName);
      setValue('budget', order.budget);
      setValue('additionalDetails', order.additionalDetails);
      setValue('dueDate', order.dueDate ? new Date(order.dueDate) : new Date() );
    }
  }, [order]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope/${order?.id}`,
        method: 'PUT',
        data: {
          ...body,
        }
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess(data, variables, context) {
      setShowModal(false);
      refresh();
    },
  });

  async function handleEditOrder(data: Inputs) {

    mutate({
      ...order,
      ...data,
      budget: Number(data.budget),
    });
  }

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit(handleEditOrder)}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Order</h3>
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
                <Button disabled={isPending} type="submit">{isPending ? <Spinner size="sm" /> : "Save"}</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
