"use client";

import { useRef, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, Spinner } from "flowbite-react";

export default function ReviewModal({
  showModal,
  isLoading,
  title,
  handleCancel,
  handleConfirm,
}: {
  showModal: boolean;
  isLoading?: boolean;
  title: string;
  handleCancel: () => void;
  handleConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    handleConfirm(note);
  }

  return (
    <Modal show={showModal} size="lg" popup onClose={handleCancel}>
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4 pt-3">{title}</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <Button fullSized color="gray" onClick={handleCancel}>
              Close
            </Button>
            <Button fullSized disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
