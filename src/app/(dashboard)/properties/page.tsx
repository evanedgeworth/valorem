"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label, Button, Tabs } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
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

// type Property = Database["public"]["Tables"]["properties"]["Row"] & {
//   orders?: { count: number }[];
// };

export default function Properties() {
  const pathname = usePathname();
  const supabase = createClientComponentClient<Database>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created_at" | "address_line_1">("created_at");
  const selectedProperty = useRef<Property | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const router = useRouter();
  const { user, selectedOrganization, allOrganizations } = useContext(UserContext);
  const currentOrganization = user?.user_organizations?.find((org) => selectedOrganization?.id === org.organization);
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("view") || "List";

  useEffect(() => {
    if (selectedOrganization) {
      getProperties();
    }
  }, [sortBy, searchInput, selectedOrganization?.id]);

  function handleTabChange(selectedTab: string) {
    router.push(`${pathname}/?view=${selectedTab}`);
  }

  async function getProperties() {
    setTableIsLoading(true);
    request({
      url: `/properties`,
      method: "GET",
      params: { organization: selectedOrganization?.id },
    }).then(({ data }) => {
      setProperties(data.properties);
    });
    setTableIsLoading(false);
  }

  // async function getProperties() {
  //   setTableIsLoading(true);
  //   let searchOrders = supabase.from("properties").select("*,orders(count)").order(sortBy, { ascending: true });
  //   if (searchInput) searchOrders.textSearch("address_line_1", searchInput);
  //   searchOrders.eq("organization", selectedOrganization?.id || 0).returns<Property[]>();

  //   await searchOrders.then(({ data: propertiesRes, error }) => {
  //     if (error) {
  //       console.error(error);
  //     }
  //     if (propertiesRes) {
  //       setProperties(propertiesRes);
  //     }
  //   });
  //   setTableIsLoading(false);
  // }

  async function handleRemoveProperty() {
    let property_id = selectedProperty.current?.id || "";
    request({
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
        {currentOrganization?.type === "client" && <NewPropertyModal showModal={showModal} setShowModal={setShowModal} refresh={getProperties} />}
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="search" value="Search" />
          </div>
          <TextInput placeholder="Address" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
        </div>
        {/* {allOrganizations.length > 1 && (
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="countries" value="Select your organization" />
            </div>
            <Select id="countries" required onChange={(e) => setSelectedOrginization(e.target.value)}>
              {allOrganizations.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
        )} */}

        <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
          <Dropdown.Header>
            <strong>Sort By</strong>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setSortBy("address_line_1")}>Address</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("created_at")}>Creation Date</Dropdown.Item>
        </Dropdown>
        {/* <Tabs>
          <Tabs.Item active title="List">
            <p className="text-sm text-gray-500 dark:text-gray-400">Content 1</p>
          </Tabs.Item>
          <Tabs.Item active title="Map">
            <p className="text-sm text-gray-500 dark:text-gray-400">Content 1</p>
          </Tabs.Item>
        </Tabs> */}
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
      {selectedTab === "List" ? (
        tableIsLoading ? (
          <div className=" ml-auto mr-auto mt-72 text-center">
            <Spinner size="xl" />
          </div>
        ) : properties.length !== 0 ? (
          <Table striped className="w-full">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Created Date</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Orders</Table.HeadCell>
              {currentOrganization?.type === "client" && <Table.HeadCell></Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {properties.map((property) => (
                <Fragment key={property.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="p-4 cursor-pointer">{property.id}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {`${property.address_line1}${(property.address_line2 && " " + property.address_line2) || ""}, ${property.city} ${
                        property.state
                      } ${property.zip_code}`}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {moment(property.created_at).format("MMM DD, YYYY")}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{property.type}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {/* {property.orders ? property.orders[0].count : "error"} */}
                    </Table.Cell>

                    {currentOrganization?.type === "client" && (
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
