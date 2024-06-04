"use client";

import { Timeline, Table, Badge, Dropdown, Select, TextInput, Spinner, Label, Checkbox, Button, Card } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { BiSolidPackage, BiDotsVerticalRounded } from "react-icons/bi";
import { HiCheck, HiClock } from "react-icons/hi";
import { Markets } from "@/utils/defaults";
import { FaHardHat, FaUser } from "react-icons/fa";
import ConfirmationModal from "@/components/confirmation.modal";
// import AddUserModal from "./components/add-user-modal";
// import UserInfoDrawer from "./components/user-info-drawer";
import { cn, formatToUSD } from "@/utils/commonUtils";
import { UserContext } from "@/context/userContext";
import moment from "moment";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Invoice = Database["public"]["Tables"]["invoices"]["Row"] & { order: Order };
const status = ["paid", "unpaid", "overdue", "pending"];

export default function InvoiceTable({ user }: { user: User }) {
  const supabase = createClientComponentClient<Database>();
  const [invoices, setInvoices] = useState<any[]>();
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [filterCardValue, setFilterCardValue] = useState("");
  const [showRemoveUserModal, setShowRemoveUserModal] = useState<boolean>(false);
  const [showUserDetailsDrawer, setShowUserDetailsDrawer] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const selectedUser = useRef<User>();
  const { organization } = useContext(UserContext);

  useEffect(() => {
    if (organization) {
      getUserTable();
    }
  }, [searchInput, market, organization?.id, filterCardValue]);

  async function getUserTable() {
    setTableIsLoading(true);
    let searchInvoices = supabase.from("invoices").select("*, order!inner(*)");
    if (searchInput) searchInvoices.textSearch("order.project_name", searchInput);
    if (filterCardValue) searchInvoices.eq("status", filterCardValue);
    // searchInvoices.returns<Invoice[]>();
    // if (market) searchUsers.or(`markets.cs.{${market}}`);

    await searchInvoices.then(({ data: invoices, error }) => {
      if (error) {
        console.error(error);
      }
      if (invoices) {
        setInvoices(invoices);
      }
    });
    setTableIsLoading(false);
  }

  async function removeUser() {
    let { data, error } = await supabase
      .from("user_organizations")
      .delete()
      .eq("id", selectedUser.current?.user_organizations.find((value) => value.organization === organization?.id)?.id || "")
      .select();
    if (data) {
      setShowRemoveUserModal(false);
      getUserTable();
    }
  }

  function handleSelectFilterCard(value: string) {
    if (filterCardValue !== value) {
      setFilterCardValue(value);
    } else {
      setFilterCardValue("");
    }
  }

  function InvoiceStatus({ invoice }: { invoice: Invoice }) {
    switch (invoice.status) {
      case "paid":
        return (
          <Badge size="xs" color="green" className="justify-center w-fit">
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge size="xs" color="red" className="justify-center w-fit">
            Unpaid
          </Badge>
        );
      case "pending":
        return (
          <Badge size="xs" color="gray" className="justify-center w-fit">
            WIP
          </Badge>
        );
      case "overdue":
        return (
          <Badge size="xs" color="yellow" className="justify-center w-fit">
            Overdue
          </Badge>
        );

      default:
        return (
          <Badge size="xs" color="gray" className="justify-center w-fit">
            {invoice.status}
          </Badge>
        );
    }
  }

  return (
    <section className="p-5 w-full">
      <div className="flex justify-between mb-4">
        <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Invoices</h5>
      </div>
      <div className="flex justify-between gap-3 mb-4">
        <Card
          className={cn("flex flex-1 hover:bg-gray-50 cursor-pointer", filterCardValue === "paid" && " bg-gray-100")}
          onClick={() => handleSelectFilterCard("paid")}
        >
          <Badge size="xs" color="green" className="justify-center w-fit">
            Paid
          </Badge>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">$10,060</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">5 Invoices</p>
        </Card>
        <Card
          className={cn("flex flex-1 hover:bg-gray-50 cursor-pointer", filterCardValue === "unpaid" && " bg-gray-100")}
          onClick={() => handleSelectFilterCard("unpaid")}
        >
          <Badge size="xs" color="red" className="justify-center w-fit">
            Unpaid
          </Badge>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">$3,400</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">1 Invoices</p>
        </Card>
        <Card
          className={cn("flex flex-1 hover:bg-gray-50 cursor-pointer", filterCardValue === "pending" && " bg-gray-100")}
          onClick={() => handleSelectFilterCard("pending")}
        >
          <Badge size="xs" color="yellow" className="justify-center w-fit">
            WIP
          </Badge>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">$12,050</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">3 Invoices</p>
        </Card>
        <Card
          className={cn("flex flex-1 hover:bg-gray-50 cursor-pointer", filterCardValue === "overdue" && " bg-gray-100")}
          onClick={() => handleSelectFilterCard("overdue")}
        >
          <Badge size="xs" color="gray" className="justify-center w-fit">
            Overdue
          </Badge>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">$0</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">0 Invoices</p>
        </Card>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4 items-end">
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="search" value="Search" />
            </div>
            <TextInput placeholder="Name" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="status" value="Status" />
            </div>
            <Select id="status" value={status} onChange={(e) => setMarket(e.target.value)}>
              {status.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>

          {/* <Dropdown label={<BiSortDown size={17} className=" dark:text-white" />} arrowIcon={false} color="white">
            <Dropdown.Header>
              <strong>Sort By</strong>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setSortBy("project_name")}>Project Name</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("start_date")}>Starting Date</Dropdown.Item>
          </Dropdown> */}
        </div>
        {/* <AddUserModal reloadTable={getUserTable} /> */}
      </div>
      {tableIsLoading ? (
        <div className=" ml-auto mr-auto mt-72 text-center">
          <Spinner size="xl" />
        </div>
      ) : invoices && invoices.length !== 0 ? (
        <Table striped className="w-full">
          <Table.Head>
            <Table.HeadCell>
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>Invoice ID</Table.HeadCell>
            <Table.HeadCell>Order Name</Table.HeadCell>
            <Table.HeadCell>Sent Date</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {invoices &&
              invoices.map((invoice) => (
                <Fragment key={invoice.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={invoice.id}>
                    <Table.Cell>
                      <Checkbox />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {invoice.id}
                      {/* {`${invoice.first_name} ${invoice.last_name}`} */}
                    </Table.Cell>
                    <Table.Cell>{invoice.order.project_name}</Table.Cell>
                    <Table.Cell>{moment(invoice.created_at).format("DD MMMM YYYY")}</Table.Cell>
                    <Table.Cell>{formatToUSD(invoice.amount || 0)}</Table.Cell>
                    <Table.Cell>
                      <InvoiceStatus invoice={invoice} />
                    </Table.Cell>
                    <Table.Cell className="">
                      <div className="relative cursor-pointer">
                        {/* <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                          <Dropdown.Item
                            onClick={() => {
                              selectedUser.current = invoice;
                              setShowUserDetailsDrawer(true);
                            }}
                          >
                            View
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              selectedUser.current = invoice;
                              setShowRemoveUserModal(true);
                            }}
                          >
                            Remove from team
                          </Dropdown.Item>
                        </Dropdown> */}
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
          <p className="mb-2 text-sm text-gray-400 dark:text-white text-center">There are currently no orders.</p>
        </div>
      )}
      <ConfirmationModal
        showModal={showRemoveUserModal}
        setShowModal={setShowRemoveUserModal}
        title="Remove User from Team"
        description="You may invite this user to your team at a later time if you wish to add them back."
        handleCancel={() => setShowRemoveUserModal(false)}
        handleConfirm={removeUser}
      />
      {/* <UserInfoDrawer showDrawer={showUserDetailsDrawer} setShowDrawer={setShowUserDetailsDrawer} user={selectedUser.current} /> */}
    </section>
  );
}
