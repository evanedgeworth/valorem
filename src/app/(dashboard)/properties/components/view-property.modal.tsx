"use client";

import { useRef } from "react";

import { Button, Label, Modal } from "flowbite-react";
import type { Property } from "@/types";
import { parseAddress } from "@/utils/commonUtils";

type props = { showModal: boolean; setShowModal: (value: boolean) => void; property: Property | null; showEditModal: () => void };

export default function ViewPropertyModal({ showModal, setShowModal, property, showEditModal }: props) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center p-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Property</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <div>
              <Label htmlFor="address">Address</Label>
              <p>{parseAddress(property?.address)}</p>
            </div>

            <div>
              <Label htmlFor="type" value="Type" />
              <p>{property?.type}</p>
            </div>
            <div>
              <Label>Size</Label>
              <p>{property?.size?.value} {property?.size?.units}</p>
            </div>
            <div id="textarea">
              <Label htmlFor="comment">Access Instructions</Label>
              <p>{property?.accessInstructions}</p>
            </div>
            <div className="flex gap-4 pt-10">
              <Button fullSized onClick={showEditModal}>
                Edit
              </Button>
              <Button type="button" onClick={() => setShowModal(false)} fullSized color={"light"}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
