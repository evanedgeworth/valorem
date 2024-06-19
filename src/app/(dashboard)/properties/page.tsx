"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";

import Link from "next/link";
import { MergeOrdersbyKey, formatToUSD } from "@/utils/commonUtils";
import { BiSolidPackage, BiDotsVerticalRounded } from "react-icons/bi";

import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";

import { useRouter } from "next/navigation";
import { BiSortDown } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import NewPropertyModal from "./components/newProperty.modal";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export default function Properties() {
  const supabase = createClientComponentClient<Database>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created_at" | "address">("created_at");
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const selectedProperty = useRef<Property | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [viewHistory, setViewHistory] = useState<number | null>(null);
  const router = useRouter();
  const { user, organization, allOrganizations } = useContext(UserContext);
  const currentOrganization = user?.user_organizations?.find((org) => organization?.id === org.organization);

  useEffect(() => {
    if (organization) {
      getProperties();
    }
  }, [sortBy, searchInput, organization?.id]);

  async function getProperties() {
    setTableIsLoading(true);
    let searchOrders = supabase.from("properties").select("*").order(sortBy, { ascending: true });
    // if (searchInput) searchOrders.textSearch("address", searchInput);
    searchOrders.eq("organization", organization?.id || 0);

    await searchOrders.then(({ data: propertiesRes, error }) => {
      if (error) {
        console.error(error);
      }
      if (propertiesRes) {
        setProperties(propertiesRes);
      }
    });
    setTableIsLoading(false);
  }

  async function handleRemoveOrder() {
    let order_id = selectedProperty.current?.id || "";
    const { error } = await supabase.from("orders").delete().eq("id", order_id);
    setShowDeleteConfirmModal(false);
    getProperties();
  }

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Properties</h5>
        {currentOrganization?.type === "client" && <NewPropertyModal showModal={showModal} setShowModal={setShowModal} />}
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
          <Dropdown.Item onClick={() => setSortBy("created_at")}>Project Name</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("address")}>Starting Date</Dropdown.Item>
        </Dropdown>
      </div>
      {tableIsLoading ? (
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
            {currentOrganization?.type === "client" && <Table.HeadCell></Table.HeadCell>}
          </Table.Head>
          <Table.Body className="divide-y">
            {properties.map((property) => (
              <Fragment key={property.id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="p-4 cursor-pointer">{property.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {`${property.address_line_1}${property.address_line_2 || ""}, ${property.city} ${property.state} ${property.zip_code}`}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {moment(property.created_at).format("MMM DD, YYYY")}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{property.type}</Table.Cell>

                  {currentOrganization?.type === "client" && (
                    <Table.Cell className="flex justify-end">
                      <div className="relative cursor-pointer">
                        <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                          <Dropdown.Item
                            onClick={() => {
                              selectedProperty.current = property;
                              setShowEditOrderModal(true);
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
      )}
    </section>
  );
}
