"use client";

import { Button, Modal } from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import PropertyForm, { PropertyInput } from "./propertyForm";
import uploadFiles from "@/utils/uploadFile";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";

export default function NewPropertyModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedOrganization } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  async function handleCreateProperty(data: PropertyInput) {
    try {
      setIsLoading(true);

      const frontImages = data.frontImages ? await uploadFiles(data.frontImages.map(item => item.data)) : [];
      const backImages = data.backImages ? await uploadFiles(data.backImages.map(item => item.data)) : [];
      const leftImages = data.leftImages ? await uploadFiles(data.leftImages.map(item => item.data)) : [];
      const rightImages = data.rightImages ? await uploadFiles(data.rightImages.map(item => item.data)) : [];

      const res = await request({
        url: `/properties`,
        method: "POST",
        data: {
          name: data.name,
          organizationId: selectedOrganization?.organizationId,
          accessInstructions: data.accessInstructions,
          notes: data.notes,
          type: data.type,
          noOfRooms: Number(data.noOfRooms),
          noOfBathrooms: Number(data.noOfBathrooms),
          address: {
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode
          },
          frontImages: frontImages.map((item) => ({ fileId: item.key })),
          backImages: backImages.map((item) => ({ fileId: item.key })),
          leftImages: leftImages.map((item) => ({ fileId: item.key })),
          rightImages: rightImages.map((item) => ({ fileId: item.key })),
        },
      });
      if (res?.status === 200) {
        setIsLoading(false);
        setShowModal(false);
        queryClient.setQueryData(['properties'], (old: any) => ({ ...old, properties: [...old.properties, res.data] }))
        return res.data;
      }
      throw Error(res?.data?.message);
    } catch (error: any) {
      setIsLoading(false);
      showToast(error.message);
    }
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ New Property</Button>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center px-6 pt-4">
          <h3 className="text-xl font-medium">New Property</h3>
        </Modal.Header>
        <Modal.Body>
          <PropertyForm
            onSubmit={handleCreateProperty}
            isLoading={isLoading}
            onClose={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
