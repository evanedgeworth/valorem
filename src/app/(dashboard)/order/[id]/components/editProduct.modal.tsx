"use client";

import { useState, useRef, useContext, useEffect } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { CategoryItem, ScopeItem } from "@/types";
import { areaOptions } from "./newProduct.modal";
import { numberWithCommas, parseCurrencyToNumber } from "@/utils/commonUtils";

export default function EditProductModal({
  showModal,
  setShowModal,
  editProduct,
  orderId,
  product,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  editProduct: (product: any) => void;
  orderId: string;
  product: ScopeItem | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string | null>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedCatalog, setSelectedCatalog] = useState<CategoryItem>();

  function handleSubmit() {
    const data = {
      categoryItemId: selectedCatalog?.id,
      categoryItem: selectedCatalog,
      quantity: quantity,
      area: category || "",
      orderId: orderId,
      status: "edit",
      id: product?.id,
    };
    editProduct(data);
    setShowModal(false);
  }

  useEffect(() => {
    if (product) {
      setCategory(product.area);
      setQuantity(product.quantity);
      setSelectedCatalog(product.categoryItem);
    }
  }, [product]);


  if (!product) {
    return (
      <div></div>
    )
  }

  return (
    <Modal show={showModal} size="2xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4 pt-3">Edit product</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <p className="text-xl font-medium">Name</p>
            <p>{product.categoryItem?.lineItem}</p>
          </div>
          <div className="mt-1">
            <p className="text-xl font-medium">Description</p>
            <p>{product.categoryItem?.taskDescription}</p>
          </div>

          <div>
            <Label htmlFor="countries">Room / Area</Label>
            <Select id="countries" required value={category || ""} onChange={(e) => setCategory(e.target.value)}>
              <option>{category}</option>
              {areaOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 grid-cols-12">
            <div className="col-span-6">
              <Label>Quantity</Label>
              <TextInput required type="number" value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
            </div>
            <div className="col-span-3">
              <p className="text-sm mt-1">Price per item</p>
              <p className="mt-3">{product.categoryItem?.targetClientPrice}</p>
            </div>
            <div className="col-span-3">
              <p className="text-sm mt-1">Price total</p>
              <p className="mt-3">$ {numberWithCommas(parseCurrencyToNumber(product.categoryItem?.targetClientPrice || "0") * quantity)}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button fullSized outline onClick={() => setShowModal(false)}>Close</Button>
            <Button fullSized onClick={handleSubmit}>Submit</Button>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
}
