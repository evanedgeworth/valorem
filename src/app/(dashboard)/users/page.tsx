"use client";

import { useMemo } from "react";

import { useUserContext } from "@/context/userContext";
import request from "@/utils/request";
import { UserOrganization } from "@/types";
import { useQuery } from "@tanstack/react-query";
import TableData from "@/components/table-data";
import AddUserModal from "./components/add-user-modal";

export default function UserPage() {
  const { selectedOrganization, role } = useUserContext();

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['users', selectedOrganization?.organizationId],
    queryFn: async () => {
      const res = await request({
        url: `/user_organizations`,
        method: "GET",
        params: {
          id: selectedOrganization?.organizationId,
          filterType: "organization",
          includeRoles: true,
          includeUsers: true
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId)
  });

  const userOrganizations: UserOrganization[] = useMemo(() => {
    const result: UserOrganization[] = data?.userOrganizations || [];
    return result;
  }, [data?.userOrganizations]);

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Users</h5>
        <AddUserModal />
      </div>

      <TableData
        isLoading={tableIsLoading || !Boolean(selectedOrganization?.organizationId)}
        data={userOrganizations.map((item) => ({ ...item, id: `${item.organizationId}-${item.userId}-${item.roleId}` }))}
        columns={[
          {
            label: "USER",
            key: "user",
            render: (value) => value ? `${value.firstName} ${value.lastName}` : ''
          },
          {
            label: "USER ROLE",
            key: "role",
            render: (value) => value?.roleName
          },
          {
            label: "EMAIL",
            key: "user",
            render: (value) => value ? `${value.email}` : ''
          },
        ]}
      />
    </section>
  );
}
