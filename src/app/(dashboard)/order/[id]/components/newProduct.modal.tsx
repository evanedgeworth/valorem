"use client";

import { useState, useRef } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "@/types";

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
      <Button onClick={() => setShowModal(true)}>+ Add Item</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Item</h3>
            <div>
              <Label>Product Name</Label>
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
                        borderStyle: "none",
                        borderWidth: 0,
                        backgroundColor: "#F9FAFB",
                        borderRadius: ".5rem",
                        "--tw-ring-color": "transparent",
                        legend: {
                          marginLeft: "30px",
                        },
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        borderStyle: "none",
                        borderWidth: 0,
                        paddingLeft: "20px !important",
                        borderRadius: ".5rem",
                        "--tw-ring-color": "transparent",
                      },
                      "& .MuiInputLabel-outlined": {
                        borderStyle: "none",
                        borderWidth: 0,
                        paddingLeft: "20px",
                        "--tw-ring-color": "transparent",
                      },
                      "& .MuiInputLabel-shrink": {
                        marginLeft: "20px",
                        paddingLeft: "10px",
                        paddingRight: 0,
                        background: "white",
                        borderStyle: "none",
                        borderWidth: 0,
                        "--tw-ring-color": "transparent",
                      },
                      border: "none",
                      "& fieldset": { border: "none" },
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
            {selectedCatalog && (
              <>
                <div>
                  <Label htmlFor="countries">Area</Label>
                  <Select id="countries" required value={category || ""} onChange={(e) => setCategory(e.target.value)}>
                    <option>{category}</option>
                    <option>Applicances</option>
                    <option>Bathroom</option>
                    <option>Bedroom</option>
                    <option>Cabinet</option>
                    <option>Ceiling Fan</option>
                    <option>Cleaning</option>
                    <option>Countertop</option>
                    <option>Demo</option>
                    <option>Door</option>
                    <option>Drywall</option>
                    <option>Electrical</option>
                    <option>Exterior / Landscaping</option>
                    <option>Flooring</option>
                    <option>Garage</option>
                    <option>General</option>
                    <option>HVAC</option>
                    <option>Kitchen</option>
                    <option>Landscaping</option>
                    <option>Laundry</option>
                    <option>Lighting</option>
                    <option>Paint</option>
                    <option>Permit</option>
                    <option>Plumbing</option>
                    <option>Roofing</option>
                    <option>Window</option>
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
