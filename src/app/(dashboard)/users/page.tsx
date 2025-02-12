"use client";

import { useMemo, useRef, useState } from "react";

import { useUserContext } from "@/context/userContext";
import request from "@/utils/request";
import { UserOrganization } from "@/types";
import { useQuery } from "@tanstack/react-query";
import TableData, { TableAction } from "@/components/table-data";
import AddUserModal from "./components/add-user-modal";
import { checkPermission } from "@/utils/commonUtils";
import { ViewUserModal } from "./components/view-user.modal";

export default function UserPage() {
  const { selectedOrganization, role } = useUserContext();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['users', selectedOrganization?.organizationId],
    queryFn: async () => {
      const res = await request({
        url: `/user_organizations`,
        method: "GET",
        params: {
          id: selectedOrganization?.type === "VALOREM" ? undefined : selectedOrganization?.organizationId,
          filterType: "organization",
          includeRoles: true,
          includeUsers: true,
          pageSize: 20
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

  const selectedUserOrganization = useRef<UserOrganization | null>(null);

  const actions = useMemo(() => {
    const result: TableAction<UserOrganization>[] = [];

    if (checkPermission(role, "profiles_view")) {
      result.push({
        label: "Details",
        onClick: (row) => {
          selectedUserOrganization.current = row;
          setShowViewModal(true);
        }
      });
    }

    return result;
  }, [role]);

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
        actions={actions}
      />
      <ViewUserModal
        onClose={() => setShowViewModal(false)}
        open={showViewModal}
        userOrganization={selectedUserOrganization.current}
      />
    </section>
  );
}
