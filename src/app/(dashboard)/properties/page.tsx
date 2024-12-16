"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label, Button, Tabs } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext, useMemo } from "react";
import moment from "moment";
import Map from "./components/map";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiSortDown } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import NewPropertyModal from "./components/newProperty.modal";
import ConfirmationModal from "@/components/confirmation.modal";
import EditPropertyModal from "./components/editProperty.modal";
import { FaList, FaMapMarkedAlt } from "react-icons/fa";
import ViewPropertyModal from "./components/view-property.modal";
import request from "@/utils/request";
import { Property } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { parseAddress } from "@/utils/commonUtils";


export default function Properties() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "address">("createdAt");
  const selectedProperty = useRef<Property | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const router = useRouter();
  const { selectedOrganization, role, isClientRole } = useContext(UserContext);
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("view") || "List";

  const { data, isLoading: tableIsLoading, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await request({
        url: `/properties`,
        method: "GET",
        params: { organizationId: selectedOrganization?.organizationId, includeOrdersCount: true },
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

  const getProperties = () => {
    refetch();
  }

  function handleTabChange(selectedTab: string) {
    router.push(`${pathname}/?view=${selectedTab}`);
  }


  async function handleRemoveProperty() {
    let property_id = selectedProperty.current?.id || "";
    await request({
      url: `/properties`,
      method: "DELETE",
      params: {
        id: property_id,
      },
    });

    setShowDeleteConfirmModal(false);
    getProperties();
  }

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Properties</h5>
        {isClientRole && <NewPropertyModal showModal={showModal} setShowModal={setShowModal} refresh={getProperties} />}
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="search" value="Search" />
          </div>
          <TextInput placeholder="Name" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
        </div>

        {/* <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
          <Dropdown.Header>
            <strong>Sort By</strong>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setSortBy("address")}>Address</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("createdAt")}>Creation Date</Dropdown.Item>
        </Dropdown>
        <Button.Group>
          <Button color="gray" value={"List"} onClick={() => handleTabChange("List")}>
            <FaList className="mr-3 h-4 w-4" />
            List
          </Button>
          <Button color="gray" value={"Map"} onClick={() => handleTabChange("Map")}>
            <FaMapMarkedAlt className="mr-3 h-4 w-4" />
            Map
          </Button>
        </Button.Group> */}
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
              {isClientRole && <Table.HeadCell></Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {properties.map((property) => (
                <Fragment key={property.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="p-4 cursor-pointer">{property.id}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {property.name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {parseAddress(property.address)}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {moment(property.createdAt).format("MMM DD, YYYY")}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{property.type}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {property?.orderCount}
                    </Table.Cell>

                    {isClientRole && (
                      <Table.Cell className="flex justify-end">
                        <div className="relative cursor-pointer">
                          <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                            <Dropdown.Item
                              onClick={() => {
                                selectedProperty.current = property;
                                setShowViewModal(true);
                              }}
                            >
                              View
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                selectedProperty.current = property;
                                setShowEditModal(true);
                              }}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setShowDeleteConfirmModal(true);
                                selectedProperty.current = property;
                              }}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown>
                        </div>
                      </Table.Cell>
                    )}
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

      <EditPropertyModal showModal={showEditModal} setShowModal={setShowEditModal} property={selectedProperty.current} refresh={getProperties} />
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
        title="Delete Order"
        description="Are you sure you would like to remove this property? This action is permanent."
        handleCancel={() => setShowDeleteConfirmModal(false)}
        handleConfirm={handleRemoveProperty}
      />
    </section>
  );
}
