import { Property } from "@/types";
import { AdvancedMarker, InfoWindow, Marker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { Button } from "flowbite-react";
import Link from "next/link";
import * as React from "react";

type MarkerProps = { property: Property, address: string; coordinates: { lat: number; lng: number } };

function CustomMarker({ markerLocation }: { markerLocation: MarkerProps }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowOpen, setInfowindowOpen] = React.useState(false);

  if (!markerLocation?.coordinates) {
    return null;
  }
  return (
    <>
      <Marker onClick={() => setInfowindowOpen(true)} position={markerLocation.coordinates} />
      {infowindowOpen && (
        <InfoWindow position={markerLocation.coordinates} onClose={() => setInfowindowOpen(false)}>
          <div className="text-black">
            <p className="text-xl font-bold">{markerLocation.property.name}</p>
            <p>
              <b>Address: </b>{markerLocation.address}
            </p>
            <div className="mt-4 flex justify-end">
              <Link href={`/properties/${markerLocation.property?.id}`}>
                <Button size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default React.memo(CustomMarker);
