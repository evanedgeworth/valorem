"use client";

import { useRef, useContext } from "react";
import { Button, Label, Modal, TextInput, Textarea, Datepicker } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request from "@/utils/request";
import { Property } from "@/types";
import { parseAddress } from "@/utils/commonUtils";

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

type Props = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  property: Property | null;
}

export default function ScopeRequestModal({ showModal, setShowModal, property }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { selectedOrganization } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const queryClient = useQueryClient();

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
      queryClient.setQueryData(['properties'], (old: any) => ({
        ...old, properties: [...old.properties].map(item => property && item.id === property?.id ? {
          ...item,
          orderCount: item.orderCount + 1
        } : item)
      }))

      setShowModal(false);
    },
  });

  async function handleCreateOrder(data: Inputs) {
    mutate({
      ...data,
      budget: Number(data.budget),
      organizationId: selectedOrganization?.organizationId,
      propertyId: property?.id
    });
  }

  if (!property) {
    return (
      <div></div>
    );
  }

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header>
          <h3 className="text-lg font-medium px-5 pt-2">Scope Request</h3>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleCreateOrder)}>
            <div className="space-y-2">
              <div>
                <p className="text-xl">{property.name}</p>
                <p className="text-gray-500">{parseAddress(property.address)}</p>
              </div>
              <div>
                <Label>Project Name</Label>
                <TextInput color="gray" placeholder="Enter a name" {...register("projectName")} required />
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
                <Label>Estimated Budget</Label>
                <TextInput type="number" {...register("budget")} required />
              </div>

              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Additional details</Label>
                <Textarea placeholder="Please give a detailed description..." rows={4} {...register("additionalDetails")} required />
              </div>

              <div className="flex flex-row gap-4 justify-end pt-4">
                <Button outline fullSized onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button disabled={isPending} isProcessing={isPending} fullSized type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
