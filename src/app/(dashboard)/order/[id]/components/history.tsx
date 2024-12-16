import { formatToUSD, parseCurrencyToNumber } from "@/utils/commonUtils";
import { Spinner, Table, Timeline } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsArrowUpShort, BsArrowDownShort, BsPlus } from "react-icons/bs";
import DownloadPDF from "../../downloadPDF";
import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";
import { OrderHistory as OrderHistoryType, Scope } from "@/types";

type OrderHistoryProps = {
  order: Scope;
  seeAll?: boolean;
}

export default function OrderDetailHistory({ order, seeAll }: OrderHistoryProps) {
  const router = useRouter();
  const orderId = order.id;
  const scopeItemRevisions = order.scopeItemRevisions || [];

  function PriceChangeStatus({ currentItem, previousItem }: { currentItem: number | null; previousItem: number | null }) {
    let status;
    status = (currentItem || 0) - (previousItem || 0);
    if (status > 0) {
      return (
        <div className="flex-row flex">
          <BsArrowUpShort color="rgb(132 204 22 / var(--tw-text-opacity))" />
          <span className="font-normal text-lime-500 text-sm">{formatToUSD(status)}</span>
        </div>
      );
    } else if (status < 0) {
      return (
        <div className="flex-row flex">
          <BsArrowDownShort color="rgb(224 36 36 / var(--tw-text-opacity))" />
          <span className="font-normal text-red-600 text-sm">{formatToUSD(status)}</span>
        </div>
      );
    } else return null;
  }

  function calculateCost(scopeItems: any[]) {
    let cost = 0;

    scopeItems?.forEach(item => {
      cost += parseCurrencyToNumber(item.targetClientPrice);
    });

    return cost;
  }

  return (
      <div className="p-4">
        <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Order history</h5>
        <Timeline>
          {(seeAll ? scopeItemRevisions : scopeItemRevisions.slice(0, 3)).map((item, index) => {
            const cost = calculateCost(item.scopeItems);
            return (
              <Timeline.Item key={index}>
                <Timeline.Point />
                <Timeline.Content>
                  <div className="flex flex-row justify-between">
                    <div>
                      <Timeline.Time>{moment(item.createdAt).format("MMMM DD, YYYY")}</Timeline.Time>
                      <Timeline.Title>
                        <p>{item.revision}</p>
                        <span className="flex flex-row text-sm">
                          <p className="flex gap-1">
                            <span>Total:</span>{formatToUSD(cost)}
                          </p>
                          {index !== 0 && <PriceChangeStatus currentItem={cost} previousItem={calculateCost(scopeItemRevisions?.[index - 1]?.scopeItems)} />}
                        </span>
                        <p className="text-sm">
                          {"Items: "}
                          {item.scopeItems.length}
                        </p>
                        <p className="text-sm">
                          {"Status: "}
                          {item.status}
                        </p>
                      </Timeline.Title>
                    </div>
                    {/* <DownloadPDF orderId={item.id} id={item.id} /> */}
                  </div>
                </Timeline.Content>
              </Timeline.Item>
            );
          })}
        </Timeline>
        {seeAll ? null : scopeItemRevisions.length > 3 && (
          <div className="flex justify-center items-center">
            <Link
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 text-center"
              href={{
                pathname: `/order/${encodeURIComponent(orderId)}`,
                query: { orderId, view: "history" },
              }}
            >
              View More
            </Link>
          </div>
        )}
        {scopeItemRevisions.length === 0 && (
          <div>
            <p>Empty</p>
          </div>
        )}
      </div>
  )
}