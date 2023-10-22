import { Button, Card, Toast, Table, Tabs } from "flowbite-react";
import { useState, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type ProductArray = [Product];
interface COProduct extends Product {
  status: string;
}
import { useSearchParams } from "next/navigation";

export default function ChangeOrder({ products }: { products: ProductArray[] }) {
  const previousProducts = useRef<any[]>([]);
  const coProducts = useRef<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <section>
      <div className="flex flex-col gap-4">
        {products.map((item: any) => (
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
                        (product.status === "removed" && ` bg-red-200 dark:bg-red-800`))
                    }
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white max-w-xs">{product.description}</Table.Cell>
                    <Table.Cell>{product.quantity}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>{Math.floor(product.price * product.quantity)}</Table.Cell>
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
