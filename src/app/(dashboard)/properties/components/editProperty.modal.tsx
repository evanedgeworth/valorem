"use client";

import { useState, useRef, useContext } from "react";
import { Modal } from "flowbite-react";
import { UserContext } from "@/context/userContext";
import { Property } from "@/types";
import request from "@/utils/request";
import PropertyForm, { PropertyInput } from "./propertyForm";

type props = { showModal: boolean; setShowModal: (value: boolean) => void; property: Property | null; refresh: () => void };

export default function EditPropertyModal({ showModal, setShowModal, property, refresh }: props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectedOrganization } = useContext(UserContext);

  async function handleSaveProperty(data: PropertyInput) {
    setIsLoading(true);
    request({
      url: `/properties/${property?.id}`,
      method: "PUT",
      data: {
        ...property,
        name: data.name,
        organizationId: selectedOrganization?.organizationId,
        accessInstructions: data.accessInstructions,
        accessContact: data.accessContact,
        noOfRooms: Number(data.noOfRooms),
        type: data.type,
        address: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode
        },
      },
    })
      .then(() => {
        refresh();
        setIsLoading(false);
        setShowModal(false);
      })
      .catch((e) => console.log(e));
  }

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center p-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Property</h3>
        </Modal.Header>
        <Modal.Body>
          <PropertyForm
            onSubmit={handleSaveProperty}
            isLoading={isLoading}
            onClose={() => setShowModal(false)}
            isEdit
            defaultValues={{
              name: property?.name,
              accessInstructions: property?.accessInstructions,
              accessContact: property?.accessContact,
              noOfRooms: property?.noOfRooms,
              type: property?.type,
              address1: property?.address.address1,
              address2: property?.address.address2,
              city: property?.address.city,
              state: property?.address.state,
              postalCode: property?.address.postalCode,
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
