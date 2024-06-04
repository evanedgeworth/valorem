"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Catalog = Database["public"]["Tables"]["materials"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { debounce } from "@mui/material/utils";

export default function NewProductModal({
  showModal,
  setShowModal,
  reload,
  orderId,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  reload: () => void;
  orderId: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [category, setCategory] = useState<string | null>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [catalog, setCatalog] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog>();
  const [open, setOpen] = useState(false);
  const loading = open && catalog.length === 0;

  async function handleAddProduct() {
    console.log(name, description, quantity, price, "SIZE", size, category, orderId);
    const { data, error } = await supabase
      .from("products")
      .insert([{ name: name, description: description, quantity: quantity, price: price || 0, size: size, type: category, orderId: orderId }])
      .select();
    if (data) {
      alert("Order has been created");
    }
    if (error) {
      console.log(error);
      alert(error);
    }
    reload();
    setName("");
    setCategory("");
    setDescription("");
    setShowModal(false);
  }

  async function searchCatalog() {
    const { data, error } = await supabase.from("catalog").select().textSearch("description", name);
    if (data) {
      setCatalog(data);
      console.log("DATA", data);
    }
  }

  function handleSelectCatalogItem(value: Catalog) {
    console.log("ITEM", value);
    setSelectedCatalog(value);
    setCategory(value.group);
    setDescription(value.description || "");
    setPrice(value.retail_price || 0);
    setQuantity(1);
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      searchCatalog();
    }, 500);
    return () => clearTimeout(getData);
  }, [name]);

  useEffect(() => {
    if (!open) {
      setCatalog([]);
    }
  }, [open]);

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Product</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Product</h3>
            <div>
              <Label>Product Name</Label>
              {/* <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} /> */}
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
                getOptionLabel={(option) => option.description || ""}
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
                  <Label htmlFor="countries">Category</Label>
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
                  <Label>Sqft</Label>
                  <TextInput required type="number" value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <TextInput required type="number" value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
                </div>
                <div>
                  <Label>Price</Label>
                  <TextInput addon="$" required type="number" value={price} onChange={(e) => setPrice(e.target.valueAsNumber)} />
                </div>
                <div className="max-w-md" id="textarea">
                  <Label htmlFor="comment">Description</Label>
                  <Textarea
                    id="comment"
                    placeholder="Please give a detailed description..."
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
