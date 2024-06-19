import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import { usePlacesWidget } from "react-google-autocomplete";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from "next/navigation";
import wkx from "wkx";
import { UserContext } from "@/context/userContext";

export default function Settings({ order }: { order: Order }) {
  const supabase = createClientComponentClient<Database>();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<any>({ lat: "", long: "" });
  const [trade, setTrade] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [accessInstructions, setAccessInstructions] = useState<string>("");
  const { user, organization } = useContext(UserContext);
  const router = useRouter();
  const currentOrganization = user?.user_organizations?.find((org) => organization?.id === org.organization);

  useEffect(() => {
    if (order) {
      setName(order.project_name || "");
      setAddress(order.address || "");
      setDescription(order.description || "");
      setTrade(order.trade || "");
      setAccessInstructions(order.access_instructions || "");
      let geometry: any;
      try {
        geometry = wkx.Geometry.parse(Buffer.from(String(order.location), "hex"));
      } catch {
        geometry = "";
      }
      if (geometry instanceof wkx.Point) {
        setLocation({ lat: geometry.x, long: geometry.y });
      } else {
        console.log("The provided WKB does not represent a point geometry.");
      }
    }
  }, [order]);

  async function handleCreateOrder() {
    const { data, error } = await supabase
      .from("orders")
      .update({
        project_name: name,
        start_date: null,
        address: address,
        location: `POINT(${location.lat} ${location.long})`,
        description: description,
        access_instructions: accessInstructions,
        size: size,
        trade: trade,
      })
      .eq("id", order.id)
      .select();
    if (data) {
      router.refresh();
    }
    if (error) {
      alert(error.message);
    }
  }

  return (
    <section className="p-5">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Order Settings</h1>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="countries">Trade</Label>
          <Select
            id="countries"
            required
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            disabled={currentOrganization?.type === "vendor" || currentOrganization?.type === "supplier"}
          >
            <option disabled></option>
            <option>Exterior / Landscaping</option>
            <option>MEP / General</option>
            <option>Living Room</option>
            <option>Family Room / Den</option>
            <option>Dining Room</option>
            <option>Kitchen / Nook</option>
            <option>Master Bedroom</option>
            <option>Applicances</option>
            <option>Bedroom</option>
            <option>Laundry Room</option>
            <option>Garage</option>
            <option>Flooring</option>
            <option>Other</option>
          </Select>
        </div>
        <div>
          <Label>Project Name</Label>
          <TextInput
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            // disabled={user.type === "vendor" || user.type === "supplier"}
          />
        </div>
        <div>
          <Label htmlFor="email">Address</Label>
          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
            className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
            onPlaceSelected={(place) => {
              setAddress(place.formatted_address);
              setLocation({ lat: place.geometry.location.lat(), long: place.geometry.location.lng() });
            }}
            options={{
              types: ["address"],
              componentRestrictions: { country: "us" },
            }}
            defaultValue={address}
          />
        </div>
        <div>
          <Label>Main Sqft</Label>
          <TextInput
            required
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.valueAsNumber)}
            disabled={currentOrganization?.type === "vendor" || currentOrganization?.type === "supplier"}
          />
        </div>
        <div>
          <Label htmlFor="comment">Access Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Please give detailed instructions..."
            required
            rows={4}
            value={accessInstructions}
            onChange={(e) => setAccessInstructions(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="comment">Description</Label>
          <Textarea
            id="comment"
            placeholder="Please give a detailed description..."
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={currentOrganization?.type === "vendor" || currentOrganization?.type === "supplier"}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleCreateOrder}>Save</Button>
        </div>
      </div>
    </section>
  );
}
