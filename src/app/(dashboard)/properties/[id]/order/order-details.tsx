"use client";

import { Scope, ScopeItem } from "@/types";
import request from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Spinner } from "flowbite-react";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from "react";
import { generateUUID, numberWithCommas, parseCurrencyToNumber } from "@/utils/commonUtils";
import ActiveOrder from "@/app/(dashboard)/order/[id]/components/activeOrder";
import { useUserContext } from "@/context/userContext";
import moment from "moment";
import { useToast } from "@/context/toastContext";
import ReviewModal from "./review.modal";
import ImportModal from "@/components/import.modal";
import OrderStatus from "@/app/(dashboard)/order/orderStatus";
import { roleMapper } from "@/utils/constants";

type ScopeStatus = "REQUESTED" | "SCHEDULED" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export default function OrderDetails({ propertyId, orderId }: { propertyId: string, orderId: string }) {
  const router = useRouter()
  const [addedProducts, setAddedProducts] = useState<ScopeItem[]>([]);
  const { categoryItems, role, selectedOrganization, handleGetCustomCatalog, customCategoryItems } = useUserContext();
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [actionModal, setActionModal] = useState<"APPROVE" | "REJECT" | "REVISION_REQUESTED" | "REQUEST_REVIEW" | null>(null);
  const { showToast } = useToast();
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false);
  const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
  const [errorImport, setErrorImport] = useState<any[]>([]);

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
  const scopeItemRevisionByPM = order?.scopeItemRevisions[order.scopeItemRevisions.length - 2];

  const totalAmount = useMemo(() => {
    let total = 0;
    addedProducts?.forEach(item => {
      total += parseCurrencyToNumber(item.targetClientPrice ?? item.categoryItem?.targetClientPrice ?? "0") * item.quantity;
    });
    return total;
  }, [addedProducts]);

  useEffect(() => {
    if (scopeItemRevision && categoryItems.length > 0) {
      setAddedProducts(scopeItemRevision.scopeItems.map((item, index) => ({
        ...item,
        categoryItem: categoryItems.find(c => c.id === item.categoryItemId),
        before: role?.roleName !== "CLIENT" && scopeStatus === 'IN_REVIEW' && scopeItemRevision.status !== "APPROVED" ? scopeItemRevisionByPM?.scopeItems?.[index] : undefined
      })));
    }
  }, [scopeItemRevision, categoryItems, scopeStatus]);

  function cancelEdit() {
    setAddedProducts(scopeItemRevision.scopeItems.map(item => ({
      ...item,
      categoryItem: categoryItems.find(c => c.id === item.categoryItemId)
    })));
    setIsEdited(false);
  }

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

  const { mutate: mutateReview, mutateAsync: mutateAsyncReview, isPending: isPendingReview } = useMutation({
    mutationFn: async (body: {
      action: "APPROVE" | "REJECT" | "REVISION_REQUESTED",
      note: string,
      shouldSkipNotif?: boolean,
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
    onSuccess: (res, body) => {
      if (!body.shouldSkipNotif) {
        showToast('Successfully updated data.');
        setActionModal(null);
        refetch();
      }
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
    if (role?.roleName === 'CLIENT') {
      await mutateAsyncReview({ action: 'REVISION_REQUESTED', note: '', shouldSkipNotif: true });
    }
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

  const handleImport = async (data: any[]) => {
    const items = data.map(item => ({
      ...item,
      materialId: item.materialId || "",
      quantity: Number(item.quantity)
    }));

    const categoryMap = new Map([...categoryItems, ...customCategoryItems].map(item => [item.lineItem.toLowerCase(), item]));

    const foundItems: any[] = [];
    const newItems: any[] = [];

    items.forEach(item => {
      if (categoryMap.has(item.lineItem.toLowerCase())) {
        foundItems.push(item);
      } else {
        newItems.push(item);
      }
    });

    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < newItems.length; i += batchSize) {
      batches.push(newItems.slice(i, i + batchSize));
    }

    setIsLoadingImport(true);
    const errorItem: any[] = [];
    for (const batch of batches) {
      const res = await request({
        url: `/custom-catalogs`,
        method: 'POST',
        data: {
          organizationId: selectedOrganization?.organizationId,
          newCategoryItems: batch
        }
      });
      if (res && res?.status !== 200) {
        errorItem.push(...batch.map(item => ({ ...item, error: res?.data?.message })));
      }
    }

    if (errorItem.length > 0) {
      setErrorImport(errorItem);
      return;
    }

    const resCategoryItems = newItems.length === 0 ? customCategoryItems : await handleGetCustomCatalog(selectedOrganization?.organizationId ?? "");

    const categoryItemMap = new Map([...categoryItems, ...resCategoryItems].map(item => [item.lineItem.toLowerCase(), item]));
    const products: any[] = [];
    [...foundItems, ...newItems].forEach((item) => {
      const categoryItem = categoryItemMap.get(item.lineItem.toLowerCase());

      if (categoryItem) {
        products.push({
          categoryItemId: categoryItem.id,
          categoryItem,
          quantity: item.quantity,
          area: item.area,
          orderId,
          status: "new",
          id: categoryItem.id + item.area,
        })
      }
    });

    setAddedProducts([...addedProducts, ...products]);

    setIsLoadingImport(false);
    setIsOpenImport(false);
    setIsEdited(true);

    showToast("Successfully imported data.", "success");
  }


  const approval = order.approvalChain.find(item => (roleMapper[item.role] === role?.roleName) || (role?.roleName === 'SENIOR PROJECT MANAGER' ? ['PM'].includes(item.role) : false));
  const isApproved = approval?.status === 'APPROVED';

  const isEditing = !["APPROVED", "REQUESTED"].includes(scopeStatus);
  const isAdding = role?.roleName === 'CLIENT' ? false : !["APPROVED", "REQUESTED"].includes(scopeStatus);
  const isDeleting = isAdding;

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
                <Button color="gray" outline onClick={cancelEdit}>Cancel</Button>
                <Button color="gray" isProcessing={isPendingPopulate || isPendingReview} onClick={() => populateOrder(true)}>
                  Send for review
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                {
                  order?.scopeItemRevisions?.length === 0 && isAdding && (
                    <Button
                      onClick={() => setIsOpenImport(true)}
                    >
                      Import
                    </Button>
                  )
                }
                {
                  !isApproved && scopeStatus === "REQUESTED" && !assigneeId && ["PROJECT MANAGER", "JUNIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
                  )
                }
                {
                  !isApproved && scopeStatus === "REQUESTED" && assigneeId && ["SENIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
                  )
                }
                {
                  !isApproved && ["SCHEDULED", "IN_REVIEW"].includes(scopeStatus) && ["PROJECT MANAGER", "JUNIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("REQUEST_REVIEW")}>
                        Send for review
                      </Button>
                    </>
                  )
                }
                {
                  !isApproved && ["SUBMITTED", "IN_REVIEW"].includes(scopeStatus) && ["SENIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
                  )
                }
                {
                  !isApproved && scopeStatus === "SUBMITTED" && ["CLIENT"].includes(role?.roleName || "") && (
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
        <div className="flex justify-between border-b border-b-gray-200 pb-3 dark:border-b-gray-700">
          <div>
            <p className="text-base">Scope Status</p>
          </div>
          <div className="flex gap-8 text-lg">
            <OrderStatus status={order.scopeStatus} />
          </div>
        </div>
        <div>
          <p className="text-lg font-bold">Approval:</p>
          {
            order.approvalChain?.map(item => (
              <div key={item.role} className="border-b border-b-gray-200 dark:border-b-gray-700 py-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p>{roleMapper[item.role] || item.role}</p>
                    {item.note && <p className="text-sm">
                      <b>Note: </b>
                      <span className="dark:text-gray-400">{item.note}</span>
                    </p>}
                  </div>
                  <OrderStatus status={item.status} />
                </div>
              </div>
            ))
          }
        </div>
      </Card>
      <ActiveOrder
        isAdding={isAdding}
        isDeleting={isDeleting}
        isEditing={isEditing}
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
                if (actionModal === "APPROVE") {
                  mutateInitiate({ scopeStatus: "SCHEDULED", reason: note });
                } else {
                  mutateInitiate({ scopeStatus: "REJECTED", reason: note });
                }
              } else {
                if (actionModal === "REJECT") {
                  mutateInitiate({ scopeStatus: "REJECTED", reason: note });
                } else if (actionModal === "REVISION_REQUESTED") {
                  mutateReview({ action: "REVISION_REQUESTED", note });
                } else if (actionModal === "APPROVE") {
                  mutateReview({ action: "APPROVE", note });
                } else if (actionModal === "REQUEST_REVIEW") {
                  populateOrder(true);
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
          handleImport(data);
        }}
        options={["area", "quantity", "lineItem", "taskDescription", "targetClientPrice", "costCategory", "costCode", "options", "notes", "uom", "originalMaterialId", "materialId", "targetVendorPrice", "equipmentUsageRental"]}
        requiredOptions={["lineItem", "taskDescription", "targetClientPrice", "area", "quantity"]}
        errors={errorImport}
        isLoading={isLoadingImport}
      />
    </div>
  )
}