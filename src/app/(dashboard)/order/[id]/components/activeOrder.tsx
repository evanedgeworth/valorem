import { Card, Toast, Table, Avatar, Button, Dropdown, TextInput } from "flowbite-react";
import { useState, useRef, useContext, useEffect } from "react";
import { MdDeleteOutline, MdPersonAddAlt } from "react-icons/md";
import { Database } from "../../../../../../types/supabase";
import { acronym, numberWithCommas, sortOrderTable } from "@/utils/commonUtils";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MergeProductsbyKey } from "@/utils/commonUtils";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
  status?: string;
  order_item_assignments?: { user: { id: string; first_name: string; last_name: string }; id: string }[];
};
type User = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};
interface COProduct extends Product {
  status: string;
}
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoMdCloseCircle } from "react-icons/io";

export default function ActiveOrder({
  products,
  remove,
  isEditing,
  refresh,
}: {
  products: Product[];
  remove: (product: Product) => void;
  isEditing: boolean;
  refresh: () => Promise<void>;
}) {
  const supabase = createClientComponentClient<Database>();
  const [showToast, setShowToast] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const { user, SignOut, selectedOrganization } = useContext(UserContext);
  const router = useRouter();
  const productSortedByType = MergeProductsbyKey(products, "room");
  const currentOrganization = user?.user_organizations?.find((org) => selectedOrganization?.id === org.organization);

  function handleRemoveProduct(product: Product) {
    let removedProduct = { ...product, status: "removed" };
    remove(removedProduct);
  }

  useEffect(() => {
    handleGetUsers();
  }, [currentOrganization?.organization]);

  async function handleGetUsers() {
    let { data: users, error } = await supabase
      .from("user_organizations")
      .select("user(id,first_name,last_name,email)")
      .eq("organization", currentOrganization?.organization || 0)
      .returns<User[]>();
    if (users) {
      setAssignableUsers(users);
    }
    if (error) alert(error.message);
  }

  async function handleAssignUserToOrderItem(userId: string, orderItemId: number) {
    let { data: users, error } = await supabase
      .from("order_item_assignments")
      .insert([{ user: userId, order_item: orderItemId }])
      .select();
    if (users) {
      await refresh();
    }
  }

  async function handleRemoveUserToOrderItem(orderItemAssignmentId: string) {
    console.log("DELETING", orderItemAssignmentId);
    let { data: users, error } = await supabase.from("order_item_assignments").delete().eq("id", orderItemAssignmentId).select();
    if (users) {
      await refresh();
    }
  }

  function filterAssignedUsers(currentAssignedUsers: any, allAvailableUsers: User) {
    // Filters out users that are already assigned to this task
    const currentAssignedIds = currentAssignedUsers.map((item: any) => item.user?.id);

    return !currentAssignedIds.includes(allAvailableUsers.user.id);
  }

  return (
    <div>
      <div className="flex flex-col flex-1 gap-4">
        {productSortedByType.length >= 1 ? (
          productSortedByType.sort(sortOrderTable).map((item) => (
            <Card key={item[0].id} className="overflow-x-auto">
              <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].room}</h5>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Product Description</Table.HeadCell>
                  <Table.HeadCell>Qty</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Total Price</Table.HeadCell>
                  {currentOrganization?.type === "client" && <Table.HeadCell>Assignee</Table.HeadCell>}

                  {isEditing && <Table.HeadCell></Table.HeadCell>}
                </Table.Head>
                {item
                  // .sort((a, b) => (a.item_id?.description || "z").localeCompare(b.item_id?.description || "z"))
                  .map((product, index) => (
                    <Table.Body className="divide-y" key={product.id}>
                      <Table.Row
                        className={
                          `dark:border-gray-700 dark:bg-gray-800 ` +
                          ((product.status === "updated" && ` bg-amber-200 dark:bg-amber-800`) ||
                            (product.status === "removed" && ` bg-red-200 dark:bg-red-800`) ||
                            (product.status === "new" && ` bg-green-200 dark:bg-green-800`))
                        }
                      >
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">{/* <p>{product.item_id.description}</p> */}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{"$" + numberWithCommas(Math.floor(product.price || 0))}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {"$" + numberWithCommas(Math.floor(product.price || 0 * product.quantity))}
                        </Table.Cell>
                        {currentOrganization?.type === "client" && (
                          <Table.Cell>
                            {/* <MdPersonAddAlt size={22} /> */}

                            <Dropdown
                              // label={<MdPersonAddAlt size={22} />}
                              // renderTrigger={() => <MdPersonAddAlt size={22} onClick={handleGetUsers} />}

                              label=""
                              renderTrigger={() =>
                                product?.order_item_assignments && product?.order_item_assignments?.length > 0 ? (
                                  <span className="cursor-pointer">
                                    <Avatar.Group className="flex -space-x-3">
                                      {product.order_item_assignments.map((item) => (
                                        <Avatar
                                          placeholderInitials={acronym(`${item.user.first_name} ${item.user.last_name}`)}
                                          rounded
                                          stacked
                                          size={"xs"}
                                          key={item.id}
                                        />
                                      ))}
                                    </Avatar.Group>
                                  </span>
                                ) : (
                                  <span className="cursor-pointer">
                                    <MdPersonAddAlt size={22} />
                                  </span>
                                )
                              }
                              arrowIcon={false}
                              color="white"
                            >
                              <Dropdown.Header>
                                <TextInput icon={BiSearchAlt} placeholder="Search or enter email..." />
                              </Dropdown.Header>
                              {/* Currently Assigned Users go above available users */}
                              {product?.order_item_assignments?.map((item) => (
                                <Dropdown.Item onClick={() => handleRemoveUserToOrderItem(item.id)} key={item.id}>
                                  <div className="relative">
                                    <IoMdCloseCircle className=" absolute right-0 z-10 hover:text-red-500" />
                                    <Avatar
                                      placeholderInitials={acronym(`${item.user.first_name} ${item.user.last_name}`)}
                                      rounded
                                      size={"sm"}
                                      className="pr-2"
                                    />
                                  </div>
                                  {`${item.user.first_name} ${item.user.last_name}`}
                                </Dropdown.Item>
                              ))}
                              {/* All possible users they can assign */}
                              {assignableUsers
                                .filter((item) => filterAssignedUsers(product?.order_item_assignments, item))
                                .map((item) => (
                                  <Dropdown.Item onClick={() => handleAssignUserToOrderItem(item.user.id, product.id)} key={item.user.id}>
                                    <Avatar
                                      placeholderInitials={acronym(`${item.user.first_name} ${item.user.last_name}`)}
                                      rounded
                                      size={"sm"}
                                      className="pr-2"
                                    />
                                    {`${item.user.first_name} ${item.user.last_name}`}
                                  </Dropdown.Item>
                                ))}
                            </Dropdown>

                            {/* <Avatar.Counter total={99} /> */}
                          </Table.Cell>
                        )}
                        {isEditing && (
                          <Table.Cell>
                            {product.status !== "removed" && (
                              <MdDeleteOutline size={25} className="text-red-500 cursor-pointer" onClick={() => handleRemoveProduct(product)} />
                            )}
                          </Table.Cell>
                        )}
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </Card>
          ))
        ) : (
          <div className="mx-auto my-24">
            <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No products added</h5>
            <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Select 'Add Product' to get started.`}</p>
          </div>
        )}
      </div>
      {showToast && (
        <Toast className="fixed bottom-10 right-10" duration={100}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Product added successfully.</div>
          <Toast.Toggle />
        </Toast>
      )}
    </div>
  );
}
