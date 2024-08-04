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

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProductsTable({ products }: { products: Product[] }) {
  const supabase = createClientComponentClient<Database>();
  const [showToast, setShowToast] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const { user, SignOut, selectedOrganization } = useContext(UserContext);
  const router = useRouter();
  const productSortedByType = MergeProductsbyKey(products, "room");
  const currentOrganization = user?.user_organizations?.find((org) => selectedOrganization?.id === org.organization);

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

  function filterAssignedUsers(currentAssignedUsers: any, allAvailableUsers: User) {
    // Filters out users that are already assigned to this task
    const currentAssignedIds = currentAssignedUsers.map((item: any) => item.user?.id);

    return !currentAssignedIds.includes(allAvailableUsers.user.id);
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      {productSortedByType.length >= 1 ? (
        <Table>
          <Table.Head>
            <Table.HeadCell>Product Description</Table.HeadCell>
            <Table.HeadCell>Qty</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Total Price</Table.HeadCell>
          </Table.Head>

          {productSortedByType.sort(sortOrderTable).map((item) => (
            <>
              {/* // <Card key={item[0].id} className="overflow-x-auto">
            //   <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].room}</h5> */}

              {item
                .sort((a, b) => (a.item_id.description || "z").localeCompare(b.item_id.description || "z"))
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
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <p>{product.item_id.description}</p>
                      </Table.Cell>
                      <Table.Cell>{product.quantity}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{"$" + numberWithCommas(Math.floor(product.price || 0))}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {"$" + numberWithCommas(Math.floor(product.price || 0 * product.quantity))}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </>
          ))}
        </Table>
      ) : (
        <div className="mx-auto my-24">
          <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No products added</h5>
          {/* <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Select 'Add Product' to get started.`}</p> */}
        </div>
      )}
    </div>
  );
}
