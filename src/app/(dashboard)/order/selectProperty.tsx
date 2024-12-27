import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Label, Select } from "flowbite-react";
import { useContext } from "react";

interface SelectProps {
  onChange: (value: string) => void
}

export default function SelectProperty(props: SelectProps) {
  const { selectedOrganization } = useContext(UserContext);

  const { data } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await request({
        url: `/properties`,
        method: "GET",
        params: {
          organizationId: selectedOrganization?.organizationId,
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId)
  });

  const properties = data?.properties || [];

  return (
    <div>
      <Label>Property</Label>
      <Select
        onChange={(e) => {
          props.onChange?.(e.target.value);
        }}
      >
        <option value="-">Select Property</option>
        {properties.map((item: any) => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
    </div>
  );
}