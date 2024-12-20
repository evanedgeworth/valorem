"use client";

import { useState, useRef, useContext } from "react";
import { Button, Modal} from "flowbite-react";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import PropertyForm, { PropertyInput } from "./propertyForm";

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
    setIsLoading(true);
    await request({
      url: `/properties`,
      method: "POST",
      data: {
        name: data.name,
        organizationId: selectedOrganization?.organizationId,
        accessInstructions: data.accessInstructions,
        type: data.type,
        address: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode
        },
        size: {
          value: Number(data.size),
          units: "SQUARE_FEET" 
        }
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
        <Modal.Header className="items-center p-8">
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
