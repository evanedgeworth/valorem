"use client";

import { Button, Modal } from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import PropertyForm, { PropertyInput } from "./propertyForm";
import uploadFiles from "@/utils/uploadFile";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/toastContext";
import RoomForm from "./roomForm";
import { Room, RoomType } from "@/types";

export default function NewPropertyModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (value: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedOrganization } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [data, setData] = useState<any>({});
  const [step, setStep] = useState(1);

  async function handleCreateProperty(data: PropertyInput & { rooms: Room[] }) {
    try {
      setIsLoading(true);

      const frontImages = data.frontImages ? await uploadFiles(data.frontImages.map((item) => item.data)) : [];
      const backImages = data.backImages ? await uploadFiles(data.backImages.map((item) => item.data)) : [];
      const leftImages = data.leftImages ? await uploadFiles(data.leftImages.map((item) => item.data)) : [];
      const rightImages = data.rightImages ? await uploadFiles(data.rightImages.map((item) => item.data)) : [];

      const roomsWithImages = await Promise.all(
        data.rooms.map(async (room) => ({
          name: room.name,
          type: room.type,
          roomImages: await uploadFiles(room.roomImages.map(item => item.data)).then((images) => images.map((image) => ({ fileId: image.key }))),
        }))
      );

      const res = await request({
        url: `/properties`,
        method: "POST",
        data: {
          ...data,
          frontImages: frontImages.map((item) => ({ fileId: item.key })),
          backImages: backImages.map((item) => ({ fileId: item.key })),
          leftImages: leftImages.map((item) => ({ fileId: item.key })),
          rightImages: rightImages.map((item) => ({ fileId: item.key })),
          rooms: roomsWithImages,
        },
      });
      if (res?.status === 200) {
        setIsLoading(false);
        setShowModal(false);
        showToast('Successfully create property.', 'success');
        queryClient.setQueryData(["properties", selectedOrganization?.organizationId], (old: any) => ({ ...old, properties: [...old.properties, res.data] }));
        return res.data;
      }
      throw Error(res?.data?.message);
    } catch (error: any) {
      setIsLoading(false);
      showToast(error.message, "error");
    }
  }

  const handleNextStep = (data: PropertyInput) => {
    const numberOfBathroomsTextFormatted = data.noOfBathrooms.replace(" 1/2", "").trim();
    const numberOfBathrooms = data.noOfBathrooms.toString().includes("1/2")
      ? Number(numberOfBathroomsTextFormatted) + 1
      : Number(numberOfBathroomsTextFormatted);


      const bedroomImages = Object.fromEntries(
        Array.from({ length: Number(data.noOfRooms) }, (_, index) => [`Bedroom ${index + 1}`, []])
      );
      const bathroomImages = Object.fromEntries(
        Array.from({ length: numberOfBathrooms }, (_, index) => {
          if (data.noOfBathrooms.toString().includes("1/2") && index === numberOfBathrooms - 1) {
            return [`Half Bath 1`, []];
          }
          return [`Bathroom ${index + 1}`, []];
        })
      );
    setData({
      name: data.name,
      organizationId: selectedOrganization?.organizationId,
      accessInstructions: data.accessInstructions,
      notes: data.notes,
      type: data.type,
      noOfRooms: Number(data.noOfRooms),
      noOfBathrooms: numberOfBathrooms,
      address: {
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
      },
      rooms: [
        ...Object.entries(bedroomImages).map(([key, value]) => ({ name: key, type: RoomType.BEDROOM, roomImages: value })),
        ...Object.entries(bathroomImages).map(([key, value]) => ({ name: key, type: RoomType.BATHROOM, roomImages: value })),
      ],
    });

    setStep(2);
  }

  return (
    <div ref={rootRef}>
      <Button color={"gray"} onClick={() => setShowModal(true)}>
        + New Property
      </Button>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center px-6 pt-4">
          <h3 className="text-xl font-medium">New Property</h3>
        </Modal.Header>
        <Modal.Body>
          {
            step === 1 && (
              <PropertyForm
                onSubmit={handleNextStep}
                isLoading={isLoading}
                onClose={() => setShowModal(false)}
              />
            )
          }
          {
            step === 2 && (
              <RoomForm
                rooms={data.rooms || []}
                isLoading={isLoading}
                onClose={() => setShowModal(false)}
                onSubmit={({ rooms }) => {
                  handleCreateProperty({
                    ...data,
                    rooms
                  });
                }}
              />
            )
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}
