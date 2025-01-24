"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "@/types";

export const areaOptions = [
  "Applicances",
  "Bathroom",
  "Bedroom",
  "Cabinet",
  "Ceiling Fan",
  "Cleaning",
  "Countertop",
  "Demo",
  "Door",
  "Drywall",
  "Electrical",
  "Exterior / Landscaping",
  "Flooring",
  "Garage",
  "General",
  "HVAC",
  "Kitchen",
  "Landscaping",
  "Laundry",
  "Lighting",
  "Paint",
  "Permit",
  "Plumbing",
  "Roofing",
  "Window",
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
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedCatalog, setSelectedCatalog] = useState<CategoryItem>();
  const [open, setOpen] = useState(false);

  function handleAddProduct() {
    let product = {
      categoryItemId: selectedCatalog?.id,
      categoryItem: selectedCatalog,
      quantity: quantity,
      area: category || "",
      orderId: orderId,
      status: "new",
      id: new Date().toTimeString()
    };
    addProduct(product);
    setShowModal(false);
  }
  const { data, isLoading } = useQuery({
    queryKey: ['category-items'],
    queryFn: async () => {
      const res = await request({
        url: `/category-items`,
        method: "GET",
        params: {
          all: true
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
  });

  const catalog = data?.categoryItems || [];
  const loading = isLoading;

  function handleSelectCatalogItem(value: CategoryItem) {
    setSelectedCatalog(value);
    setQuantity(1);
  }

  return (
    <div ref={rootRef}>
      <Button size="sm" onClick={() => setShowModal(true)}>+ Add Product</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header>
          <h3 className="text-xl font-medium px-5 pt-3">Add product</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label>Product Name</Label>
              <div className="border-gray-300 bg-gray-50 text-gray-900 border rounded-lg py-1">
                <Autocomplete
                  open={open}
                  fullWidth
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  filterOptions={(x) => x}
                  getOptionLabel={(option) => option.lineItem || ""}
                  options={catalog}
                  loading={loading}
                  value={selectedCatalog}
                  onChange={(event: React.SyntheticEvent, value: any | null) => handleSelectCatalogItem(value)}
                  onInputChange={(event, newInputValue) => {
                    setName(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=""
                      id="productSelector"
                      fullWidth
                      variant="standard"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {

                          backgroundColor: "#374151",
                          borderRadius: ".5rem",
                          "--tw-ring-color": "transparent",
                          legend: {
                            marginLeft: "30px",
                          },
                        },
                        "& .MuiAutocomplete-inputRoot": {
                          paddingLeft: "10px !important",
                          paddingRight: "20px !important",
                          borderRadius: ".5rem",
                          "--tw-ring-color": "transparent",
                          color: "black"
                        },
                        "& .MuiInputLabel-outlined": {
                          paddingLeft: "20px",
                          "--tw-ring-color": "transparent",
                        },
                        "& .MuiInputLabel-shrink": {
                          marginLeft: "20px",
                          paddingLeft: "10px",
                          paddingRight: 0,
                          background: "white",
                          "--tw-ring-color": "transparent",
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </div>
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
                  <Button onClick={handleAddProduct}>Save</Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
