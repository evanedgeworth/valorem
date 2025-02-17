import { Badge, FlowbiteColors } from "flowbite-react";

export default function OrderStatus({ status }: { status: string }) {
  let color: keyof FlowbiteColors = "gray";
  if (status === "REQUESTED") {
    color = "#FDF6B2";
  }

  if (status === "APPROVED") {
    color = "#008000";
  }
  return (
    <Badge size="xs" style={{ backgroundColor: color }} className="justify-center text-black">
      {status}
    </Badge>
  );
}
