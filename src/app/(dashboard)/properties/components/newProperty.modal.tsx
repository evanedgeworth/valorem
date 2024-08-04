"use client";

import { useState, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
import { Button, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import Autocomplete, { usePlacesWidget, type ReactGoogleAutocompleteInputProps } from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { states } from "@/utils/defaults";
import request from "@/utils/request";

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

export default function NewPropertyModal({
  showModal,
  setShowModal,
  refresh,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  refresh: () => Promise<void>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [address, setAddress] = useState<string>("");
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
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,

    onPlaceSelected: (place) => {
      console.log(place);
    },
  });

  const handlePlaceSelected = (place: any) => {
    setAddress(place.formatted_address);
    setLocation({ lat: place.geometry.location.lat(), long: place.geometry.location.lng() });

    const addressComponents = place.address_components;
    const cityComponent = addressComponents.find((component: any) => component.types.includes("locality"));
    const stateComponent = addressComponents.find((component: any) => component.types.includes("administrative_area_level_1"));
    const zipCodeComponent = addressComponents.find((component: any) => component.types.includes("postal_code"));

    if (cityComponent) {
      setCity(cityComponent.long_name);
      setValue("city", cityComponent.long_name);
    }
    if (stateComponent) {
      setState(stateComponent.short_name);
      setValue("state", stateComponent.short_name);
    }
    if (zipCodeComponent) {
      setZipCode(zipCodeComponent.long_name);
      setValue("zip_code", zipCodeComponent.long_name);
    }
  };

  async function handleCreateProperty(data: Inputs) {
    request({
      url: `/properties`,
      method: "POST",
      data: {
        address_line1: data.address1,
        address_line2: data.address2,
        organization: selectedOrganization?.id,
        city: city,
        state: state,
        zip_code: data.zip_code,
        //location: `POINT(${location.lat} ${location.long})`,
        access_instructions: data.access_instructions,
        type: data.type,
        // size: 0
      },
    });
    await refresh();
    setShowModal(false);
  }

  // async function handleCreateProperty(data: Inputs) {
  //   console.log(data);
  //   const { data: newProperty, error } = await supabase
  //     .from("properties")
  //     .insert([
  //       {
  //         address_line_1: data.address1,
  //         address_line_2: data.address2,
  //         city: city,
  //         state: state,
  //         location: `POINT(${location.lat} ${location.long})`,
  //         zip_code: data.zip_code,
  //         type: data.type,
  //         access_instructions: data.access_instructions,
  //         organization: selectedOrganization?.id,
  //       },
  //     ])
  //     .select()
  //     .limit(1)
  //     .single();
  //   if (newProperty) {
  //     //router.push(`/order/${encodeURIComponent(newOrder.order_id)}`);
  //   }
  //   if (error) {
  //     alert(error.message);
  //   }
  //   setShowModal(false);
  // }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Property</Button>
      <Modal show={showModal} size="xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header className="items-center p-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">New Property</h3>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleCreateProperty)}>
            <div className="space-y-2">
              <div>
                <Label htmlFor="address">Address Line 1</Label>
                {address ? (
                  <Autocomplete
                    {...register("address1")}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                    onPlaceSelected={handlePlaceSelected}
                    options={{
                      types: ["address"],
                      componentRestrictions: { country: "us" },
                    }}
                  />
                ) : (
                  <TextInput type="string" {...register("address1")} value={address} onChange={(e) => setAddress(e.target.value)} required />
                )}
              </div>
              <div>
                <Label>Addres Line 2</Label>
                <TextInput type="string" {...register("address2")} />
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
                  Create Property +
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
