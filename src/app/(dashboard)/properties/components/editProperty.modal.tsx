"use client";

import { useState, useRef, useContext, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
import { Button, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { states } from "@/utils/defaults";
import { Property } from "@/types";
import request from "@/utils/request";
import PlaceAutocomplete from "./places-autocomplete";
// type Property = Database["public"]["Tables"]["properties"]["Row"];

type Inputs = {
  address1: string;
  address2: string;
  city: string;
  zip_code: string;
  state: string;
  size: number;
  type: string;
  access_instructions: string;
};

const propertyTypes = ["Single-family home", "Townhouses/Row houses", "Condominium", "Apartment", "Multi-family home"];
type props = { showModal: boolean; setShowModal: (value: boolean) => void; property: Property | null; refresh: () => void };

export default function EditPropertyModal({ showModal, setShowModal, property, refresh }: props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [address, setAddress] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [location, setLocation] = useState<any>({ lat: "", long: "" });
  const router = useRouter();
  const { user, selectedOrganization } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setValue("address1", property?.address_line1 || "");
    setAddress(property?.address_line1 || "");
    setValue("address2", property?.address_line2 || "");
    setValue("city", property?.city || "");
    setValue("zip_code", property?.zip_code || "");
    setValue("state", property?.state || "");
    setValue("size", property?.size || 0);
    setValue("type", property?.type || "");
    setValue("access_instructions", property?.access_instructions || "");

    setAddress2(property?.address_line2 || "");
    setCity(property?.city || "");
    setState(property?.state || "");
    setZipCode(property?.zip_code || "");
  }, [property?.id]);

  const handlePlaceSelected = (place: google.maps.places.AutocompletePrediction) => {
    console.log(place);
    setAddress(`${place.terms[0].value} ${place.terms[1].value}`);
    setCity(place.terms[2].value);
    setState(place.terms[3].value);
    // setZipCode(place.terms[4].value);
    // setAddress(place.formatted_address);
    // setLocation({ lat: place.geometry.location.lat(), long: place.geometry.location.lng() });

    // const addressComponents = place.address_components;
    // const cityComponent = addressComponents.find((component: any) => component.types.includes("locality"));
    // const stateComponent = addressComponents.find((component: any) => component.types.includes("administrative_area_level_1"));
    // const zipCodeComponent = addressComponents.find((component: any) => component.types.includes("postal_code"));

    // if (cityComponent) {
    //   setCity(cityComponent.long_name);
    //   setValue("city", cityComponent.long_name);
    // }
    // if (stateComponent) {
    //   setState(stateComponent.short_name);
    //   setValue("state", stateComponent.short_name);
    // }
    // if (zipCodeComponent) {
    //   setZipCode(zipCodeComponent.long_name);
    //   setValue("zip_code", zipCodeComponent.long_name);
    // }
  };

  async function handleSaveProperty(data: Inputs) {
    request({
      url: `/properties/${property?.id}`,
      method: "PUT",
      data: {
        address_line1: address,
        address_line2: data.address2,
        organization: selectedOrganization?.id,
        city: city,
        state: state,
        zip_code: data.zip_code,
        type: data.type,
        size: Number(data.size),
        access_instructions: data.access_instructions,
      },
    })
      .then(() => {
        refresh();
        setShowModal(false);
      })
      .catch((e) => console.log(e));
  }

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center p-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Property</h3>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSaveProperty)}>
            <div className="space-y-2">
              <div>
                <Label htmlFor="address">Address Line 1</Label>
                <PlaceAutocomplete value={address} onChange={handlePlaceSelected} />
              </div>
              <div>
                <Label>Addres Line 2</Label>
                <TextInput type="string" {...register("address2")} value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <TextInput type="string" {...register("city")} value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div>
                  <Label>State</Label>
                  <Select id="state" required {...register("state")} value={state} onChange={(e) => setState(e.target.value)}>
                    {states.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Zip Code</Label>
                  <TextInput type="string" {...register("zip_code")} value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                </div>
              </div>

              <div>
                <Label htmlFor="type" value="Select your organization" />
                <Select id="type" required {...register("type")}>
                  {propertyTypes.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Size sq/ft</Label>
                <TextInput type="number" {...register("size")} required />
              </div>
              <div id="textarea">
                <Label htmlFor="comment">Access Instructions</Label>
                <Textarea placeholder="Please give detailed instructions..." rows={4} {...register("access_instructions")} />
              </div>
              <div className="flex gap-4">
                <Button type="submit" fullSized>
                  Save
                </Button>
                <Button type="button" onClick={() => setShowModal(false)} fullSized color={"light"}>
                  Close
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
