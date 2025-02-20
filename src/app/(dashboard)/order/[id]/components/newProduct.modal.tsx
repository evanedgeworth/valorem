"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "@/types";
import Autocomplete from "@/components/autocomplete";
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
  const { data, isLoading } = useQuery({
    queryKey: ["category-items"],
    queryFn: async () => {
      const res = await request({
        url: `/category-items`,
        method: "GET",
        params: {
          all: true,
        },
      });
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
  });

  const catalog: CategoryItem[] = data?.categoryItems || [];
  const loading = isLoading;

  function handleSelectCatalogItem(value: CategoryItem) {
    setSelectedCatalog(value);
    setQuantity(1);
  }

  function handleClose () {
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
              />
            </div>
            {selectedCatalog && (
              <>
                <div className="mt-1">
                  <p className="text-xl font-medium">Description</p>
                  <p>{selectedCatalog?.taskDescription}</p>
                </div>
                <div>
                  <Label htmlFor="area">Room / Area</Label>
                  <Select id="area" required value={category || ""} onChange={(e) => setCategory(e.target.value)}>
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
                    <p className="mt-3">{selectedCatalog?.targetClientPrice}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm mt-1">Price total</p>
                    <p className="mt-3">$ {numberWithCommas(parseCurrencyToNumber(selectedCatalog?.targetClientPrice || "0") * (isNaN(quantity) ? 0 : quantity))}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button fullSized color="gray" outline onClick={handleClose}>Close</Button>
                  <Button fullSized color="gray" onClick={handleAddProduct}>Save</Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
