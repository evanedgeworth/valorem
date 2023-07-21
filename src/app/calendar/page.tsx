"use client";
import { FC, useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Calenda() {
  const [events, setEvents] = useState<Event[]>();

  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) => {
      const firstEvent = {
        start: new Date(start),
        end: new Date(end),
      };
      return [...currentEvents, firstEvent];
    });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    console.log(data);
  };

  return (
    <DnDCalendar
      defaultView="month"
      events={events}
      localizer={localizer}
      onEventDrop={onEventDrop}
      //onEventResize={onEventResize}
      resizable
      style={{ height: "100vh" }}
    />
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
