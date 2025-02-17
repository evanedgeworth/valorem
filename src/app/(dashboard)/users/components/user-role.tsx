import { Badge, FlowbiteColors } from "flowbite-react";

export default function UserRole({ role }: { role: string }) {
  let color: keyof FlowbiteColors = "gray";
  if (role === "SENIOR PROJECT MANAGER") {
    color = "#633112";
  }

  if (role === "PROJECT MANAGER") {
    color = "#1E429F";
  }

  if (role === "JUNIOR PROJECT MANAGER") {
    color = "#374151";
  }

  if (role === "EXECUTIVE") {
    color = "#000000";
  }

  if (role === "ACCOUNTANT") {
    color = "#233876";
  }

  if (role === "CONTRACTOR") {
    color = "#374151";
  }

  return (
    <Badge size="xs" style={{ backgroundColor: color }} className="justify-center text-white">
      {role}
    </Badge>
  )
}
