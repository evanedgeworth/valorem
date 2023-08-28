"use client";
import { FC, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop, { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { Card, Button, Table } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import { MergeProductsbyKey } from "@/utils/commonUtils";
type Event = Database["public"]["Tables"]["events"]["Row"];
import ConfirmationModal from "@/components/confirmation.modal";
import { useRouter } from "next/navigation";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SetAvailabiltyModal from "./setAvailability.modal";

export default function Calenda() {
  const supabase = createClientComponentClient<Database>();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    let { data: events, error } = await supabase.from("events").select("*");
    if (events) {
      setEvents(events);
      console.log(events);
    }
  }

  return (
    <>
      <section className="p-5">
        <h2 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Upcoming events</h2>
        <div className="flex justify-end mb-5">
          <SetAvailabiltyModal showModal={showModal} setShowModal={setShowModal} />
        </div>
        <div className="flex flex-col gap-4">
          {events.map((item) => (
            <>
              <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{moment(item.date_time).format("MMMM")}</h5>
              <Card>
                <div className="flex flex-row gap-8 items-center" key={item.id}>
                  <div className="flex-col items-center pr-5 border-r-gray-500 border-r-2">
                    <h5 className="mb-2 text-xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("ddd")}</h5>
                    <h5 className="mb-2 text-3xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("DD")}</h5>
                  </div>

                  <div className="flex flex-1 flex-col text-left justify-center items-start text-gray-900 dark:text-white">
                    <p>{item.name}</p>
                    <b>{moment(item.date_time).format("HH:mm a")}</b>
                  </div>
                  <Button onClick={() => setShowConfirmModal(true)}>Confirm</Button>
                </div>
              </Card>
            </>
          ))}
          <ConfirmationModal
            showModal={showConfirmModal}
            setShowModal={setShowConfirmModal}
            title="Are you currently at this property?"
            description=""
            handleCancel={() => setShowConfirmModal(false)}
            handleConfirm={() => router}
          />
        </div>
      </section>
    </>
  );
}

// const locales = {
//   "en-US": enUS,
// };

const now = new Date();
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = momentLocalizer(moment);
//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);
