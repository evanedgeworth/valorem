"use client";

import { Card, Toast, Table, FileInput, Label, Button } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
import MissingProductModal from "./missingProduct.modal";
type Product = Database["public"]["Tables"]["product-confirm"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"] & {
  order_id: {
    address?: string;
  };
};
type ProductArray = [Product];
import { HiCheck } from "react-icons/hi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
type Image = { data: File; url: string };
type ImgUrl = { publicUrl: string };

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [event, setEvent] = useState<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getProducts();
    getEvents();
  }, []);

  async function getEvents() {
    let { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single();
    if (event) {
      setEvent(event);
    }
  }

  async function getProducts() {
    let { data: products, error } = await supabase.from("product-confirm").select("*, order_id(address)").eq("event", params.id);
    if (products) {
      setProducts(products);
    }
  }

  async function getImages({ item }: { item: Product }) {
    let ImageUrls: ImgUrl[] = [];
    const { data: confirmationImages, error } = await supabase.storage.from("product-confirmation").list(params.id + "/" + item.id + "/", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (confirmationImages) {
      ImageUrls = await Promise.all(
        confirmationImages.map(async (image) => {
          const { data } = supabase.storage.from("product-confirmation").getPublicUrl(params.id + "/" + item.id + "/" + image.name, {});
          return data;
        })
      ).then((values) => {
        return values;
      });
    }
    return ImageUrls;
  }

  function ProductCard({ item }: { item: Product }) {
    const [images, setImages] = useState<Image[]>([]);
    const [imageUrls, setImageUrls] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showMissingModal, setShowMissingModal] = useState(false);

    useEffect(() => {
      getImageUrls();
    }, []);

    async function getImageUrls() {
      let ImageUrlsResponse = await getImages({ item });
      setImageUrls(ImageUrlsResponse);
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

      setImages(tempArr);
    }

    async function handleUploadImages() {
      setIsUploading(true);
      await Promise.all(
        images.map(async (image) => {
          await supabase.storage.from("product-confirmation").upload(params.id + "/" + item.id + "/" + uuidv4(), image.data, {
            cacheControl: "3600",
            upsert: false,
          });
        })
      );
      await getImageUrls();
      setImages([]);
      setIsUploading(false);
    }

    return (
      <Card key={item.id} className="overflow-x-auto">
        <div className="flex justify-between">
          <h5 className="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-white">{item.name}</h5>
          <MissingProductModal
            showModal={showMissingModal}
            setShowModal={setShowMissingModal}
            reload={() => {
              getProducts(), setShowToast(true);
            }}
            orderId={Number(params.id)}
          />
        </div>
        {imageUrls.length === 0 && images.length === 0 ? (
          <div className="">
            <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span className="flex items-center space-x-2">
                <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                <span className="font-medium text-gray-600">Drop files to Attach, or browse</span>
              </span>
              <input type="file" name="file_upload" multiple className="hidden" onChange={(e) => selectImages(e)} />
            </label>
          </div>
        ) : (
          <div>
            <div className="flex flex-row overflow-y-scroll gap-2">
              <label className="flex justify-center min-w-[300px] h-[300px] px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                  <span className="font-medium text-gray-600">Drop files to Attach, or browse</span>
                </span>
                <input type="file" name="file_upload" multiple className="hidden" onChange={(e) => selectImages(e)} />
              </label>
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
              {imageUrls.map((image: ImgUrl) => (
                <Image
                  key={image.publicUrl}
                  src={image?.publicUrl}
                  alt="Image"
                  width={300}
                  height={300}
                  className="object-cover rounded-md max-h-[300px] min-w-[300px]"
                />
              ))}
            </div>
            {images.length !== 0 && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleUploadImages} isProcessing={isUploading}>
                  {!isUploading && <AiOutlineCloudUpload size={20} />}
                  {isUploading ? "Uploading" : "Upload Images"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <section className="p-5">
      <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Material Delivery Confirmation</h5>
      <p className="mb-2 text-sm text-gray-900 dark:text-white">
        <b>Event Date: </b>
        {moment(event?.date_time).format("MMMM DD, YYYY HH:mm a")}
      </p>
      <p className="mb-2 text-sm text-gray-900 dark:text-white">
        <b>Address: </b>
        {event?.order_id.address}
      </p>
      <div className="flex justify-end mb-5"></div>
      <div className="flex flex-col flex-1 gap-4">
        {products.length >= 1 ? (
          products.map((item: Product) => <ProductCard item={item} key={item.id} />)
        ) : (
          <div className="mx-auto my-24">
            <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No products added</h5>
            <p className="mb-2 text-sm text-gray-400 dark:text-white">{`Select 'Add Product' to get started.`}</p>
          </div>
        )}
      </div>
      {showToast && (
        <Toast className="fixed bottom-10 right-10" duration={100}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Product added successfully.</div>
          <Toast.Toggle />
        </Toast>
      )}
    </section>
  );
}
