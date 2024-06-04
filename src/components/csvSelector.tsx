// components/CSVSelector.tsx
import React, { useRef, useState } from "react";
import CSVReader from "react-csv-reader";
import { Button, Checkbox, Label, Modal, Table, Select, Dropdown, TextInput } from "flowbite-react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { numberWithCommas } from "@/utils/commonUtils";

type Props = {
  onChange(data: string[][]): void;
};

const CSVSelector = ({
  showModal,
  setShowModal,
  orderId,
  addProduct,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  orderId: number;
  addProduct: (product: any) => void;
}) => {
  const [documentName, setDocumentName] = useState<string>("");
  const [documentData, setDocumentData] = useState<any>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: "greedy",
    transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, ""),
  };
  const selectedOrder = useRef<any>(null);
  const supabase = createClientComponentClient<Database>();

  // async function uploadProducts() {
  //   let formattedData: any = [];
  //   documentData.forEach((item: any) =>
  //     formattedData.push({
  //       description: item.description,
  //       quantity: item.qty,
  //       price: Number(item.amount.replace(/\s+/g, "").replace(/[^0-9.-]+/g, "")) || 0,
  //       type: item.roomname,
  //       orderId: orderId,
  //     })
  //   );

  //   let { error } = await supabase.from("products").insert(formattedData);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     handleConfirm();
  //   }
  // }

  function handleAddProduct() {
    addProduct(documentData);
    setShowModal(false);
  }

  function DocumentTable() {
    function handleInputChange(description: string, field: string, value: string) {
      // Update the state with the edited value
      let updatedArray = documentData.map((item: any) => (item.description === description ? { ...item, [field]: value } : item));
      setDocumentData(updatedArray);
    }

    function handleDeleteItem(description: string) {
      let filteredArray = documentData.filter((item: any) => item.description !== description);
      setDocumentData(filteredArray);
    }

    return (
      <Table>
        <Table.Head>
          <Table.HeadCell>Product Name</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {documentData.map((item: any, index: number) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.description}>
              <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.description}</Table.Cell>
              <Table.Cell>
                <TextInput value={item.quantity} type="number" onChange={(e) => handleInputChange(item.description, "qty", e.target.value)} />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-3">${item.price}</div>
              </Table.Cell>
              <Table.Cell className="">
                <div className="relative cursor-pointer">
                  <Dropdown renderTrigger={() => <BiDotsVerticalRounded size={25} />} label="" className="!left-[-50px] !top-6">
                    <Dropdown.Item onClick={() => handleDeleteItem(item.description)}>Delete</Dropdown.Item>
                  </Dropdown>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  function formatCSVData(data: any) {
    console.log(data);
    let filterEmpty = data.filter((row: any) => row.qty !== 0 && row.qty !== null && typeof row.qty !== "string");
    let filteredData = filterEmpty.map((item: any) => ({
      description: item.description,
      quantity: item.qty,
      price: Number(item.amount.replace(/\s+/g, "").replace(/[^0-9.-]+/g, "")) || 0,
      size: item.size || 0,
      type: item.roomname || "",
      orderId: orderId,
      status: "updated",
    }));
    setDocumentData(filteredData);
  }

  return (
    <div ref={rootRef}>
      <Button onClick={() => setShowModal(true)} outline>
        <AiOutlineCloudUpload size={22} color="rgb(75 85 99)" className="mr-3 text-gray-900 dark:text-white" />
        Upload
      </Button>
      <Modal show={showModal} size="3xl" popup onClose={() => setShowModal(false)} root={rootRef.current ?? undefined}>
        <Modal.Header />
        <Modal.Body className=" overflow-scroll">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Upload CSV</h3>
          {documentData.length === 0 ? (
            <div>
              <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
                  <span className="font-medium text-gray-600">Drop files to Attach, or browse</span>
                </span>
                <CSVReader cssClass="hidden" onFileLoaded={(data, fileInfo, originalFile) => formatCSVData(data)} parserOptions={papaparseOptions} />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <DocumentTable />
              <div className="flex justify-end">
                <Button onClick={handleAddProduct}>Add Products</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CSVSelector;
