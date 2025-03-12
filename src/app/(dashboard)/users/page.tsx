"use client";

import { useMemo, useRef, useState } from "react";

import { useUserContext } from "@/context/userContext";
import request from "@/utils/request";
import { UserOrganization } from "@/types";
import { useQuery } from "@tanstack/react-query";
import TableData, { TableAction } from "@/components/table-data";
import AddUserModal from "./components/add-user.modal";
import { checkPermission, getFullName } from "@/utils/commonUtils";
import { ViewUserModal } from "./components/view-user.modal";
import UserRole from "./components/user-role";
import { Button, Label, TextInput } from "flowbite-react";
import { FaFilter } from "react-icons/fa";
import FilterUserModal from "./components/filter-user.modal";
import { Pagination } from "flowbite-react";
import ReviewUserModal from "./components/review-user.modal";
import UserStatus from "@/components/userStatus";

export default function UserPage() {
  const { selectedOrganization, role } = useUserContext();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [filters, setFilters] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [previousTokens, setPreviousTokens] = useState<string[]>([]);
  const nextToken = previousTokens[currentPage - 2] || null;

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['users', selectedOrganization?.organizationId, nextToken, filters],
    queryFn: async () => {
      const res = await request({
        url: `/user_organizations`,
        method: "GET",
        params: {
          filters,
          id: selectedOrganization?.type === "VALOREM" ? undefined : selectedOrganization?.organizationId,
          filterType: selectedOrganization?.type === "VALOREM" ? undefined : "organization",
          includeRoles: true,
          includeUsers: true,
          pageSize: 10,
          nextToken
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId)
  });

  const onPageChange = (page: number) => {
    if (page > currentPage && data?.nextToken) {
      setPreviousTokens((prev) => [...prev, data.nextToken]);
    }
    setCurrentPage(page);
  };

  const userOrganizations: UserOrganization[] = useMemo(() => {
    const result: UserOrganization[] = data?.userOrganizations || [];
    return result.filter((item) => {
      const fullName = getFullName(item.user);
      return searchInput ? fullName.toLowerCase().includes(searchInput.toLowerCase()) : true;
    });
  }, [data?.userOrganizations, searchInput]);

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

    if (selectedOrganization?.type === "VALOREM") {
      result.push({
        label: "Review",
        onClick: (row) => {
          selectedUserOrganization.current = row;
          setShowReviewModal(true);
        },
      });
    }

    return result;
  }, [role, selectedOrganization]);

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Users</h5>
        {
          selectedOrganization?.type === "VALOREM" && (
            <AddUserModal />
          )
        }
      </div>
      <div className="flex gap-4 mb-4 justify-between">
        <div className="max-w-md">
          <TextInput placeholder="Search for user" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
        </div>
        <div className="flex gap-2 items-end">
          <Button outline color="gray" size="sm" onClick={() => setShowFilterModal(true)}>
            <div className="flex items-center gap-1">
              <FaFilter /> Filter
            </div>
          </Button>
        </div>
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
            render: (value) => <div className="flex"><UserRole role={value?.roleName} /></div>
          },
          {
            label: "EMAIL",
            key: "user",
            render: (value) => value ? `${value.email}` : ''
          },
          {
            label: "STATUS",
            key: "user",
            render: (value) => value ? (
              <UserStatus status={value.status} />
            ) : ''
          },
        ]}
        actions={actions}
      />
      {
        (previousTokens.length > 0 || data?.nextToken) && (
          <div className="flex justify-end">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={data?.nextToken ? currentPage + 1 : currentPage}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        )
      }
      <ViewUserModal
        onClose={() => setShowViewModal(false)}
        open={showViewModal}
        userOrganization={selectedUserOrganization.current}
      />
      <FilterUserModal
        onClose={() => setShowFilterModal(false)}
        open={showFilterModal}
        onSubmit={(filter) => {
          setFilters(filter);
          setShowFilterModal(false);
          setPreviousTokens([]);
          setCurrentPage(1);
        }}
      />
      <ReviewUserModal
        onClose={() => setShowReviewModal(false)}
        open={showReviewModal}
        userOrganization={selectedUserOrganization.current}
        onSuccess={() => {
          refetch();
        }}
      />
    </section>
  );
}
