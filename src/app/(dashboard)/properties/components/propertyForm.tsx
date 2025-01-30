import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
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
  noOfRooms: string;
  noOfBathrooms: string;
  accessContact: string;
  type: string;
  notes: string;
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

const propertyTypes = ["SINGLE_UNIT", "MULTI_UNIT", "COMMERCIAL"];
const roomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 h-[calc(100vh-300px)] overflow-auto px-1">
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
          <Label htmlFor="type" value="Select your type" />
          <Select id="type" required {...register("type")}>
            {propertyTypes.map((item) => (
              <option value={item} key={item}>
                {item.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="noOfRooms">Number of Rooms</Label>
          <Select id="noOfRooms" required {...register("noOfRooms")}>
            {roomOptions.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="noOfBathrooms">Number of Bathrooms</Label>
          <Select id="noOfBathrooms" required {...register("noOfBathrooms")}>
            {roomOptions.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="accessInstructions">Access Instructions</Label>
          <Textarea id="accessInstructions" placeholder="" rows={4} {...register("accessInstructions")} />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="" rows={4} {...register("notes")} />
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
        <Button type="button" onClick={onClose} fullSized outline>
          Close
        </Button>
        <Button disabled={isLoading} isProcessing={isLoading} type="submit" fullSized>
          {isEdit ? "Save" : "Create Property +"}
        </Button>
      </div>
    </form>
  )
}
