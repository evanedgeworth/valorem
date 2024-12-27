"use client";

import { Button, Modal} from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import PropertyForm, { PropertyInput } from "./propertyForm";
import uploadFiles from "@/utils/uploadFile";

export default function NewPropertyModal({
  showModal,
  setShowModal,
  refresh,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  refresh: () => Promise<void>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedOrganization } = useContext(UserContext);


  async function handleCreateProperty(data: PropertyInput) {
    const frontImages = data.frontImages ? await uploadFiles(data.frontImages.map(item => item.data)) : [];
    const backImages = data.backImages ? await uploadFiles(data.backImages.map(item => item.data)) : [];
    const leftImages = data.leftImages ? await uploadFiles(data.leftImages.map(item => item.data)) : [];
    const rightImages = data.rightImages ? await uploadFiles(data.rightImages.map(item => item.data)) : [];

    setIsLoading(true);
    await request({
      url: `/properties`,
      method: "POST",
      data: {
        name: data.name,
        organizationId: selectedOrganization?.organizationId,
        accessInstructions: data.accessInstructions,
        type: data.type,
        accessContact: data.accessContact,
        noOfRooms: Number(data.noOfRooms),
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
    await refresh();
    setIsLoading(false);
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Property</Button>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center px-8 pt-4">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Property</h3>
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
