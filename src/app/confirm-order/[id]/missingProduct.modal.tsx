"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Catalog = Database["public"]["Tables"]["catalog"]["Row"];
import { Button, Checkbox, Label, Modal, TextInput, Select, Textarea } from "flowbite-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { debounce } from "@mui/material/utils";

export default function MissingProductModal({
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
    const { data, error } = await supabase
      .from("products")
      .insert([{ name: name, description: description, quantity: quantity, price: price || 0, size: size, type: category, orderId: orderId }])
      .select();
    if (error) {
      alert(error.message);
    }
    reload();
    setName("");
    setCatalog([]);
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
    setSelectedCatalog(value);
    setCategory(value.category);
    setDescription(value.description || "");
    setPrice(value.cost || 0);
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
      <Button color="gray" size="xs" onClick={() => setShowModal(true)}>
        Missing something?
      </Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Missing Product</h3>
            <div className="max-w-md" id="textarea">
              <div className="mb-2 block">
                <Label htmlFor="comment" value="Description" />
              </div>
              <Textarea id="comment" placeholder="Leave a comment..." required rows={4} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Submit</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
