"use client";

import { useRef } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Spinner } from "flowbite-react";

export default function ConfirmationModal({
  showModal,
  isLoading,
  setShowModal,
  title,
  description,
  handleCancel,
  handleConfirm,
}: {
  showModal: boolean;
  isLoading?: boolean;
  setShowModal: (value: boolean) => void;
  title: string;
  description: string;
  handleCancel: () => void;
  handleConfirm: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
            <p>{description}</p>
            <div className="flex flex-row gap-4 justify-center items-center">
              <Button color="gray" className="w-28" onClick={handleCancel}>
                No
              </Button>
              <Button disabled={isLoading} className="w-28" onClick={handleConfirm}>
                { isLoading ? <Spinner size="sm" /> : "Yes" }
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
