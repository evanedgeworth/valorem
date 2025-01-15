"use client";

import { UserContext } from "@/context/userContext";
import { Property, Scope } from "@/types";
import { parseAddress } from "@/utils/commonUtils";
import request from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { Card, Spinner, Table } from "flowbite-react";
import moment from "moment";
import { useContext, useMemo } from "react";
import OrderStatus from "../../order/orderStatus";
import Link from "next/link";

export default function PropertyDetails({ propertyId }: { propertyId: string }) {
  const { user, selectedOrganization, role } = useContext(UserContext);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['property', 'detail', propertyId],
    enabled: Boolean(propertyId),
    queryFn: async () => {
      const res = await request({
        url: `/properties/${propertyId}`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    }
  });

  const property = data as Property;

  const { data: dataScope, isLoading: tableIsLoading } = useQuery({
    queryKey: ['scopes', propertyId],
    queryFn: async () => {
      const res = await request({
        url: `/scope`,
        method: "GET",
        params: {
          organizationId: selectedOrganization?.organizationId,
          includeProperty: false,
          propertyId: propertyId
        },
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    enabled: Boolean(selectedOrganization?.organizationId && propertyId)
  });

  const orders: Scope[] = useMemo(() => {
    return dataScope?.scope ? dataScope?.scope : [];
  }, [dataScope?.scope]);

  if (isLoading && !property) {
    return (
      <div className="mx-auto mt-10">
        <Spinner />
      </div>
    )
  }

  return (
    <section className="p-5 w-full">
      <div>
        <Card>
          <div className="border-b border-b-gray-700 pb-2">
            <h1 className="text-2xl font-bold">{property.name}</h1>
          </div>
          <div>
            <p className="mb-2">
              <b>Address: </b>
              {parseAddress(property.address)}
            </p>
            <p className="mb-2">
              <b>Date Created: </b>
              {moment(property.createdAt).format("l")}
            </p>
            <p className="mb-2 font-semibold text-base">
              Details
            </p>
            <p className="mb-2">
              <b>Access Instructions: </b>
              {property.accessInstructions}
            </p>
            <p className="mb-2">
              <b>Notes: </b>
              {property.notes}
            </p>
          </div>
        </Card>
          <Table className="mt-4">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>PROJECT NAME</Table.HeadCell>
              <Table.HeadCell>CREATED DATE</Table.HeadCell>
              <Table.HeadCell>STATUS</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            {
              tableIsLoading ? (
                <Table.Body>
                  <Table.Cell colSpan={5}>
                  <div className="mx-auto"><Spinner /></div>
                  </Table.Cell>
                </Table.Body>
              ) : (
                <Table.Body className="divide-y">
                  {
                    orders.map(item => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>{item.projectName}</Table.Cell>
                        <Table.Cell>{moment(item.createdAt).format("ll")}</Table.Cell>
                        <Table.Cell>
                          <OrderStatus status={item.scopeStatus} />
                        </Table.Cell>
                        <Table.Cell>
                          <Link href={`/properties/${propertyId}/order?orderId=${item.id}`}>
                            View
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              )
            }
          </Table>
      </div>
    </section>
  )
}