import MultiSelect from "@/components/multi-select";
import { useUserContext } from "@/context/userContext";
import { GroupedMarket, Market, OrganizationRole, Role, UserOrganization } from "@/types";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function FilterUserModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void, onSubmit: (filter: string) => void }) {

  const [statuses, setStatuses] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);

  const { selectedOrganization } = useUserContext();

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await request({
        url: `/roles`,
        method: "GET",
        params: {
          organizationType: "VALOREM",
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId) && open,
  });

  const roleList: OrganizationRole[] = data?.roles || [];


  const organizationQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await request({
        url: `/user_organizations?organizationsOnly=true`,
        method: "GET",
        params: {
          organizationType: "VALOREM",
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId) && open,
  });

  const organizationList: UserOrganization[] = organizationQuery.data?.userOrganizations || [];

  const marketQuery = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await request({
        url: `/markets?groupedBy=city`,
        method: "GET",
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId) && open,
  });

  const marketList: GroupedMarket[] = marketQuery.data?.groupedMarkets || [];

  const handleReset = () => {
    setRoles([]);
    setStatuses([]);
  }

  const handleSubmit = () => {
    const marketValue: Market[] = [];
    marketList.forEach(item => {
      if (markets.includes(item.key)) {
        marketValue.push(...item.value)
      }
    });

    console.log(marketValue, markets)
    const filters = JSON.stringify({
      organizations, markets: marketValue.map(item => item.id), roles, statuses
    });
    const encodedFilters = encodeURIComponent(filters);
    onSubmit(encodedFilters);
  }

  return (
    <Modal show={open} size="md" onClose={() => onClose()} dismissible>
      <Modal.Header className="items-center px-6 pt-4">
        <h3 className="text-xl font-medium">Filter</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="grid gap-4">
          <MultiSelect
            label="Organization"
            options={organizationList.map((item) => ({ value: item.organizationId, label: item.name || '' }))}
            onChange={(values) => setOrganizations(values)}
            placeholder="Select all organizations"
            defaultValues={organizations}
          />
          <MultiSelect
            label="User role"
            options={roleList.map((item) => ({ value: item.roleId, label: item.roleName }))}
            onChange={(value) => setRoles(value)}
            placeholder="Select all roles"
            defaultValues={roles}
          />
          <MultiSelect
            label="Market"
            options={marketList.map((item) => ({ value: item.key, label: item.key }))}
            onChange={(value) => setMarkets(value)}
            placeholder="Select all markets"
          />
          <MultiSelect
            label="Status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'PENDING', label: 'Pending' },
            ]}
            onChange={(value) => setStatuses(value)}
            placeholder="Select all statuses"
            defaultValues={statuses}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={handleSubmit}>Submit</Button>
        <Button color="gray" outline onClick={handleReset}>Reset</Button>
      </Modal.Footer>
    </Modal>
  );
}
