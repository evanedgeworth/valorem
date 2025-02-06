import { useUserContext } from "@/context/userContext";
import { Property, UserOrganization } from "@/types";
import request from "@/utils/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Popover, Spinner, TextInput } from "flowbite-react";
import { useMemo, useState } from "react";
import { TiUserAddOutline } from "react-icons/ti";
import { useToast } from "@/context/toastContext";
import { getFullName, getInitials } from "@/utils/commonUtils";
import classNames from "classnames";

function ListUser({ property, close }: { property: Property; close: () => void }) {
  const { selectedOrganization } = useUserContext();
  const [searchInput, setSearchInput] = useState<string>("");
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user_organizations"],
    queryFn: async () => {
      const res = await request({
        url: `/user_organizations`,
        method: "GET",
        params: {
          // id: selectedOrganization?.organizationId,
          filterType: "user",
          includeRoles: true,
          includeUsers: true,
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId),
  });

  const items: UserOrganization[] = useMemo(() => {
    const result: UserOrganization[] = data?.userOrganizations || [];
    return result.filter(
      (item) =>
        ["JUNIOR PROJECT MANAGER", "PROJECT MANAGER"].includes(item.role?.roleName || "") &&
        (searchInput ? item.name.toLowerCase().includes(searchInput.toLowerCase()) : true)
    );
  }, [data?.userOrganizations, searchInput]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { assigneeId: string }) => {
      const res = await request({
        url: `/properties/${property.id}/assign`,
        method: "PATCH",
        data: {
          assigneeId: data.assigneeId,
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    onSuccess: () => {
      showToast("Successfully assign user", "success");
      queryClient.refetchQueries({ queryKey: ["properties"] });
      close();
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return (
    <div className="p-4">
      <TextInput placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
      <div className="mt-2">
        {isLoading || isPending ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          items.map((item) => (
            <div
              className="hover:bg-gray-100 focus:bg-gray-100"
              key={`${item.organizationId}-${item.userId}-${item.roleId}`}
              onClick={() => {
                mutate({ assigneeId: item.userId });
              }}
            >
              <div className="flex gap-1 items-center cursor-pointer py-1 ">
                <Avatar placeholderInitials={getInitials(getFullName(item.user))} img={item.user?.profileImage?.fileUrl} rounded size="xs" />
                <div className="flex flex-col">
                  <p>{getFullName(item.user)}</p>
                  <p>{item.user?.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type AssignProjectManagerProps = {
  property: Property;
  isAssignmentAllowed?: boolean;
};

export default function AssignProjectManager({ property, isAssignmentAllowed }: AssignProjectManagerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      {property.assignee && (
        <Popover
          placement="top"
          content={
            <div className="flex gap-1 items-center p-2">
              <Avatar rounded size="md" placeholderInitials={getInitials(getFullName(property.assignee))} />
              <p>{getFullName(property.assignee)}</p>
            </div>
          }
        >
          <div>
            <Avatar rounded size="md" className="-mr-3" placeholderInitials={getInitials(getFullName(property.assignee))} />
          </div>
        </Popover>
      )}
      {isAssignmentAllowed && (
        <Popover content={<ListUser property={property} close={() => setOpen(false)} />} open={open} onOpenChange={setOpen}>
          <button className={classNames("bg-gray-300 z-[1] h-8 w-8 rounded-full flex items-center justify-center")}>
            <TiUserAddOutline size={22} />
          </button>
        </Popover>
      )}
    </div>
  );
}
