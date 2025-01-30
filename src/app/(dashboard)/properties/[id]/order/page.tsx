import OrderDetails from "./order-details";

export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: { orderId: string } }) {
  const propertyId = params.id;
  const orderId = searchParams.orderId;

  return <OrderDetails propertyId={propertyId} orderId={orderId} />;
}
