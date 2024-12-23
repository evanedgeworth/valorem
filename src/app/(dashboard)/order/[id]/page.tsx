import OrderDetails from "./order-details";

export default async function Page({ params }: { params: { id: string } }) {
  const orderId = params.id;

  return <OrderDetails orderId={orderId} />;
}
