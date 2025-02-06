"use client";

import { useRef, useState } from "react";
import { Button, FileInput, Label, Modal, Radio, Select, Table, TextInput } from "flowbite-react";
import Papa from "papaparse";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export default function ImportModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState('upload');
  const [data, setData] = useState<string[][]>([]);
  const [header, setHeader] = useState('yes');
  const [activeIndex, setActiveIndex] = useState(1);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStep("header");
    Papa.parse(file, {
      complete: (result) => {
        setData(result.data as string[][]);
      },
    });
  };


  const handleCancel = () => {
    setShowModal(false);
    setStep('upload');
  }

  const isHeader = header === 'yes';
  const total = data.length;
  console.log(data);

  const options = ["Product", "Area", "Quantity"]

  return (
    <div ref={rootRef}>
      <Modal show={showModal} size="2xl" onClose={handleCancel} root={rootRef.current ?? undefined}>
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
                  <div className="border-b pb-2 flex justify-between">
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
                      data[0]?.map((item, index) => (
                        <div className="mt-1" key={index}>
                          <p className="font-semibold mb-1">{isHeader ? item : `Index ${index}`}</p>
                          <div className="grid grid-cols-[3fr_80px_2fr] gap-2">
                            <TextInput
                              disabled
                              value={data[activeIndex][index]}
                            />
                            <div className="items-center gap-2 flex">
                              <FaArrowRightLong /> Map to
                            </div>
                            <Select>
                              <option disabled value="">Select field...</option>
                              {
                                options.map(option => (
                                  <option>{option}</option>
                                ))
                              }
                            </Select>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
        </Modal.Body>
        {
          step === "mapping" && (
            <Modal.Footer className="flex justify-end gap-2">
              <Button>Import {isHeader ? total - 1 : total} data</Button>
            </Modal.Footer>
          )
        }
      </Modal>
    </div>
  )
}