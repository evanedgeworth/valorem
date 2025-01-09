import { Badge } from "flowbite-react";
import { BiSolidPackage } from "react-icons/bi";
import { HiCheck, HiClock } from "react-icons/hi";

export default function OrderStatus({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <Badge size="xs" color="success" className="justify-center" icon={HiClock}>
          Active
        </Badge>
      );
    case "fulfilled":
      return (
        <Badge size="xs" color="success" className="justify-center" icon={HiCheck}>
          Fulfilled
        </Badge>
      );
    case "approved":
      return (
        <Badge size="xs" color="cyan" className="justify-center whitespace-nowrap" icon={HiClock}>
          Approved
        </Badge>
      );
    case "closed":
      return (
        <Badge size="xs" color="yellow" className="justify-center whitespace-nowrap" icon={HiClock}>
          Closed
        </Badge>
      );
    case "ordered":
      return (
        <Badge size="xs" color="cyan" className="justify-center whitespace-nowrap" icon={BiSolidPackage}>
          Ordered
        </Badge>
      );
    default:
      return (
        <Badge size="xs" color="gray" className="justify-center">
          {status}
        </Badge>
      );
  }
}
