import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import { states } from "@/utils/defaults";

export type PropertyInput = {
  name: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  state: string;
  size: number;
  type: string;
  accessInstructions: string;
};

type PropertyFormProps = {
  onSubmit: (value: PropertyInput) => void;
  isLoading: boolean;
  defaultValues?: Partial<PropertyInput>;
  onClose?: () => void;
  isEdit?: boolean;
}

const propertyTypes = ["Single-family home", "Townhouses/Row houses", "Condominium", "Apartment", "Multi-family home"];


export default function PropertyForm({ onSubmit, isLoading, defaultValues, isEdit, onClose }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyInput>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="address">Address Line 1</Label>
          <TextInput type="string" {...register("address1")} required />
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
          <Label>Size sq/ft</Label>
          <TextInput type="number" {...register("size")} required />
        </div>
        <div id="textarea">
          <Label htmlFor="comment">Access Instructions</Label>
          <Textarea placeholder="Please give detailed instructions..." rows={4} {...register("accessInstructions")} />
        </div>
        <div className="flex gap-4">
          <Button disabled={isLoading} type="submit" fullSized>
            { isEdit ? "Save" : "Create Property +" }
          </Button>
          <Button type="button" onClick={onClose} fullSized color={"light"}>
            Close
          </Button>
        </div>
      </div>
    </form>
  )
}
