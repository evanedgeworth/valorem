import { AdvancedMarker, InfoWindow, Marker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import * as React from "react";
type MarkerProps = { address: string; coordinates: { lat: number; lng: number } };

function CustomMarker({ markerLocation }: { markerLocation: MarkerProps }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowOpen, setInfowindowOpen] = React.useState(false);

  return (
    <>
      <Marker onClick={() => setInfowindowOpen(true)} position={markerLocation.coordinates} />
      {infowindowOpen && (
        <InfoWindow position={markerLocation.coordinates} onClose={() => setInfowindowOpen(false)}>
          {markerLocation.address}
        </InfoWindow>
      )}
    </>
  );
}

export default React.memo(CustomMarker);
