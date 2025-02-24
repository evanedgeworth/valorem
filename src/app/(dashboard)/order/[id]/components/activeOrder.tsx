import { Card, Dropdown, Table } from "flowbite-react";
import { numberWithCommas, parseCurrencyToNumber, sortOrderTable } from "@/utils/commonUtils";
import { MergeProductsbyKey } from "@/utils/commonUtils";

import { ScopeItem } from "@/types";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useRef, useState } from "react";
import NewProductModal from "./newProduct.modal";
import EditProductModal from "./editProduct.modal";
import { DeleteIcon, EditIcon } from "@/components/icon";

export default function ActiveOrder({
  remove,
  add,
  edit,
  isEditing,
  isAdding,
  isDeleting,
  products,
  orderId,
}: {
  remove: (product: ScopeItem) => void;
  add: (product: ScopeItem) => void;
  edit: (product: ScopeItem) => void;
  isEditing?: boolean;
  isAdding?: boolean;
  isDeleting?: boolean;
  products: ScopeItem[] | null;
  orderId: string;
}) {

  function handleRemoveProduct(product: ScopeItem) {
    let removedProduct = { ...product, status: "removed" };
    remove(removedProduct);
  }

  const scopeItems = products || [];
  const productSortedByType = MergeProductsbyKey(scopeItems, "area");
  const selectedProduct = useRef<ScopeItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  return (
    <div>
      <div className="flex flex-col flex-1 gap-4">
        {productSortedByType.length >= 1 ? (
          productSortedByType.sort(sortOrderTable).map((item) => (
            <Card key={item[0].id} className="">
              <div className="flex justify-between">
                <h5 className="mb-2 text-2xl text-left font-bold">{item[0].area}</h5>
                {
                  isAdding && (
                    <div>
                      <NewProductModal
                        showModal={showAddModal}
                        setShowModal={setShowAddModal}
                        addProduct={(newProduct) => {
                          add(newProduct);
                        }}
                        orderId={orderId}
                      />
                    </div>
                  )
                }
              </div>
              <Table>
                <Table.Head className="bg-transparent">
                  <Table.HeadCell>Product Name</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Qty</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Total Price</Table.HeadCell>

                  {(isEditing || isDeleting) && <Table.HeadCell>Action</Table.HeadCell>}
                </Table.Head>
                {item
                  .map((product, index) => (
                    <Table.Body className="divide-y" key={product.id}>
                      <Table.Row
                        className={
                          `border-t-gray-200 border-t dark:border-t-gray-600 ` +
                          ((product.status === "updated" && ` bg-amber-200 dark:bg-amber-800`) ||
                            (product.status === "removed" && ` bg-red-200 dark:bg-red-800`) ||
                            (product.status === "new" && ` bg-green-200 dark:bg-green-800`))
                        }
                      >
                        <Table.Cell className="font-medium">
                          <div>{product.categoryItem?.lineItem || ''}</div>
                        </Table.Cell>
                        <Table.Cell className="font-medium">
                          <div>{product.categoryItem?.taskDescription || ''}</div>
                        </Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {"$" + numberWithCommas((parseCurrencyToNumber(product.targetClientPrice ?? product.categoryItem?.targetClientPrice) || 0))}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {"$" + numberWithCommas((parseCurrencyToNumber(product.targetClientPrice ?? product.categoryItem?.targetClientPrice) || 0) * product.quantity)}
                        </Table.Cell>
                        {isEditing && (
                          <Table.Cell>
                            <div className="relative cursor-pointer">
                              <Dropdown renderTrigger={() => <BiDotsHorizontalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                                {
                                  isEditing && (
                                    <Dropdown.Item
                                      onClick={() => {
                                        selectedProduct.current = product;
                                        setShowEditModal(true);
                                      }}
                                    >
                                      Edit
                                    </Dropdown.Item>
                                  )
                                }

                                {
                                  isDeleting && (
                                    <Dropdown.Item
                                      onClick={() => {
                                        selectedProduct.current = product;
                                        handleRemoveProduct(product);
                                      }}
                                      className="text-red-500"
                                    >
                                      Delete
                                    </Dropdown.Item>
                                  )
                                }
                              </Dropdown>
                            </div>
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
            {
              isAdding && (
                <div>
                  <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Click 'Add Product' to get started.`}</p>
                  <NewProductModal
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    addProduct={(newProduct) => {
                      add(newProduct);
                    }}
                    orderId={orderId}
                  />
                </div>
              )
            }
          </div>
        )}
      </div>
      <EditProductModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editProduct={(product) => {
          edit(product);
        }}
        orderId={orderId}
        product={selectedProduct.current}
      />
    </div>
  );
}
