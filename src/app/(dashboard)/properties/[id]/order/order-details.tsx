"use client";

import { Scope, ScopeItem } from "@/types";
import request from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Spinner } from "flowbite-react";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useMemo, useState } from "react";
import { numberWithCommas, parseCurrencyToNumber } from "@/utils/commonUtils";
import ActiveOrder from "@/app/(dashboard)/order/[id]/components/activeOrder";
import { UserContext, useUserContext } from "@/context/userContext";
import moment from "moment";
import { useToast } from "@/context/toastContext";
import ReviewModal from "./review.modal";
import ImportModal from "@/components/import.modal";

type ScopeStatus = "REQUESTED" | "SCHEDULED" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export default function OrderDetails({ propertyId, orderId }: { propertyId: string, orderId: string }) {
  const router = useRouter()
  const [addedProducts, setAddedProducts] = useState<ScopeItem[]>([]);
  const { categoryItems, role } = useUserContext();
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [actionModal, setActionModal] = useState<"APPROVE" | "REJECT" | "REVISION_REQUESTED" | "REQUEST_REVIEW" | null>(null);
  const { showToast } = useToast();
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', 'detail', orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const res = await request({
        url: `/scope/${orderId}`,
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    }
  });

  const order = data as Scope;
  const scopeStatus = order?.scopeStatus;
  const assigneeId = order?.property?.assigneeId;

  const scopeItemRevision = order?.scopeItemRevisions[order.scopeItemRevisions.length - 1];

  const totalAmount = useMemo(() => {
    let total = 0;
    addedProducts?.forEach(item => {
      total += parseCurrencyToNumber(item.targetClientPrice ?? item.categoryItem?.targetClientPrice ?? "0") * item.quantity;
    });
    return total;
  }, [addedProducts]);


  useEffect(() => {
    if (scopeItemRevision && categoryItems.length > 0) {
      setAddedProducts(scopeItemRevision.scopeItems.map(item => ({
        ...item,
        categoryItem: categoryItems.find(c => c.id === item.categoryItemId)
      })));
    }
  }, [scopeItemRevision, categoryItems]);

  const { mutate, isPending: isPendingPopulate } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope/${orderId}/populate`,
        params: {
          sendForApproval: body.sendForApproval ?? false,
        },
        method: 'POST',
        data: body
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess: () => {
      showToast('Successfully updated data.');
      setIsEdited(false);
      setActionModal(null);
      refetch();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  const { mutate: mutateReview, isPending: isPendingReview } = useMutation({
    mutationFn: async (body: {
      action: "APPROVE" | "REJECT" | "REVISION_REQUESTED",
      note: string
    }) => {
      const res = await request({
        url: `/scope/${orderId}/review`,
        method: 'POST',
        data: body
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess: () => {
      showToast('Successfully updated data.');
      setActionModal(null);
      refetch();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  const { mutate: mutateInitiate, isPending: isPendingInitiate } = useMutation({
    mutationFn: async (body: {
      scopeStatus: ScopeStatus,
      reason: string
    }) => {
      const res = await request({
        url: `/scope/${orderId}/initiate`,
        method: 'PATCH',
        data: body
      });

      if (res?.status === 200) {
        return res.data;
      }
      throw Error(res?.data?.message);
    },
    onSuccess: () => {
      showToast('Successfully updated data.');
      setActionModal(null);
      refetch();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    }
  });

  async function populateOrder(sendForApproval: boolean) {
    const formattedScopeItems = [...addedProducts].filter(item => item.status !== 'removed');
    await mutate({
      scopeItems: formattedScopeItems.map(item => ({
        "categoryItemId": item.categoryItemId,
        "area": item.area,
        "quantity": item.quantity,
      })),
      sendForApproval
    });
  }

  if (isLoading) {
    return (
      <div className="mx-auto mt-10">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="w-full p-5">
      <Card className="mb-4">
        <div className="flex justify-between border-t border-t-gray-200 border-b border-b-gray-200 py-3 mb-3 dark:border-b-gray-700 dark:border-t-gray-700">
          <div className="flex gap-1 items-center">
            <button onClick={router.back}>
              <HiOutlineArrowSmLeft size={22} />
            </button>
            <h3 className="font-semibold text-xl">{order.projectName}</h3>
          </div>
          {
            isEdited ? (
              <div className="flex gap-4">
                <Button color="gray" isProcessing={isPendingPopulate} onClick={() => populateOrder(false)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsOpenImport(true)}
                >
                  Import
                </Button>
                {
                  scopeStatus === "REQUESTED" && !assigneeId && ["PROJECT MANAGER", "JUNIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                  )
                }
                {
                  scopeStatus === "REQUESTED" && assigneeId && ["SENIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                  )
                }
                {
                  scopeStatus === "SCHEDULED" && ["PROJECT MANAGER", "JUNIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("REVISION_REQUESTED")}>
                        Request changes
                      </Button>
                      <Button color="gray" onClick={() => setActionModal("REQUEST_REVIEW")}>
                        Send for review
                      </Button>
                    </>
                  )
                }
                {
                  scopeStatus === "SUBMITTED" && ["CLIENT", "SENIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
                  )
                }
              </div>
            )
          }
        </div>
        <div className="flex justify-between font-semibold border-t border-t-gray-200 border-b border-b-gray-200 py-3 dark:border-b-gray-700 dark:border-t-gray-700">
          <div>
            <p className="text-xl">Scope estimate as of {moment(order.dueDate).format('l')}</p>
          </div>
          <div className="flex gap-8 text-lg">
            <p>Order total</p>
            <p>$ {numberWithCommas(totalAmount)}</p>
          </div>
        </div>
      </Card>
      <ActiveOrder
        isEditing={scopeStatus !== "APPROVED"}
        remove={(product) => {
          const filter = [...addedProducts].filter(item => item.id !== product.id);
          setAddedProducts([...filter]);
          setIsEdited(true);
        }}
        edit={(newProduct) => {
          const data = [...addedProducts].map(item => item.id === newProduct.id ? newProduct : item);
          setAddedProducts(data);
          setIsEdited(true);
        }}
        add={(product) => {
          setAddedProducts([...addedProducts, product]);
          setIsEdited(true);
        }}
        products={[...addedProducts]}
        orderId={orderId}
      />
      {
        actionModal && (
          <ReviewModal
            showModal={Boolean(actionModal)}
            isLoading={isPendingReview || isPendingInitiate || isPendingPopulate}
            handleCancel={() => setActionModal(null)}
            title={`Are you sure you want to ${actionModal?.replaceAll('_', ' ').toLowerCase()}?`}
            handleConfirm={(note) => {
              if (scopeStatus === "REQUESTED") {
                mutateInitiate({ scopeStatus: "REJECTED", reason: note });
              } else if (scopeStatus === "SCHEDULED") {
                if (actionModal === "REJECT") {
                  mutateInitiate({ scopeStatus: "REJECTED", reason: note });
                } else if (actionModal === "REVISION_REQUESTED") {
                  mutateReview({ action: "REVISION_REQUESTED", note });
                } else if (actionModal === "REQUEST_REVIEW") {
                  populateOrder(true);
                }
              } else if (scopeStatus === "SUBMITTED") {
                if (actionModal === "REJECT") {
                  mutateInitiate({ scopeStatus: "REJECTED", reason: note });
                } else if (actionModal === "APPROVE") {
                  mutateReview({ action: "APPROVE", note });
                }
              }
            }}
          />
        )
      }
      <ImportModal
        showModal={isOpenImport}
        setShowModal={(v) => setIsOpenImport(v)}
        onSubmit={(data) => {
          setAddedProducts(data.map(item => ({
            quantity: item.quantity,
            area: item.area,
            categoryItem: {
              lineItem: item.productName,
              targetClientPrice: item.price,
              taskDescription: item.productDescription
            },
            id: `${item.aren}-${item.product}`
          } as any)));
          setIsOpenImport(false);
        }}
      />
    </div>
  )
}