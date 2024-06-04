"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Warranty = Database["public"]["Tables"]["warranties"]["Row"];
type Image = { data: File; url: string };
import { Button, Checkbox, Label, Modal, TextInput, Textarea } from "flowbite-react";
import DatePicker from "@/components/datePicker";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function NewWarrantyModal({
  showModal,
  setShowModal,
  reload,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  reload: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [orderName, setOrderName] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [period, setPeriod] = useState<number>(0);
  const [catalog, setCatalog] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const loading = open && catalog.length === 0;
  const router = useRouter();
  const { user, SignOut } = useContext(UserContext);
  const [images, setImages] = useState<Image[]>([]);
  const [imageUrls, setImageUrls] = useState<any[]>([]);

  async function handleCreateWarranty() {
    if (name !== "" && selectedOrder) {
      const { data, error } = await supabase
        .from("warranties")
        .insert([
          {
            name: name,
            start_date: startDate.toDateString(),
            order_id: selectedOrder.id,
            period: period,
            contractor_id: user?.id,
          },
        ])
        .select()
        .limit(1)
        .single();
      if (data) {
        handleUploadImages({ params: data });
      }
      if (error) {
        alert(error.message);
      }
      setShowModal(false);
    }
  }

  async function searchCatalog() {
    const { data, error } = await supabase.from("orders").select().textSearch("project_name", orderName);
    if (data) {
      setCatalog(data);
    }
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      searchCatalog();
    }, 500);
    return () => clearTimeout(getData);
  }, [orderName]);

  function handleSelectCatalogItem(value: Order) {
    setSelectedOrder(value);
  }

  function selectImages(e: any) {
    const tempArr: any = [];
    let target = [...e.target.files];

    target.forEach((file: any) => {
      tempArr.push({
        data: file,
        url: URL.createObjectURL(file),
      });
    });

    setImages((prevImages) => [...prevImages, ...tempArr]);
  }

  async function handleUploadImages({ params }: { params: Warranty }) {
    // setIsUploading(true);
    await Promise.all(
      images.map(async (image) => {
        await supabase.storage.from("warranty-receipts").upload(params.id + "/" + uuidv4(), image.data, {
          cacheControl: "3600",
          upsert: false,
        });
      })
    );
    reload();
    // setIsUploading(false);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)}>+ Add Warrenty</Button>
      <Modal show={showModal} size="lg" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Warranty</h3>
            <div>
              <Label>Warranty Name</Label>
              <TextInput id="name" name="postContent" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Order</Label>
              <Autocomplete
                open={open}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                fullWidth
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                filterOptions={(x) => x}
                getOptionLabel={(option: Order) => option.project_name || ""}
                options={catalog}
                loading={loading}
                value={selectedOrder}
                onChange={(event: React.SyntheticEvent, value: any | null) => handleSelectCatalogItem(value)}
                onInputChange={(event, newInputValue) => {
                  setOrderName(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                    {...params}
                    label=""
                    id="productSelector"
                    fullWidth
                    variant="standard"
                    size="small"
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
            <div>
              <Label>{"Warrenty Length (days)"}</Label>
              <TextInput required type="number" value={period} onChange={(e) => setPeriod(e.target.valueAsNumber)} />
            </div>
            <div>
              <Label>Warranty Link</Label>
              <TextInput id="name" name="postContent" required value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
            <div className="max-w-md" id="textarea">
              <Label htmlFor="comment">Start Date</Label>
              <DatePicker value={startDate} onChange={(selectedDate) => setStartDate(selectedDate)} />
            </div>

            <div className="">
              <Label>Receipt</Label>
              <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                  <span className="font-medium text-gray-600">Drop files to Attach, or browse</span>
                </span>
                <input type="file" name="file_upload" multiple className="hidden" onChange={(e) => selectImages(e)} />
              </label>
            </div>
            {images.length !== 0 && (
              <div>
                <div className="flex flex-row overflow-y-scroll gap-2">
                  {images.map((image: Image) => (
                    <Image
                      key={image.url}
                      src={image?.url}
                      alt="Image"
                      width={300}
                      height={300}
                      className="object-cover rounded-md max-h-[300px] min-w-[300px]"
                    />
                  ))}
                  {imageUrls.map((image: Record<string, string>) => (
                    <Image
                      key={image.publicUrl}
                      src={image?.publicUrl}
                      alt="Image"
                      width={300}
                      height={300}
                      className="object-cover rounded-md max-h-[300px] min-w-[300px]"
                    />
                  ))}
                  {/* {images.length !== 0 && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleUploadImages} isProcessing={isUploading}>
                  {!isUploading && <AiOutlineCloudUpload size={20} />}
                  {isUploading ? "Uploading" : "Upload Images"}
                </Button>
              </div>
            )} */}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleCreateWarranty}>Submit</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
