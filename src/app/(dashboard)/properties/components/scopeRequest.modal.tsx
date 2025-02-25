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
import { useToast } from "@/context/toastContext";

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
};

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
  } = useForm<Inputs>({
    defaultValues: {
      dueDate: new Date()
    }
  });
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope`,
        method: "POST",
        data: body,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess(data, variables, context) {
      setShowModal(false);
      showToast('Successfully request scope.', 'success');
      queryClient.setQueryData(["properties", selectedOrganization?.organizationId], (old: any) => ({
        ...old,
        properties: [...old.properties].map((item) =>
          property && item.id === property?.id
            ? {
                ...item,
                orderCount: (item.orderCount || 0) + 1,
              }
            : item
        ),
      }));
    },
    onError: (error) => {
      showToast(error?.message || "Failed", "error");
    }
  });

  async function handleCreateOrder(data: Inputs) {
    mutate({
      ...data,
      projectName: data.projectName ? data.projectName : parseAddress(property?.address),
      budget: Number(data.budget),
      organizationId: selectedOrganization?.organizationId,
      propertyId: property?.id,
    });
  }

  if (!property) {
    return <div></div>;
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
                <TextInput color="gray" placeholder="Enter a name" {...register("projectName")} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Datepicker {...register("dueDate")} minDate={new Date()} onSelectedDateChanged={(date) => setValue("dueDate", date)} />
              </div>
              <div>
                <Label>Estimated budget (optional)</Label>
                <TextInput type="number" {...register("budget")} />
              </div>

              <div className="max-w-md" id="textarea">
                <Label htmlFor="comment">Additional details</Label>
                <Textarea placeholder="Please give a detailed description..." rows={4} {...register("additionalDetails")} />
              </div>

              <div className="flex flex-row gap-4 justify-end pt-4">
                <Button outline fullSized onClick={() => setShowModal(false)} color="gray">
                  Cancel
                </Button>
                <Button disabled={isPending} isProcessing={isPending} fullSized type="submit" color="gray">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
