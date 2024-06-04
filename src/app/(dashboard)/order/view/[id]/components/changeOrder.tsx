import { Button, Card, Toast, Table, Tabs } from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../../types/supabase";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { MergeProductsbyKey, numberWithCommas, sortOrderTable } from "@/utils/commonUtils";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
};
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [COProduct];
interface COProduct extends Product {
  status: string;
}
import { useSearchParams } from "next/navigation";

export default function ChangeOrder({ products }: { products: Product[] }) {
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productSortedByType = MergeProductsbyKey(products, "room");
  console.log("BOn");

  return (
    <section>
      <div className="flex flex-col gap-4">
        {productSortedByType.sort(sortOrderTable).map((item: any) => (
          <Card key={item[0].id} className="overflow-x-auto">
            <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].type}</h5>
            <Table>
              <Table.Head>
                <Table.HeadCell>Product Description</Table.HeadCell>
                <Table.HeadCell>Qty</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Total Price</Table.HeadCell>
              </Table.Head>
              {item.map((product: COProduct) => (
                <Table.Body className="divide-y" key={product.id}>
                  <Table.Row
                    className={
                      `dark:border-gray-700 dark:bg-gray-800 ` +
                      ((product.status === "updated" && ` bg-amber-200 dark:bg-amber-800`) ||
                        (product.status === "removed" && ` bg-red-200 dark:bg-red-800`) ||
                        (product.status === "new" && ` bg-lime-200 dark:bg-lime-800`))
                    }
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white max-w-xs">{product.item_id.description}</Table.Cell>
                    <Table.Cell>{product.quantity}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{"$" + numberWithCommas(Math.floor(product.price || 0))}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{"$" + numberWithCommas(Math.floor(product.price || 0 * product.quantity))}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </Card>
        ))}
      </div>
    </section>
  );
}
