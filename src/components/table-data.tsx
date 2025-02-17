import { Table, Dropdown, Spinner } from "flowbite-react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ReactNode } from "react";
import Link from "next/link";

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  hidden?: boolean;
};

export type TableAction<T> = {
  label: string;
  onClick?: (row: T) => void;
  link?: (row: T) => string;
};

type TableDataProps<T> = {
  isLoading?: boolean;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
};

export default function TableData<T extends { id: string }>({ isLoading, data, columns, actions = [] }: TableDataProps<T>) {
  return (
    <>

      <Table striped className="w-full">
        <Table.Head>
          {columns
            .filter((item) => !item.hidden)
            .map((col) => (
              <Table.HeadCell key={col.key as string}>{col.label}</Table.HeadCell>
            ))}
          {actions.length > 0 && <Table.HeadCell className="w-9"></Table.HeadCell>}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((row) => (
            <Table.Row key={row.id}>
              {columns
                .filter((item) => !item.hidden)
                .map((col) => (
                  <Table.Cell key={col.key as string}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}</Table.Cell>
                ))}
              {actions.length > 0 && (
                <Table.Cell className="relative w-9">
                  <Dropdown
                    renderTrigger={() => <BiDotsVerticalRounded size={25} className="cursor-pointer" />}
                    label=""
                    className="!left-[-120px] min-w-[120px] !top-6 border-none"
                  >
                    {actions.map((action, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => action.onClick?.(row)}
                        href={action.link ? action.link(row) : undefined}
                        as={action.link ? Link : undefined}
                        className="dark:text-white"
                      >
                        {action.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {
        isLoading && (
          <div className="ml-auto mr-auto flex justify-center items-center h-[calc(100vh-385px)] text-center">
            <Spinner size="xl" />
          </div>
        )
      }
      {
        !isLoading && data.length === 0 && (
          <div className="mx-auto my-24 text-center">
            <h5 className="mb-2 text-2xl font-bold text-gray-600 dark:text-white">No Results</h5>
            <p className="mb-2 text-sm text-gray-400 dark:text-white">There are currently no data.</p>
          </div>
        )
      }
    </>
  );
}
