import { useState, useEffect } from "react";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { Scope } from "@/types";
import { useMutation } from "@tanstack/react-query";
import request from "@/utils/request";

export default function Settings({ order, refetch }: { order: Scope, refetch: () => void }) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (order) {
      setName(order.projectName || "");
      setDescription(order.additionalDetails || "");
    }
  }, [order]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope/${order.id}`,
        method: 'PUT',
        data: body
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess(data, variables, context) {
      refetch();
    },
  });

  async function handleSave() {
    mutate({ projectName: name, additionalDetails: description });
  }

  return (
    <section className="p-5">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Order Settings</h1>
      <div className="flex flex-col gap-2">
        <div>
          <Label>Project Name</Label>
          <TextInput
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          />
        </div>

        <div className="flex justify-end">
          <Button disabled={isPending} onClick={handleSave}>Save</Button>
        </div>
      </div>
    </section>
  );
}
