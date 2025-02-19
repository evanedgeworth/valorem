"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { CategoryItem } from "@/types";
import Autocomplete from "@/components/autocomplete";
import { useUserContext } from "@/context/userContext";

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
    setQuantity(1);
  }

  return (
    <div ref={rootRef}>
      <Button size="sm" onClick={() => setShowModal(true)} color="gray">
        + Add Product
      </Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
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
              />
            </div>
            {selectedCatalog && (
              <>
                <div>
                  <Label htmlFor="area">Room / Area</Label>
                  <Select id="area" required value={category || ""} onChange={(e) => setCategory(e.target.value)}>
                    <option>{category}</option>
                    {areaOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <TextInput required type="number" value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
                </div>
                <div className="flex justify-end">
                  <Button color="gray" onClick={handleAddProduct}>Save</Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
