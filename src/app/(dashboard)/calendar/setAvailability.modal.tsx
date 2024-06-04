"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea, ToggleSwitch } from "flowbite-react";
type Day = { name: string; enabled: boolean; startTime: string; endTime: string };

export default function SetAvailabiltyModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (value: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [days, setDays] = useState<Day[]>([
    { name: "Sunday", enabled: false, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Monday", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Tuesday", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Wednesday", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Thursday", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Friday", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
    { name: "Saturday", enabled: false, startTime: "9:00 am", endTime: "5:00 pm" },
  ]);

  function handleChangeEnabled(dayName: string) {
    setDays((prevState: any) => {
      // Make a copy of the array to avoid direct modification
      const updatedDays = prevState.map((day: Day) => {
        if (day.name === dayName) {
          // Modify the 'enabled' property of the desired object
          return { ...day, enabled: !day.enabled };
        }
        return day;
      });
      return updatedDays;
    });
  }

  function handleSaveAvailability() {
    setShowModal(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>Set Availability</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Availability</h3>
            {days.map((day) => (
              <div className="flex flex-row justify-between items-center h-8" key={day.name}>
                <ToggleSwitch label={day.name} checked={day.enabled} onChange={() => handleChangeEnabled(day.name)} />
                {day.enabled && (
                  <div className="flex flex-row gap-2">
                    <TextInput className="w-20" value={day.startTime} />
                    <TextInput className="w-20" value={day.endTime} />
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <Button onClick={handleSaveAvailability}>Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
