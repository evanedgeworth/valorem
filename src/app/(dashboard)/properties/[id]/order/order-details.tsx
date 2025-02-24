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

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (body: any) => {
      const res = await request({
        url: `/scope/${orderId}`,
        method: 'PUT',
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

  async function updateOrder() {
    const formattedScopeItems = [...addedProducts].filter(item => item.status !== 'removed');
    const now = new Date();
    const body: Scope = {
      ...order,
      scopeItemRevisions: [...order.scopeItemRevisions.map(item => ({ ...item, status: 'REVISED' })), {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        status: 'PENDING',
        revision: order.scopeItemRevisions.length + 1,
        internalRevision: true,
        scopeItems: formattedScopeItems.map(item => ({
          id: generateUUID(),
          updatedAt: now.toISOString(),
          createdAt: now.toISOString(),
          categoryItemId: item.categoryItemId,
          isCustomized: false,
          area: item.area,
          quantity: item.quantity,
          targetClientPrice: item.targetClientPrice,
          scopeItemImages: item.scopeItemImages,
          internalComments: item.internalComments,
          externalComments: item.externalComments
        })),
      }]
    }

    mutateUpdate(body);
  }

  async function populateOrder(sendForApproval: boolean) {
    if (role?.roleName === 'CLIENT') {
      updateOrder();
    } else {
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

    if (selectedOrganization?.organizationId) {
      ;
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

  const isEditAllowed = !["APPROVED", "REQUESTED"].includes(scopeStatus) && role?.roleName !== 'CLIENT';

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
                <Button color="gray" isProcessing={isPendingPopulate} onClick={() => populateOrder(false)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                {
                  isEditAllowed && (
                    <Button
                      onClick={() => setIsOpenImport(true)}
                    >
                      Import
                    </Button>
                  )
                }
                {
                  scopeStatus === "REQUESTED" && !assigneeId && ["PROJECT MANAGER", "JUNIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
                  )
                }
                {
                  scopeStatus === "REQUESTED" && assigneeId && ["SENIOR PROJECT MANAGER"].includes(role?.roleName || "") && (
                    <>
                      <Button color="gray" outline onClick={() => setActionModal("REJECT")}>Decline</Button>
                      <Button color="gray" onClick={() => setActionModal("APPROVE")}>
                        Accept
                      </Button>
                    </>
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
                      <Button color="gray" onClick={() => setActionModal("REVISION_REQUESTED")}>
                        Request changes
                      </Button>
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
        isAdding={role?.roleName === 'CLIENT' ? false : !["APPROVED", "REQUESTED"].includes(scopeStatus)}
        isDeleting={role?.roleName === 'CLIENT' ? false : !["APPROVED", "REQUESTED"].includes(scopeStatus)}
        isEditing={isEditAllowed}
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
                } else if (actionModal === "REVISION_REQUESTED") {
                  mutateReview({ action: "REVISION_REQUESTED", note });
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