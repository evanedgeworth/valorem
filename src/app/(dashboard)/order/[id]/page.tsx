"use server";
import request from "@/utils/request";
import OrderDetails from "./order-details";

async function getOrder(orderId: string) {
  const response = await request({
    url: `/order/${orderId}`,
    params: { includeLineItems: true },
    method: "GET",
  });

  return response.data;
}

// async function getProducts(orderId: string) {
//   const { data } = await request({
//     url: `/order/${orderId}`,
//     method: "GET",
//   });

//   return data;
// }

export default async function Page({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  return <></>;
  // return <OrderDetails order={order} />;
}
