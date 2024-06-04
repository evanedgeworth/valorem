"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Checkbox, Label, Modal, Spinner, Select, Textarea } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { useRouter } from "next/navigation";
type Event = Database["public"]["Tables"]["events"]["Row"];

export default function ConfirmationModal({
  showModal,
  setShowModal,
  event,
  location,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  event: Event;
  location: any;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (location && event) {
      getDistance();
    }
  }, [showModal, getDistance]);

  async function getDistance() {
    setIsLoading(true);
    const { data, error } = await supabase.rpc("distance_from_location", {
      lat: location.latitude,
      long: location.longitude,
      event_id: event.id,
    });
    if (data) {
      if (data[0].dist_meters < 20) {
        setIsVerified(true);
        router.push("confirm-order/" + event.id);
      } else {
        setIsVerified(false);
      }
    }
    if (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="md" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-2 items-center justify-center">
            {isLoading ? (
              <>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Verifying Location</h3>
                <Spinner aria-label="Extra large spinner example" size="xl" />
              </>
            ) : isVerified ? (
              <>
                <h3 className="text-xl font-medium text-green-500 dark:text-white">Verification Complete</h3>
                <p>Redirecting you to verify the order</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium text-red-500 dark:text-white">Error</h3>
                <p>Can not verify order until you are at the location. Move within 20 miles of the address to verify order.</p>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
