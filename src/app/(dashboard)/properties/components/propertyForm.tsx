import { Button, Label, TextInput, Select, Textarea, Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { states } from "@/utils/defaults";
import formatGoogleAddressComponents from "@/utils/formatGoogleAddressComponents";
import AddressInput from "./address-input";
import ImageInput from "./image-input";

export type Image = {
  data: any;
  url: string;
}

export type PropertyInput = {
  name: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  state: string;
  noOfRooms: number;
  accessContact: string;
  type: string;
  accessInstructions: string;
  frontImages: Image[];
  backImages: Image[];
  leftImages: Image[];
  rightImages: Image[];
};

type PropertyFormProps = {
  onSubmit: (value: PropertyInput) => void;
  isLoading: boolean;
  defaultValues?: Partial<PropertyInput>;
  onClose?: () => void;
  isEdit?: boolean;
}

const propertyTypes = ["single family home", "multi family home"];

export default function PropertyForm({ onSubmit, isLoading, defaultValues, isEdit, onClose }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyInput>({ defaultValues });

  const address1 = watch('address1');
  const frontImages = watch('frontImages');
  const backImages = watch('backImages');
  const leftImages = watch('leftImages');
  const rightImages = watch('rightImages');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== "Backspace" && key !== "ArrowLeft" && key !== "ArrowRight") {
      event.preventDefault();
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 h-[calc(100vh-300px)] overflow-auto">
        <div>
          <Label htmlFor="address">Address Line 1</Label>
          <AddressInput
            onChange={(place: any) => {
              const formattedAddress = formatGoogleAddressComponents(place);
              setValue('address1', formattedAddress.addressLine1);
              setValue('address2', formattedAddress.addressLine2);
              setValue('city', formattedAddress.city);
              setValue('postalCode', formattedAddress.zipCode);
              setValue('state', formattedAddress.state);
            }}
            value={address1}
          />
        </div>
        <div>
          <Label>Addres Line 2</Label>
          <TextInput type="string" {...register("address2")} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>City</Label>
            <TextInput type="string" {...register("city")} required />
          </div>
          <div>
            <Label>State</Label>
            <Select id="state" required {...register("state")}>
              {states.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Zip Code</Label>
            <TextInput type="string" {...register("postalCode")} required />
          </div>
        </div>
        <div>
          <Label>Property Name or ID</Label>
          <TextInput type="string" {...register("name")} required />
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
          <Label>Number of Rooms</Label>
          <TextInput min={0} onKeyDown={handleKeyDown} type="number" {...register("noOfRooms")} required />
        </div>
        <div>
          <Label>Access Contact</Label>
          <TextInput type="string" {...register("accessContact")} required />
        </div>
        <div id="textarea">
          <Label htmlFor="comment">Access Instructions</Label>
          <Textarea placeholder="Please give detailed instructions..." rows={4} {...register("accessInstructions")} />
        </div>
        {
          !isEdit && (
            <>
              <div>
                <Label>Front Images</Label>
                <ImageInput value={frontImages} onChange={(value) => setValue('frontImages', value)} />
              </div>
              <div>
                <Label>Back Images</Label>
                <ImageInput value={backImages} onChange={(value) => setValue('backImages', value)} />
              </div>
              <div>
                <Label>Left Images</Label>
                <ImageInput value={leftImages} onChange={(value) => setValue('leftImages', value)} />
              </div>
              <div>
                <Label>Right Images</Label>
                <ImageInput value={rightImages} onChange={(value) => setValue('rightImages', value)} />
              </div>
            </>
          )
        }
      </div>
      <div className="flex gap-4 mt-4">
        <Button disabled={isLoading} type="submit" fullSized>
          {isLoading ? <Spinner size="xs" /> : isEdit ? "Save" : "Create Property +"}
        </Button>
        <Button type="button" onClick={onClose} fullSized color={"light"}>
          Close
        </Button>
      </div>
    </form>
  )
}
