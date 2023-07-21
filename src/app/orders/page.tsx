"use client";

import { Table } from "flowbite-react";

export default function Page() {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Order ID</Table.HeadCell>
        <Table.HeadCell>Project Name</Table.HeadCell>
        <Table.HeadCell>Starting Date</Table.HeadCell>
        <Table.HeadCell>Address</Table.HeadCell>
        <Table.HeadCell>Scope</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">View Order</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            25798
          </Table.Cell>
          <Table.Cell>1377 Marquee Drive</Table.Cell>
          <Table.Cell>September 16, 2023</Table.Cell>
          <Table.Cell>1377 Marquee Drive , Fresco, Ca</Table.Cell>
          <Table.Cell>Flooring</Table.Cell>
          <Table.Cell>Open</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            25798
          </Table.Cell>
          <Table.Cell>1377 Marquee Drive</Table.Cell>
          <Table.Cell>September 16, 2023</Table.Cell>
          <Table.Cell>1377 Marquee Drive , Fresco, Ca</Table.Cell>
          <Table.Cell>Flooring</Table.Cell>
          <Table.Cell>Open</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            25798
          </Table.Cell>
          <Table.Cell>1377 Marquee Drive</Table.Cell>
          <Table.Cell>September 16, 2023</Table.Cell>
          <Table.Cell>1377 Marquee Drive , Fresco, Ca</Table.Cell>
          <Table.Cell>Flooring</Table.Cell>
          <Table.Cell>Open</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
