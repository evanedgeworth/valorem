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

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SetAvailabiltyModal from "./setAvailability.modal";

export default function Calenda() {
  const supabase = createClientComponentClient<Database>();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

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
        <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h5>

        <div className="flex justify-end mb-5">
          <SetAvailabiltyModal showModal={showModal} setShowModal={setShowModal} />
        </div>
        <div className="flex flex-col gap-4">
          {/* <Card className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Product name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
              </Table.Head>
              {events.map((event: any) => (
                <Table.Body className="divide-y" key={event.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">{event.name}</Table.Cell>
                    <Table.Cell>{event.description}</Table.Cell>
                    <Table.Cell>{moment(event.date_time).format("MMMM DD, YYYY")}</Table.Cell>
                    <Table.Cell>{moment(event.date_time).format("HH:mm a")}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </Card> */}
          {events.map((item) => (
            <div className="my-4" key={item.id}>
              <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{moment(item.date_time).format("dddd, MMMM DD")}</h5>
              <Card>
                <div className="flex justify-between  text-gray-900 dark:text-white">
                  <p>{item.name}</p>
                  <b>{moment(item.date_time).format("HH:mm a")}</b>
                </div>
              </Card>
            </div>
          ))}
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
