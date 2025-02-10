import { setKey, fromAddress } from "react-geocode";
import { useState, useEffect } from "react";
import React from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { lightStyle, darkStyle } from "./map-style";
import CustomMarker from "./custom-marker";
import type { Property } from "@/types";
import { parseAddress } from "@/utils/commonUtils";

type Props = {
  properties: Property[];
};

type MarkerProps = { property: Property, address: string; coordinates: { lat: number; lng: number } };

// Function to calculate geographic midpoint
const calculateCenter = (locations: MarkerProps[]) => {
  const numLocations = locations.length;
  const sumLat = locations.reduce((sum, loc) => sum + loc.coordinates.lat, 0);
  const sumLng = locations.reduce((sum, loc) => sum + loc.coordinates.lng, 0);
  return {
    lat: sumLat / numLocations,
    lng: sumLng / numLocations,
  };
};

export default function MapPage({ properties }: Props) {
  const [propertyLocations, setPropertyLocations] = useState<MarkerProps[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const map = useMap();

  const [prefersDarkMode, setPrefersDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    function handleDarkModePrefferedChange() {
      const doesMatch = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setPrefersDarkMode(doesMatch);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleDarkModePrefferedChange);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleDarkModePrefferedChange);
    };
  }, []);

  useEffect(() => {
    setKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "");
  }, []);

  useEffect(() => {
    if (properties.length > 0) {
      const promises = properties.map((property) =>
        fromAddress(parseAddress(property.address))
          .then(({ results }) => {
            const { lat, lng } = results[0].geometry.location;
            return {
              property,
              address: parseAddress(property.address),
              coordinates: { lat, lng },
            };
          })
          .catch((error) => {
            console.error(`Error geocoding address "${property}":`, error);
            return null; // Handle error as needed
          })
      );

      Promise.all(promises)
        .then((coordinates) => {
          const validCoordinates = coordinates.filter((coord) => coord?.coordinates !== null) as {
            property: Property,
            address: string;
            coordinates: { lat: number; lng: number };
          }[];
          setPropertyLocations(validCoordinates);
          if (validCoordinates.length > 0) {
            setCenter(calculateCenter(validCoordinates));
          }
        })
        .catch((error) => {
          console.error("Error fetching coordinates:", error);
        });
    }
  }, [properties]);

  useEffect(() => {
    if (map && propertyLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      propertyLocations.forEach((location) => {
        bounds.extend(new window.google.maps.LatLng(location.coordinates.lat, location.coordinates.lng));
      });
      map.fitBounds(bounds);
      //   map.setCenter(center);
    }
  }, [map, propertyLocations]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}>
      <Map
        style={{ width: "100%" }}
        center={center}
        onCenterChanged={(e) => setCenter(e.detail.center)}
        defaultZoom={6}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapTypeId={"roadmap"}
        styles={prefersDarkMode ? darkStyle : lightStyle}
      >
        {propertyLocations.map((markerLocation, index) => (
          <CustomMarker key={index} markerLocation={markerLocation} />
        ))}
      </Map>
    </APIProvider>
  );
}
