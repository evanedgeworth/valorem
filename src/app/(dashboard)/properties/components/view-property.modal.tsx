"use client";

import { useRef } from "react";

import { Avatar, Button, Label, Modal } from "flowbite-react";
import type { Property } from "@/types";
import { parseAddress } from "@/utils/commonUtils";

type props = { showModal: boolean; setShowModal: (value: boolean) => void; property: Property | null; showEditModal: () => void };

export default function ViewPropertyModal({ showModal, setShowModal, property, showEditModal }: props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const renderImage = (value: { fileUrl: string }[]) => {
    return (
      <div className="flex gap-2 mb-2">
        {value?.map((item: any) => (
          <a key={item.fileUrl} target="_blank" href={item.fileUrl}>
            <Avatar size="lg" img={item.fileUrl} />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center p-8">
          <h3 className="text-xl font-medium">Property</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <div>
              <Label htmlFor="address">Address</Label>
              <p>{parseAddress(property?.address)}</p>
            </div>
            <div>
              <Label value="Name" />
              <p>{property?.name}</p>
            </div>
            <div>
              <Label htmlFor="type" value="Type" />
              <p>{property?.type}</p>
            </div>
            <div>
              <Label value="Number of rooms" />
              <p>{property?.noOfRooms}</p>
            </div>
            <div>
              <Label value="Access Contact" />
              <p>{property?.accessContact}</p>
            </div>
            <div id="textarea">
              <Label htmlFor="comment">Access Instructions</Label>
              <p>{property?.accessInstructions}</p>
            </div>
            <div>
              <Label value="Front Images" />
              {renderImage(property?.frontImages || [])}
            </div>
            <div>
              <Label value="Back Images" />
              {renderImage(property?.backImages || [])}
            </div>
            <div>
              <Label value="Left Images" />
              {renderImage(property?.leftImages || [])}
            </div>
            <div>
              <Label value="Right Images" />
              {renderImage(property?.rightImages || [])}
            </div>
            <div className="flex gap-4 pt-10">
              <Button fullSized onClick={showEditModal} color="gray">
                Edit
              </Button>
              <Button type="button" onClick={() => setShowModal(false)} fullSized color={"gray"} outline>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
