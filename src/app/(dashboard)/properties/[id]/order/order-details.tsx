"use client";

import { Scope, ScopeItem } from "@/types";
import request from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Spinner } from "flowbite-react";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useMemo, useState } from "react";
import { parseCurrencyToNumber } from "@/utils/commonUtils";
import ActiveOrder from "@/app/(dashboard)/order/[id]/components/activeOrder";
import { UserContext } from "@/context/userContext";
import moment from "moment";
import { useToast } from "@/context/toastContext";
import ReviewModal from "./review.modal";

export default function OrderDetails({ propertyId, orderId }: { propertyId: string, orderId: string }) {
  const router = useRouter()
  const [addedProducts, setAddedProducts] = useState<ScopeItem[]>([]);
  const { categoryItems } = useContext(UserContext);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [actionModal, setActionModal] = useState<"APPROVE" | "REJECT" | "REVISION_REQUESTED" | null>(null);
  const { showToast } = useToast();

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

  const scopeItemRevision = order?.scopeItemRevisions[order.scopeItemRevisions.length - 1];

  const totalAmount = useMemo(() => {
    let total = 0;
    addedProducts?.forEach(item => {
      total += parseCurrencyToNumber(item.categoryItem?.targetClientPrice || "0") * item.quantity;
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
      setShowSubmitButton(false);
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

  async function populateOrder() {
    const formattedScopeItems = [...addedProducts].filter(item => item.status !== 'removed');
    await mutate({
      sendForApproval: true,
      scopeItems: formattedScopeItems,
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
        <div className="flex justify-between border-t border-t-gray-700 border-b border-b-gray-700 py-3 mb-3">
          <div className="flex gap-1 items-center">
            <button onClick={router.back}>
              <HiOutlineArrowSmLeft size={22} />
            </button>
            <h3 className="font-semibold text-xl">{order.projectName}</h3>
          </div>
          <div className="flex gap-4">
            <Button outline onClick={() => setActionModal("REJECT")}>Decline</Button>
            {
              showSubmitButton ? (
                <Button disabled={isPendingPopulate} onClick={populateOrder}>
                  {isPendingPopulate && <Spinner size="xs" />} Send for review
                </Button>
              ) : (
                <Button onClick={() => setActionModal("APPROVE")}>
                  Approve
                </Button>
              )
            }
          </div>
        </div>
        <div className="flex justify-between font-semibold border-t border-t-gray-700 border-b border-b-gray-700 py-3">
          <div>
            <p className="text-xl">Scope estimate as of {moment(order.dueDate).format('l')}</p>
          </div>
          <div className="flex gap-8 text-lg">
            <p>Order total</p>
            <p>{totalAmount}</p>
          </div>
        </div>
      </Card>
      <ActiveOrder
        isEditing={true}
        remove={(product) => {
          const filter = [...addedProducts].filter(item => item.id !== product.id);
          setAddedProducts([...filter]);
          setShowSubmitButton(true);
        }}
        edit={(newProduct) => {
          console.log(newProduct);
          const data = [...addedProducts].map(item => item.id === newProduct.id ? newProduct : item);
          setAddedProducts(data);
          setShowSubmitButton(true);
        }}
        add={(product) => {
          setAddedProducts([...addedProducts, product]);
          setShowSubmitButton(true);
        }}
        products={[...addedProducts]}
        orderId={orderId}
      />
      {
        actionModal && (
          <ReviewModal
            showModal={Boolean(actionModal)}
            isLoading={isPendingReview}
            handleCancel={() => setActionModal(null)}
            title={`Are you sure you want to ${actionModal === 'APPROVE' ? 'approve' : actionModal === 'REJECT' ? 'reject' : 'revision'}?`}
            handleConfirm={(note) => {
              mutateReview({ action: actionModal, note })
            }}
          />
        )
      }
    </div>
  )
}