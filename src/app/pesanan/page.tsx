"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { ordersApi } from "@/lib/ecommerce-api";
import { useAuthStore } from "@/src/store/auth-store";
import { useOrders } from "@/src/hooks/orders/useOrders";
import { OrderListSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { GroupedOrderCard, SingleOrderCard } from "@/src/components/pesanan";
import type { ApiOrderData } from "@/types";

// Group orders that were created in the same checkout session
// (within 10 seconds of each other, same metodeBayar, all MENUNGGU_BAYAR)
function groupCheckoutOrders(
  orders: ApiOrderData[],
): (ApiOrderData | ApiOrderData[])[] {
  const result: (ApiOrderData | ApiOrderData[])[] = [];
  const used = new Set<string>();

  for (let i = 0; i < orders.length; i++) {
    if (used.has(orders[i].id)) continue;

    const current = orders[i];
    const isUnpaid = current.status?.toUpperCase() === "MENUNGGU_BAYAR";

    if (!isUnpaid) {
      result.push(current);
      used.add(current.id);
      continue;
    }

    // Try to find orders created within 10s of this one (same checkout session)
    const currentTime = new Date(current.createdAt).getTime();
    const group: ApiOrderData[] = [current];
    used.add(current.id);

    for (let j = i + 1; j < orders.length; j++) {
      if (used.has(orders[j].id)) continue;
      const other = orders[j];
      if (other.status?.toUpperCase() !== "MENUNGGU_BAYAR") continue;
      if (other.metodeBayar !== current.metodeBayar) continue;
      const otherTime = new Date(other.createdAt).getTime();
      if (Math.abs(otherTime - currentTime) <= 10000) {
        group.push(other);
        used.add(other.id);
      }
    }

    result.push(group.length === 1 ? group[0] : group);
  }

  return result;
}

const PesananContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { _hasHydrated, isAuthenticated } = useAuthStore();
  const { orders, loading } = useOrders(isAuthenticated, _hasHydrated);

  const initialTab =
    (searchParams.get("status") as
      | "menunggu_bayar"
      | "diproses"
      | "dikirim"
      | "tiba"
      | "selesai") || "menunggu_bayar";
  const [activeTab, setActiveTab] = useState<
    "menunggu_bayar" | "diproses" | "dikirim" | "tiba" | "selesai"
  >(initialTab as any);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated && _hasHydrated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  const tabs = [
    { id: "menunggu_bayar", label: "Belum Bayar" },
    { id: "diproses", label: "Dikemas" },
    { id: "dikirim", label: "Dikirim" },
    { id: "tiba", label: "Tiba" },
    { id: "selesai", label: "Selesai" },
  ];

  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case "menunggu_bayar":
        return "MENUNGGU_BAYAR";
      case "diproses":
        return "DIPROSES";
      case "dikirim":
        return "DIKIRIM";
      case "tiba":
        return "ARRIVED";
      case "selesai":
        return "SELESAI";
      default:
        return "";
    }
  };

  const filteredOrders = orders.filter((o) => {
    const tabKey = getStatusFromTab(activeTab);
    if (tabKey === "ARRIVED") {
      return (
        o.status?.toUpperCase() === "DIKIRIM" &&
        (o as any).pengiriman?.status === "ARRIVED"
      );
    }
    if (tabKey === "DIKIRIM") {
      return (
        o.status?.toUpperCase() === "DIKIRIM" &&
        (o as any).pengiriman?.status !== "ARRIVED"
      );
    }
    return o.status && o.status.toUpperCase() === tabKey.toUpperCase();
  });

  // Group multi-store checkout orders for MENUNGGU_BAYAR tab
  const displayItems =
    activeTab === "menunggu_bayar"
      ? groupCheckoutOrders(filteredOrders)
      : filteredOrders;

  const handleConfirmReceived = async (
    e: React.MouseEvent,
    orderId: string,
  ) => {
    e.stopPropagation();
    try {
      setConfirmingId(orderId);
      await ordersApi.confirmReceived(orderId);
      toast.success("Pesanan berhasil dikonfirmasi");
      window.location.reload();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal mengkonfirmasi pesanan",
      );
    } finally {
      setConfirmingId(null);
    }
  };

  const handlePay = (orderIds: string[]) => {
    if (orderIds.length === 1) {
      router.push(`/pembayaran?orderId=${orderIds[0]}`);
    } else {
      router.push(`/pembayaran?orderIds=${orderIds.join(",")}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-500 lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-semibold text-lg text-gray-900">
            Pesanan Saya
          </h1>
        </div>

        {/* Tabs — scrollable, pill-like */}
        <div className="max-w-2xl mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-none pb-3 pt-2 lg:justify-center">
          {tabs.map((tab) => {
            const count = orders.filter((o: any) => {
              const tabKey = getStatusFromTab(tab.id);
              if (tabKey === "ARRIVED") {
                return (
                  o.status?.toUpperCase() === "DIKIRIM" &&
                  o.pengiriman?.status === "ARRIVED"
                );
              }
              if (tabKey === "DIKIRIM") {
                return (
                  o.status?.toUpperCase() === "DIKIRIM" &&
                  o.pengiriman?.status !== "ARRIVED"
                );
              }
              return o.status?.toUpperCase() === tabKey.toUpperCase();
            }).length;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "menunggu_bayar"
                      | "diproses"
                      | "dikirim"
                      | "tiba"
                      | "selesai",
                  )
                }
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white border-primary-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] font-bold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4">
        {loading ? (
          <OrderListSkeleton />
        ) : filteredOrders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <EmptyState
              illustration="/empty-cart.svg"
              title="Belum ada pesanan"
              description="Pesanan kamu akan muncul di sini setelah kamu melakukan pembelian pertama."
              actionLabel="Belanja Sekarang"
              onAction={() => router.push("/katalog")}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => {
              // Multi-store group
              if (Array.isArray(item)) {
                return (
                  <GroupedOrderCard
                    key={item.map((o) => o.id).join("-")}
                    orders={item}
                    onPay={() => handlePay(item.map((o) => o.id))}
                  />
                );
              }

              // Single order
              const order = item as ApiOrderData;
              return (
                <SingleOrderCard
                  key={order.id}
                  order={order}
                  onPay={
                    order.status?.toUpperCase() === "MENUNGGU_BAYAR"
                      ? () => handlePay([order.id])
                      : undefined
                  }
                  onConfirmReceived={
                    order.status?.toUpperCase() === "DIKIRIM" &&
                    (order as any).pengiriman?.status === "ARRIVED"
                      ? (e) => handleConfirmReceived(e, order.id)
                      : undefined
                  }
                  isConfirming={confirmingId === order.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const PesananPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      }
    >
      <PesananContent />
    </Suspense>
  );
};

export default PesananPage;
