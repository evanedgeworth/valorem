"use client";

import { TextInput, Label, Button, Spinner } from "flowbite-react";
import { useState, useRef, useContext, useMemo } from "react";
import moment from "moment";
import Map from "./components/map";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/userContext";
import NewPropertyModal from "./components/newProperty.modal";
import ConfirmationModal from "@/components/confirmation.modal";
import EditPropertyModal from "./components/editProperty.modal";
import { FaList, FaMapMarkedAlt } from "react-icons/fa";
import ViewPropertyModal from "./components/view-property.modal";
import request from "@/utils/request";
import { Address, Property } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkPermission, parseAddress } from "@/utils/commonUtils";
import { useToast } from "@/context/toastContext";
import ScopeRequestModal from "./components/scopeRequest.modal";
import AssignProjectManager from "./components/assing-project-manager";
import TableData, { TableAction } from "@/components/table-data";
import ImportModal from "@/components/import.modal";

export default function Properties() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "address">("createdAt");
  const selectedProperty = useRef<Property | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const router = useRouter();
  const { selectedOrganization, role } = useContext(UserContext);
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("view") || "List";
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false);
  const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
  const [errorImport, setErrorImport] = useState<Record<string, string>[]>([]);

  const isAssignmentAllowed = checkPermission(role, "properties_assign");

  const {
    data,
    isLoading: tableIsLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["properties", selectedOrganization?.organizationId],
    queryFn: async () => {
      let params;
      switch (role?.roleName) {
        case "CLIENT":
          params = {
            organizationId: selectedOrganization?.organizationId,
            includeOrdersCount: true,
            includeAssignee: true,
            all: true,
          };
          break;
        case "SENIOR PROJECT MANAGER":
        case "SENIOR_PROJECT_MANAGER":
          params = {
            includeOrdersCount: true,
            includeAssignee: true,
            all: true,
          };
          break;
        default:
          params = {
            includeOrdersCount: true,
            includeAssignee: true,
            assigneeId: selectedOrganization?.userId,
            all: true,
          };
          break;
      }

      const res = await request({
        url: `/properties`,
        method: "GET",
        params,
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId && role),
  });

  const properties: Property[] = useMemo(() => {
    const result: Property[] = data?.properties || [];
    return result.filter((item) => (searchInput ? item.name?.toLowerCase().includes(searchInput.toLowerCase()) : true));
  }, [data?.properties, searchInput]);

  function handleTabChange(selectedTab: string) {
    router.push(`${pathname}/?view=${selectedTab}`);
  }

  async function handleRemoveProperty() {
    let propertyId = selectedProperty.current?.id || "";
    setIsLoadingDelete(true);
    const res = await request({
      url: `/properties/${propertyId}`,
      method: "DELETE",
    });

    setIsLoadingDelete(false);
    setShowDeleteConfirmModal(false);
    if (res?.status === 200) {
      showToast(res.data.message, "success");
      queryClient.setQueryData(["properties"], (old: any) => ({ ...old, properties: [...old.properties].filter((item) => item.id !== propertyId) }));
    }
  }

  const actions = useMemo(() => {
    const result: TableAction<Property>[] = [];
    if (checkPermission(role, "orders_create")) {
      result.push({
        label: "Request Scope",
        onClick: (row) => {
          selectedProperty.current = row;
          setShowRequestModal(true);
        },
      });
    }

    if (checkPermission(role, "properties_view")) {
      result.push({
        label: "View",
        onClick: (row) => {
          selectedProperty.current = row;
          setShowViewModal(true);
        },
      });
    }

    if (checkPermission(role, "properties_view")) {
      result.push({
        label: "Details",
        link: (row) => `/properties/${encodeURIComponent(row.id)}`,
      });
    }

    if (checkPermission(role, "properties_update")) {
      result.push({
        label: "Edit",
        onClick: (row) => {
          selectedProperty.current = row;
          setShowEditModal(true);
        },
      });
    }

    if (checkPermission(role, "properties_delete")) {
      result.push({
        label: "Delete",
        onClick: (row) => {
          selectedProperty.current = row;
          setShowDeleteConfirmModal(true);
        },
      });
    }

    return result;
  }, [role]);

  const handleImport = async (items: Record<string, string>[]) => {
    const errorItem: Record<string, string>[] = [];
    setIsLoadingImport(true);

    for (const item of items) {
      const res = await request({
        url: `/properties`,
        method: "POST",
        data: {
          name: item.name,
          organizationId: selectedOrganization?.organizationId,
          accessInstructions: item.accessInstructions,
          notes: item.notes,
          type: item.type,
          noOfRooms: Number(item.noOfRooms),
          noOfBathrooms: Number(item.noOfBathrooms),
          address: {
            address1: item.address1,
            address2: item.address2,
            city: item.city,
            state: item.state,
            postalCode: item.postalCode,
          },
        },
      });

      if (res?.status !== 200) {
        errorItem.push({
          ...item,
          error: res?.data?.message,
        });
      }
    }
    setIsLoadingImport(false);
    refetch();
    if (errorItem.length === 0) {
      setIsOpenImport(false);
      showToast("Successfully imported data.", "success");
    } else {
      setErrorImport(errorItem);
    }
  };

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Properties</h5>
        <div className="flex gap-2">
          {checkPermission(role, "properties_create") && (
            <Button outline color="gray" onClick={() => setIsOpenImport(true)}>
              Import
            </Button>
          )}
          {checkPermission(role, "properties_create") && <NewPropertyModal showModal={showModal} setShowModal={setShowModal} />}
        </div>
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="search" value="Search" />
          </div>
          <TextInput placeholder="Name" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
        </div>

        <Button.Group>
          <Button color="gray" value={"List"} onClick={() => handleTabChange("List")}>
            <FaList className="mr-3 h-4 w-4" />
            List
          </Button>
          <Button color="gray" value={"Map"} onClick={() => handleTabChange("Map")}>
            <FaMapMarkedAlt className="mr-3 h-4 w-4" />
            Map
          </Button>
        </Button.Group>
      </div>
      {selectedTab === "List" && (
        <TableData
          data={properties}
          isLoading={tableIsLoading || !Boolean(selectedOrganization?.organizationId)}
          columns={[
            { label: "ID", key: "id" },
            { label: "Name", key: "name" },
            { label: "Address", key: "address", render: (value: Address) => parseAddress(value) },
            { label: "Created Date", key: "createdAt", render: (value: string) => moment(value).format("MMM DD, YYYY") },
            { label: "Type", key: "type", render: (value: string) => value?.replaceAll("_", " ") },
            {
              label: "PM",
              key: "id",
              render: (value: string, row: Property) => <AssignProjectManager property={row} isAssignmentAllowed={isAssignmentAllowed} />,
            },
            { label: "Orders", key: "orderCount" },
          ]}
          actions={actions}
        />
      )}
      {selectedTab === "Map" && <Map properties={properties} />}

      <EditPropertyModal showModal={showEditModal} setShowModal={setShowEditModal} property={selectedProperty.current} />
      <ViewPropertyModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        property={selectedProperty.current}
        showEditModal={() => {
          setShowEditModal(true);
          setShowViewModal(false);
        }}
      />
      <ConfirmationModal
        showModal={showDeleteConfirmModal}
        setShowModal={setShowDeleteConfirmModal}
        title="Delete Property"
        description="Are you sure you would like to remove this property? This action is permanent."
        handleCancel={() => setShowDeleteConfirmModal(false)}
        handleConfirm={handleRemoveProperty}
        isLoading={isLoadingDelete}
      />
      <ScopeRequestModal setShowModal={setShowRequestModal} showModal={showRequestModal} property={selectedProperty.current} />
      <ImportModal
        showModal={isOpenImport}
        setShowModal={(v) => {
          setIsOpenImport(v);
          setErrorImport([]);
        }}
        onSubmit={(data) => {
          handleImport(data);
        }}
        options={["name", "accessInstructions", "notes", "type", "noOfRooms", "noOfBathrooms", "address1", "address2", "city", "state", "postalCode"]}
        requiredOptions={["name", "accessInstructions", "notes", "type", "noOfRooms", "noOfBathrooms", "address1", "city", "state", "postalCode"]}
        isLoading={isLoadingImport}
        errors={errorImport}
      />
    </section>
  );
}
