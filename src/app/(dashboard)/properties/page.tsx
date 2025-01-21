"use client";

import { Table, Dropdown, TextInput, Spinner, Label, Button } from "flowbite-react";
import { useState, useRef, Fragment, useContext, useMemo } from "react";
import moment from "moment";
import Map from "./components/map";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/userContext";
import NewPropertyModal from "./components/newProperty.modal";
import ConfirmationModal from "@/components/confirmation.modal";
import EditPropertyModal from "./components/editProperty.modal";
import { FaList, FaMapMarkedAlt } from "react-icons/fa";
import ViewPropertyModal from "./components/view-property.modal";
import request from "@/utils/request";
import { Property } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkPermission, parseAddress } from "@/utils/commonUtils";
import { useToast } from "@/context/toastContext";
import Link from "next/link";
import ScopeRequestModal from "./components/scopeRequest.modal";
import { BiPlus } from "react-icons/bi";
import classNames from 'classnames';
import { DeleteIcon, DetailsIcon, EditIcon, ViewIcon } from "@/components/icon";

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

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await request({
        url: `/properties`,
        method: "GET",
        params: {
          // organizationId: selectedOrganization?.organizationId,
          organizationId: "4dbde905-98d2-4428-aca0-6357c97286c9",
          includeOrdersCount: true,
          includeAssignee: true,
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId)
  });

  const properties: Property[] = useMemo(() => {
    const result: Property[] = data?.properties || [];
    return result.filter(item => searchInput ? item.name.toLowerCase().includes(searchInput.toLowerCase()) : true);
  }, [data?.properties, searchInput]);

  const getProperties = async () => {
    await refetch();
  }

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
      showToast(res.data.message, 'success');
      queryClient.setQueryData(['properties'], (old: any) => ({ ...old, properties: [...old.properties].filter(item => item.id !== propertyId) }))
    }
  }

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between items-center mb-4 bg-gray-800 p-4 border-b-gray-900 border-b">
        <div>
          <h5 className="text-lg font-medium">Properties</h5>
          <div className="flex gap-2 mt-2">
            <a className={classNames({ "cursor-pointer": true, "border-b-white border-b": selectedTab === 'List' })} onClick={() => handleTabChange("List")}>List</a>
            <a className={classNames({ "cursor-pointer": true, "border-b-white border-b": selectedTab === 'Map' })} onClick={() => handleTabChange("Map")}>Map</a>
          </div>
        </div>
        {checkPermission(role, "properties_create") && <NewPropertyModal showModal={showModal} setShowModal={setShowModal} />}
      </div>

      {selectedTab === "List" ? (
        tableIsLoading ? (
          <div className=" ml-auto mr-auto mt-72 text-center">
            <Spinner size="xl" />
          </div>
        ) : properties.length !== 0 ? (
          <Table striped className="w-full">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Created Date</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Orders</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {properties.map((property) => (
                <Fragment key={property.id}>
                  <Table.Row>
                    <Table.Cell>{property.id}</Table.Cell>
                    <Table.Cell>
                      {property.name}
                    </Table.Cell>
                    <Table.Cell>
                      {parseAddress(property.address)}
                    </Table.Cell>
                    <Table.Cell>
                      {moment(property.createdAt).format("MMM DD, YYYY")}
                    </Table.Cell>
                    <Table.Cell>{property.type}</Table.Cell>
                    <Table.Cell>
                      {property?.orderCount}
                    </Table.Cell>

                    <Table.Cell>
                      <div className="relative cursor-pointer">
                        <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-120px] !top-6">
                          {checkPermission(role, "orders_create") && (
                            <Dropdown.Item
                              onClick={() => {
                                selectedProperty.current = property;
                                setShowRequestModal(true);
                              }}

                              icon={() => <BiPlus size={18} />}
                            >
                              Request Scope
                            </Dropdown.Item>
                          )}
                          {checkPermission(role, "properties_view") && (
                            <Dropdown.Item
                              onClick={() => {
                                selectedProperty.current = property;
                                setShowViewModal(true);
                              }}
                              icon={DetailsIcon}
                            >
                              View
                            </Dropdown.Item>
                          )}
                          {checkPermission(role, "properties_view") && (
                            <Dropdown.Item
                              icon={ViewIcon}
                              as={Link}
                              href={`/properties/${encodeURIComponent(property.id)}`}
                            >
                              Details
                            </Dropdown.Item>
                          )}
                          {checkPermission(role, "properties_update") && (
                            <Dropdown.Item
                              onClick={() => {
                                selectedProperty.current = property;
                                setShowEditModal(true);
                              }}
                              icon={EditIcon}
                            >
                              Edit
                            </Dropdown.Item>
                          )}
                          {checkPermission(role, "properties_delete") && (
                            <Dropdown.Item
                              onClick={() => {
                                setShowDeleteConfirmModal(true);
                                selectedProperty.current = property;
                              }}
                              className="text-red-500"
                              icon={DeleteIcon}
                            >
                              Delete
                            </Dropdown.Item>
                          )}
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Fragment>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="mx-auto my-24">
            <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white text-center">No Results</h5>
            <p className="mb-2 text-sm text-gray-400 dark:text-white text-center">There are currently no products.</p>
          </div>
        )
      ) : (
        <></>
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
      <ScopeRequestModal
        setShowModal={setShowRequestModal}
        showModal={showRequestModal}
        property={selectedProperty.current}
      />
    </section>
  );
}
