import { capitalize } from "@/utils/commonUtils";

export default function UserStatus({ status }: { status?: string }) {
  return (
    <div className="flex gap-2 items-center"> <span className="h-3 w-3 rounded-full" style={{ background: status === 'ACTIVE' ? '#0E9F6E' : status === 'PENDING' ? '#FF8A4C' : status === 'INACTIVE' ? 'red' : 'transparent' }} /> {capitalize(status)}</div>
  );
}