"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { CategoryItem } from "@/types";
import Autocomplete from "@/components/autocomplete";
import { useUserContext } from "@/context/userContext";
import { numberWithCommas, parseCurrencyToNumber } from "@/utils/commonUtils";

export const areaOptions = [
  "Exterior",
  "Landscaping",
  "Entryway",
  "Living Room",
  "Dining Room",
  "Family Room",
  "Kitchen",
  "Office",
  "Laundry Room",
  "Hallway",
  "Powder Room",
  "Stairway",
  "Master Bedroom",
  "Master Bathroom",
  "Bedroom",
  "Bathroom",
  "Attic",
  "Basement",
];

export default function NewProductModal({
  showModal,
  setShowModal,
  addProduct,
  orderId,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  addProduct: (product: any) => void;
  orderId: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string | null>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedCatalog, setSelectedCatalog] = useState<CategoryItem>();
  const { categoryItems, customCategoryItems } = useUserContext();
  function handleAddProduct() {
    let product = {
      categoryItemId: selectedCatalog?.id,
      categoryItem: selectedCatalog,
      quantity: quantity,
      area: category || "",
      orderId: orderId,
      status: "new",
      id: new Date().getTime().toString(),
    };
    addProduct(product);
    setShowModal(false);
  }

  const catalog = [...categoryItems, ...customCategoryItems];
  const loading = false;

  function handleSelectCatalogItem(value: CategoryItem) {
    setSelectedCatalog(value);
  }

  function handleClose() {
    setShowModal(false);
    setSelectedCatalog(undefined)
  }

  return (
    <div ref={rootRef}>
      <Button size="sm" onClick={() => setShowModal(true)} color="gray">
        + Add Product
      </Button>
      <Modal show={showModal} size="2xl" popup onClose={handleClose} root={rootRef.current ?? undefined}>
        <Modal.Header>
          <h3 className="text-xl font-medium px-5 pt-3">Add product</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label>Product Name</Label>
              <Autocomplete
                options={catalog}
                isLoading={loading}
                getOptionLabel={(option) => option.lineItem || ""}
                onOptionSelect={handleSelectCatalogItem}
                placeholder="Search for a product"
              />
            </div>
            {selectedCatalog && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduct();
                }}
                className="space-y-6"
              >
                <div className="mt-1">
                  <p className="text-xl font-medium">Description</p>
                  <p className="dark:text-gray-400">{selectedCatalog?.taskDescription || '-'}</p>
                </div>
                <div>
                  <Label htmlFor="area">Room / Area</Label>
                  <Select id="area"
                    required
                    value={category || ""}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Select an area"
                  >
                    <option value="">{'Select an area'}</option>
                    {areaOptions.map((option) => (
                      <option value={option} key={option}>{option}</option>
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
                    <p className="mt-3">{selectedCatalog?.targetClientPrice}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm mt-1">Price total</p>
                    <p className="mt-3">$ {numberWithCommas(parseCurrencyToNumber(selectedCatalog?.targetClientPrice || "0") * (isNaN(quantity) ? 0 : quantity))}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button fullSized color="gray" outline onClick={handleClose}>Close</Button>
                  <Button type="submit" fullSized color="gray">Save</Button>
                </div>
              </form>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
