import { ImageFile, RoomType } from "@/types";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ImageInput from "./image-input";
import { DeleteIcon } from "@/components/icon";

export type RoomInput = {
    name: string;
    roomImages: ImageFile[];
    type: RoomType;
}

type RoomFormInput = {
  rooms: RoomInput[];
}

type RoomFormProps = {
  rooms: RoomInput[];
  onSubmit: (value: RoomFormInput) => void;
  isLoading: boolean;
  onClose: () => void;
}

export default function RoomForm({
  rooms,
  onSubmit,
  isLoading,
  onClose,
}: RoomFormProps) {

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<RoomFormInput>({ defaultValues: { rooms } });


  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rooms',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl">Areas</p>
        <Button
          color="gray"
          onClick={() => append({ name: `Room ${fields.length}`, type: RoomType.BEDROOM, roomImages: [] })}
        >
          Add Area
        </Button>
      </div>
      <div>
        {
          fields.map((room, index) => (
            <Card key={room.name + index} className="mb-2 relative">
              <button
                className="absolute top-3 right-3"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </button>
              <div className="space-y-2">
                <div>
                  <Label>Name</Label>
                  <Controller
                    name={`rooms.${index}.name`}
                    control={control}
                    render={({ field }) => <TextInput {...field} placeholder="Name" />}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Controller
                    name={`rooms.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        {Object.values(RoomType).map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Images</Label>
                  <Controller
                    name={`rooms.${index}.roomImages`}
                    control={control}
                    render={({ field }) => (
                      <ImageInput value={field.value} onChange={(value) => setValue(`rooms.${index}.roomImages`, value)} />
                    )}
                  />
                </div>
              </div>
            </Card>
          ))
        }
      </div>
      <div className="flex gap-4 mt-4">
        <Button type="button" onClick={onClose} fullSized outline color="gray">
          Close
        </Button>
        <Button disabled={isLoading} isProcessing={isLoading} type="submit" fullSized color="gray">
          {"Save"}
        </Button>
      </div>
    </form>
  );
}