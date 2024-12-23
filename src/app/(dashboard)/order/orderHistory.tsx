import { formatToUSD } from "@/utils/commonUtils";
import { Spinner, Table, Timeline } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsArrowUpShort, BsArrowDownShort, BsPlus } from "react-icons/bs";
import DownloadPDF from "./downloadPDF";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { Order, OrderHistory as OrderHistoryType, ScopeItemRevision } from "@/types";
import OrderDetailHistory from "./[id]/components/history";

type OrderHistoryProps = {
  orderId: string
}

export default function OrderHistory({ orderId }: OrderHistoryProps) {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['scope', orderId],
    queryFn: async () => {
      const res = await request({
        url: `/scope/${orderId}`,
        method: "GET",
      })
      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res.data.message);
    },
  });



  return (
    <div>
      {isLoading && (
        <div>
          <Spinner />
        </div>
      )}
      {data && (
        <OrderDetailHistory order={data} />
      )}
    </div>
  )
}