import { Property } from "@/types";
import { Card } from "flowbite-react";

export default function PropertyRooms({ property }: { property: Property }) {

  return (
    <div>
      {
        property?.rooms?.map(room => (
          <Card key={room.name + room.type}>
            <div>
              <p className="text-2xl">{room.name}</p>
              <p className="text-base">
                <b>Type: </b>
                <span className="dark:text-gray-400">{room.type}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-1">

              {
                room.roomImages?.map(item => (
                  <div key={item.fileId}>
                    <img className="h-auto max-w-full" src={item.fileUrl} alt="" />
                  </div>
                ))
              }
            </div>
          </Card>
        ))
      }

    </div>
  );
}