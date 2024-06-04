"use client";
import { FC, useState, useEffect, useRef, useMemo } from "react";
import { Calendar, ToolbarProps, momentLocalizer, Navigate, EventProps } from "react-big-calendar";
import withDragAndDrop, { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import { Card, Button, Table, Datepicker } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { MdLocationOn } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import moment from "moment";
import "./calendar.css";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventWithOrderId = {
  order_id: {
    address: string;
  };
} & Event;
type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};
import ConfirmationModal from "./confirmation.modal";
import { useRouter } from "next/navigation";
import SetAvailabiltyModal from "./setAvailability.modal";

export default function Calenda() {
  const supabase = createClientComponentClient<Database>();
  const [events, setEvents] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [date, setDate] = useState<moment.Moment>(moment());
  const [location, setLocation] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const selectedEvent = useRef<any>(null);
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }
  }, []);

  async function getEvents() {
    let { data: events, error } = await supabase.from("events").select("*, order_id(address, location)");
    if (events) {
      setEvents(events);
      let formattedEvents = events.map((item) => {
        return { title: item.type || "", start: new Date(item.date_time || ""), end: new Date(item.date_time || "") };
      });
      setCalendarEvents(formattedEvents);
    }
  }

  async function handleConfirmModal(event: Event) {
    setShowConfirmModal(true);
    selectedEvent.current = event;
  }

  const formats = useMemo(
    () => ({
      dateFormat: "D",
      weekdayFormat: (date: Date, culture: any, localizer: any) => localizer.format(date, "dddd", culture),
    }),
    []
  );

  function toolbar(props: ToolbarProps) {
    return (
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-4 border-[1px] rounded-t-lg">
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">{moment(props.date).format("MMMM YYYY")}</h5>
        <div className="flex">
          <div className="flex items-center h-10 rounded-lg text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2">
            <LuChevronLeft size={25} onClick={() => props.onNavigate(Navigate.PREVIOUS)} className="cursor-pointer" />
            <p className="mx-4 cursor-pointer" onClick={() => props.onNavigate(Navigate.TODAY)}>
              Today
            </p>
            <LuChevronRight size={25} onClick={() => props.onNavigate(Navigate.NEXT)} className="cursor-pointer" />
          </div>
          <div className=" h-10 w-[1px] bg-gray-200 dark:bg-gray-200 mx-4" />
          <Button onClick={() => router.push("add-event")}>Add Event</Button>
        </div>
      </div>
    );
  }

  function event(props: EventProps) {
    return (
      <div className="flex flex-1 justify-between flex-row bg-cyan-700 text-white rounded-md p-1">
        <p className=" truncate">{props.title}</p>
        <p>{moment(props.slotStart).format("hh:mm a")}</p>
      </div>
    );
  }

  return (
    <>
      <section className="p-5 w-full">
        <h2 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Upcoming events</h2>
        <Calendar
          date={date.toString()}
          localizer={localizer}
          views={["month"]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
          toolbar={true}
          events={calendarEvents}
          formats={formats}
          selectable
          components={{ toolbar: toolbar, event: event }}
          onNavigate={(newDate) => setDate(moment(newDate))}
        />
        <div className="flex flex-col flex-1">
          {events
            .filter((item) => moment(item.date_time).isBetween(date.startOf("month").format(), date.endOf("month")))
            .map((item) => (
              <div key={item.id} className="border-b-[1px] border-gray-200 flex-1">
                {/* <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{moment(item.date_time).format("MMMM")}</h5> */}
                <div className="my-6">
                  <div className="flex flex-row gap-8 items-center" key={item.id}>
                    {/* <div className="flex-col items-center pr-5 border-r-gray-500 border-r-2">
                    <h5 className="mb-2 text-xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("ddd")}</h5>
                    <h5 className="mb-2 text-3xl font-bold text-center text-gray-900 dark:text-white">{moment(item.date_time).format("DD")}</h5>
                  </div> */}

                    <div className="text-gray-900 dark:text-white flex flex-1 flex-col gap-2">
                      <p>{item.type}</p>
                      <div className="flex items-center text-gray-500 dark:text-gray-500">
                        <FaCalendar className="mr-4" />
                        {moment(item.date_time).format("MMMM DD YYYY") + " at " + moment(item.date_time).format("h:mm a")}
                        <div className=" h-6 w-[1px] bg-gray-500 dark:bg-gray-500 mx-4" />
                        <MdLocationOn className="mr-4" />
                        {item.order_id?.address}
                      </div>
                    </div>
                    <Button onClick={() => handleConfirmModal(item)}>Confirm</Button>
                  </div>
                </div>
              </div>
            ))}
          <ConfirmationModal showModal={showConfirmModal} setShowModal={setShowConfirmModal} event={selectedEvent.current} location={location} />
        </div>
      </section>
    </>
  );
}
