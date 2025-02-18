"use client";

import { useMemo, useRef, useState } from "react";
import { Button, FileInput, Label, Modal, Radio, Select, Table, TextInput, Badge } from "flowbite-react";
import Papa from "papaparse";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toTitleCase } from "@/utils/commonUtils";
import request from "@/utils/request";
import { useUserContext } from "@/context/userContext";

export default function ImportModal({
  showModal,
  setShowModal,
  onSubmit,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onSubmit: (data: any[]) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState('upload');
  const [data, setData] = useState<string[][]>([]);
  const [header, setHeader] = useState('yes');
  const [activeIndex, setActiveIndex] = useState(1);
  const [mapping, setMapping] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { selectedOrganization } = useUserContext();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStep("header");
    Papa.parse(file, {
      complete: (result) => {
        setData(result.data as string[][]);
      },
      skipEmptyLines: true
    });
  };


  const handleCancel = () => {
    setShowModal(false);
    setStep('upload');
  }

  const isHeader = header === 'yes';
  const total = data.length;

  const options = ["lineItem", "taskDescription", "targetClientPrice", "costCategory", "costCode", "options", "notes", "uom", "originalMaterialId", "targetVendorPrice", "equipmentUsageRental", "area", "quantity"];
  const requiredOptions = ["lineItem", "taskDescription", "targetClientPrice", "area", "quantity"];

  const isValidImport = useMemo(() => requiredOptions.every((key) => key in mapping), [mapping]);
  const missingOptions = useMemo(() => options.filter((key) => !(key in mapping)), [mapping]);

  const getOptionValue = (value: string) => {
    let result = "";
    Object.keys(mapping).forEach(item => {
      if (mapping[item] === value) {
        result = item;
      }
    });
    return result;
  }

  const handleImport = async () => {
    const items: any[] = [];
    data.forEach((item, i) => {
      if (i === 0 && header === 'yes') {
        return;
      }
  
      const product: { [key: string]: string | number } = { materialId: '' };
      options.forEach(option => {
        const index = parseInt(mapping[option], 10);
        if (!isNaN(index) && index >= 0 && index < item.length) {
          product[option] = option === "quantity" ? Number(item[index]) : item[index];
        }
      });
  
      items.push(product);
    });
  

    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    setIsLoading(true);
    for (const batch of batches) {
      try {
        const res = await request({
          url: `/custom-catalogs`,
          method: 'POST',
          data: {
            organizationId: selectedOrganization?.organizationId,
            newCategoryItems: batch
          }
        });
        console.log("Response:", res);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsLoading(false);
  };
  

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="4xl" onClose={handleCancel} root={rootRef.current ?? undefined}>
        <Modal.Header>
          Import CSV
        </Modal.Header>
        <Modal.Body className="overflow-auto">
          <div>
            {
              step === "upload" && (
                <div className="">
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop CSV
                      </p>
                    </div>
                    <FileInput id="dropzone-file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                  </Label>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancel} outline>Cancel</Button>
                  </div>
                </div>
              )
            }
            {
              step === "header" && (
                <div>
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <fieldset onChange={(e: any) => setHeader(e.target.value)} defaultValue={header} className="flex max-w-md flex-col gap-4 relative">
                        <legend className="mb-4">Is this your CSV's header row?</legend>
                        <div className="flex items-center gap-2">
                          <Radio id="united-state" name="header" value="yes" defaultChecked />
                          <Label htmlFor="united-state">Yes, this is the header</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio id="germany" name="header" value="no" />
                          <Label htmlFor="germany">No, this is an item</Label>
                        </div>

                      </fieldset>
                      <div className="absolute top-2 right-2">
                        <FaArrowRightLong />
                      </div>
                    </div>
                    <div className="overflow-hidden relative max-h-48">
                      <Table className="divide-x divide-y border">
                        <Table.Head className="">
                          {
                            data[0]?.map(item => (
                              <Table.HeadCell className="truncate border max-w-[150px] p-2 normal-case">{item}</Table.HeadCell>
                            ))
                          }
                        </Table.Head>
                        <Table.Body className="divide-y divide-x">
                          {
                            data.slice(1, 6).map((item, index) => (
                              <Table.Row key={index} className="divide-x">
                                {item.map(row => (
                                  <Table.Cell className="truncate max-w-[150px] p-2">{row}</Table.Cell>
                                ))}
                              </Table.Row>
                            ))
                          }
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancel} outline>Cancel</Button>
                    <Button onClick={() => {
                      setStep('mapping');
                      if (isHeader) {
                        setActiveIndex(1);
                      } else {
                        setActiveIndex(0);
                      }
                    }}>Continue</Button>
                  </div>
                </div>
              )
            }

            {
              step === "mapping" && (
                <div>
                  <div className="border-b py-1 flex justify-between">
                    <h4 className="text-2xl">Field configuration</h4>
                    <div className="flex gap-1 items-center">
                      <p className="mr-2">Displaying item {activeIndex + 1} of {total}</p>
                      <Button size="xs"
                        onClick={() => setActiveIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                      >
                        <IoIosArrowBack />
                      </Button>
                      <Button size="xs"
                        onClick={() => setActiveIndex(activeIndex + 1)}
                        disabled={(activeIndex + 1) >= total}
                      >
                        <IoIosArrowForward />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    {
                      data[0]?.map((item, index) => {
                        const value = getOptionValue(index.toString());
                        return (
                          <div className="mt-1" key={index}>
                            <p className="font-semibold mb-1">{isHeader ? item : `Index ${index}`}</p>
                            <div className="grid grid-cols-[3fr_80px_2fr] gap-2">
                              <TextInput
                                disabled
                                value={data[activeIndex][index]}
                                color={value ? "success" : undefined}
                              />
                              <div className="items-center gap-2 flex">
                                <FaArrowRightLong /> map to
                              </div>
                              <Select
                                onChange={(e) => {
                                  setMapping({
                                    ...mapping,
                                    [e.target.value]: index.toString()
                                  });
                                }}
                                value={value}
                                color={value ? "success" : undefined}
                              >
                                <option value="">Select field...</option>
                                {
                                  options.map(option => (
                                    <option value={option}>{toTitleCase(option)}</option>
                                  ))
                                }
                              </Select>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )
            }
          </div>
        </Modal.Body>
        {
          step === "mapping" && (
            <Modal.Footer>
              <div className="flex-1">
                {
                  !isValidImport && (
                    <div>
                      <p>Please map the fields</p>
                      <div className="flex flex-wrap gap-1">
                        {
                          missingOptions.map(item => (
                            <Badge key={item}>{toTitleCase(item)}</Badge>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
                <div className="flex justify-end gap-2 mt-2">
                  <Button isProcessing={isLoading} disabled={!isValidImport} onClick={handleImport}>Import {isHeader ? total - 1 : total} data</Button>
                </div>
              </div>
            </Modal.Footer>
          )
        }
      </Modal>
    </div>
  )
}
