import { Card, Toast, Table } from "flowbite-react";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { numberWithCommas, parseCurrencyToNumber, sortOrderTable } from "@/utils/commonUtils";
import { MergeProductsbyKey } from "@/utils/commonUtils";

import { HiCheck } from "react-icons/hi";
import { ScopeItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";

function ProductDescription ({ categoryItemId }: { categoryItemId: string }) {
  const { data } = useQuery({
    queryKey: ['categoryItem', categoryItemId],
    queryFn: async () => {
      const res = await request({
        url: `/category-items/${categoryItemId}`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    }
  });

  return (
    <div>{data?.lineItem || ''}</div>
  )
}

export default function ActiveOrder({
  remove,
  isEditing,
  refresh,
  products,
}: {
  remove: (product: ScopeItem) => void;
  isEditing: boolean;
  refresh: () => Promise<void>;
  products: ScopeItem[] | null;
}) {
  const [showToast, setShowToast] = useState(false);

  function handleRemoveProduct(product: ScopeItem) {
    let removedProduct = { ...product, status: "removed" };
    remove(removedProduct);
  }

  const scopeItems = products || [];
  const productSortedByType = MergeProductsbyKey(scopeItems, "area");

  return (
    <div>
      <div className="flex flex-col flex-1 gap-4">
        {productSortedByType.length >= 1 ? (
          productSortedByType.sort(sortOrderTable).map((item) => (
            <Card key={item[0].id} className="overflow-x-auto">
              <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item[0].area}</h5>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Product Description</Table.HeadCell>
                  <Table.HeadCell>Qty</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Total Price</Table.HeadCell>

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
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          <ProductDescription categoryItemId={product.categoryItemId} />
                        </Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">{product.targetClientPrice}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {"$" + numberWithCommas((parseCurrencyToNumber(product.targetClientPrice) || 0) * product.quantity)}
                        </Table.Cell>
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
