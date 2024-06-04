"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { Timeline } from "flowbite-react";
import { BsCheck } from "react-icons/bs";
import { Database } from "../../../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];

export default function OrderTimeLine({ order }: { order: Order }) {
  const orderTimeline = [
    { name: "Created", date: order.created_at },
    { name: "Processed", date: order.processed },
    { name: "Delivered", date: order.delivered },
    { name: "Installed", date: order.installed },
    { name: "Fulfilled", date: order.fulfilled },
    { name: "Closed", date: order.closed },
  ];

  return (
    <div className="my-16 ml-5">
      <Timeline horizontal>
        {orderTimeline.map((item) => (
          <Timeline.Item className="flex-1" key={item.name}>
            {item.date ? <Timeline.Point icon={BsCheck} /> : <Timeline.Point />}

            <Timeline.Content className="mt-4">
              <Timeline.Title>{item.name}</Timeline.Title>
              {item.date && <Timeline.Time>{moment(item.date).format("MMMM DD, YYYY")}</Timeline.Time>}
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}
