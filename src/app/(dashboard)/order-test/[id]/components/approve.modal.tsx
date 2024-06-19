"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import moment from "moment";
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import { BiCheck } from "react-icons/bi";

export default function ApproveCOModal({
  showModal,
  setShowModal,
  reload,
  id,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  reload: () => void;
  id: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();

  async function handleApproveCO() {
    const { data, error } = await supabase.from("orders").update({ change_order: false }).eq("id", id).select();
    if (data) {
      reload();
    }
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>
        <BiCheck size={20} />
        Approve Changes
      </Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Approve Change Order</h3>
            <p className="font-medium text-gray-900 dark:text-white">Are you sure you would like to approve this change order?</p>
            <div className="flex flex-row gap-4 justify-end">
              <Button outline onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleApproveCO}>Approve</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
