import { Badge, FlowbiteColors } from "flowbite-react";

export default function OrderStatus({ status }: { status: string }) {
  let color: keyof FlowbiteColors = "gray";
  if (status === "REQUESTED") {
    color = "yellow";
  }

  if (status === "APPROVED") {
    color = "green";
  }
  return (
    <Badge size="xs" color={color} className="justify-center">
      {status}
    </Badge>
  );
}
