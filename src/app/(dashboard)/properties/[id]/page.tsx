import OrderDetails from "./property-details";

export default async function Page({ params }: { params: { id: string } }) {
  const propertyId = params.id;

  return <OrderDetails propertyId={propertyId} />;
}
