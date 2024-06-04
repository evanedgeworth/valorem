"use client";

import { Button, Table, Checkbox, Dropdown, Label, TextInput, Spinner } from "flowbite-react";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { BiSortDown } from "react-icons/bi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";
import moment from "moment";
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
import AddEventModal from "./components/addEvent.modal";

export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [order, setOrder] = useState<Order>();
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<"quantity" | "type">("quantity");
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getProducts();
  }, [sortBy, searchInput]);

  async function getProducts() {
    setTableIsLoading(true);
    let searchProducts = supabase.from("products").select("*").eq("orderId", params.id).order(sortBy, { ascending: true });
    if (searchInput) searchProducts.textSearch("description", searchInput);

    await searchProducts.then(({ data: products, error }) => {
      if (error) {
        console.error(error);
      }
      if (products) {
        setProducts(products);
      }
    });
    setTableIsLoading(false);
  }

  function handleCheckProduct(item: Product) {
    if (addedProducts.some((product) => product.id === item.id)) {
      let filteredArray = addedProducts.filter((product) => product.id !== item.id);
      setAddedProducts(filteredArray);
    } else {
      setAddedProducts([...addedProducts, item]);
    }
  }

  return (
    <section className="p-5">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h5 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Add Event</h5>
          <p className="mb-2 text-md text-gray-700 dark:text-white">select the products you would like to schedule an event for.</p>
        </div>
        {addedProducts.length > 0 && <AddEventModal products={addedProducts} orderId={params.id} />}
      </div>
      <div className="flex gap-4 mb-4">
        <TextInput placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} className="w-60" />

        <Dropdown label={<BiSortDown size={17} />} arrowIcon={false} color="white">
          <Dropdown.Header>
            <strong>Sort By</strong>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => setSortBy("quantity")}>Quantity</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("type")}>Type</Dropdown.Item>
        </Dropdown>
      </div>
      {tableIsLoading ? (
        <div className=" ml-auto mr-auto mt-72 text-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <Table striped className="w-full">
          <Table.Head>
            <Table.HeadCell className="p-4">{/* <Checkbox onClick={() => setAddedProducts(...addedProducts, )}/> */}</Table.HeadCell>
            <Table.HeadCell>Item Name</Table.HeadCell>
            <Table.HeadCell>Quantity</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {products.map((item) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                <Table.Cell className="p-4">
                  <Checkbox
                    name="checkbox"
                    value={"true"}
                    onChange={() => handleCheckProduct(item)}
                    checked={addedProducts.some((product) => product.id === item.id)}
                  />
                </Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </section>
  );
}
