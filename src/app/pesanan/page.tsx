"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal, ConfigProvider } from "antd";
import Image from "next/image";

import { ordersApi } from "@/lib/ecommerce-api";
import { useOrderEvents } from "@/src/hooks/order/useOrderEvents";
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
    const currentId = orders[i].id_pesanan;
    if (used.has(currentId)) continue;

    const current = orders[i];
    const isUnpaid = current.status?.toUpperCase() === "MENUNGGU_BAYAR";

    if (!isUnpaid) {
      result.push(current);
      used.add(currentId);
      continue;
    }

    // Try to find orders created within 10s of this one (same checkout session)
    const currentTime = new Date(current.createdAt).getTime();
    const group: ApiOrderData[] = [current];
    used.add(currentId);

    for (let j = i + 1; j < orders.length; j++) {
      const otherId = orders[j].id_pesanan;
      if (used.has(otherId)) continue;
      const other = orders[j];
      if (other.status?.toUpperCase() !== "MENUNGGU_BAYAR") continue;
      if (other.metodeBayar !== current.metodeBayar) continue;
      const otherTime = new Date(other.createdAt).getTime();
      if (Math.abs(otherTime - currentTime) <= 10000) {
        group.push(other);
        used.add(otherId);
      }
    }

    result.push(group.length === 1 ? group[0] : group);
  }

  return result;
}

const PesananContent = () => {
  const router = useRouter();

  // Real-time order updates
  useOrderEvents();

  const searchParams = useSearchParams();
  const { _hasHydrated, isAuthenticated } = useAuthStore();
  const {
    orders,
    loading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrders(isAuthenticated, _hasHydrated);

  const paymentParam = searchParams.get("payment"); // "success" or "failed" from Xendit redirect

  const initialTab =
    paymentParam === "success"
      ? "diproses" // Auto-switch ke tab Dikemas setelah bayar
      : (searchParams.get("status") as
          | "menunggu_bayar"
          | "diproses"
          | "dikirim"
          | "tiba"
          | "selesai"
          | "dibatalkan") || "menunggu_bayar";

  const [activeTab, setActiveTab] = useState<
    | "menunggu_bayar"
    | "diproses"
    | "dikirim"
    | "tiba"
    | "selesai"
    | "dibatalkan"
  >(initialTab as any);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmModalOrder, setConfirmModalOrder] = useState<string | null>(
    null,
  );

  // Handle redirect kembali dari Xendit (setelah bayar di sandbox)
  useEffect(() => {
    if (paymentParam === "success") {
      toast.success(
        "Pembayaran berhasil! Pesanan sedang diproses oleh penjual.",
        { duration: 5000, icon: "🎉" },
      );
      setActiveTab("diproses");
      // Poll beberapa kali untuk memastikan webhook sudah diproses backend
      const delays = [1500, 4000, 8000];
      delays.forEach((delay) => {
        setTimeout(() => refetch(), delay);
      });
      // Bersihkan query param dari URL
      router.replace("/pesanan?status=diproses");
    } else if (paymentParam === "failed") {
      toast.error("Pembayaran gagal atau dibatalkan.", { duration: 5000 });
      router.replace("/pesanan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentParam]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated && _hasHydrated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  const tabs = [
    { id: "menunggu_bayar", label: "Belum Bayar" },
    { id: "diproses", label: "Diproses" },
    { id: "dikirim", label: "Dikirim" },
    { id: "tiba", label: "Tiba" },
    { id: "selesai", label: "Selesai" },
    { id: "dibatalkan", label: "Dibatalkan" },
  ];

  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case "menunggu_bayar":
        return ["MENUNGGU_BAYAR", "MENUNGGU_KONFIRMASI_SELLER"];
      case "diproses":
        return ["DIPROSES"];
      case "dikirim":
        return ["DIKIRIM"];
      case "tiba":
        return ["ARRIVED"];
      case "selesai":
        return ["SELESAI", "DITUTUP"];
      case "dibatalkan":
        return ["DIBATALKAN"];
      default:
        return [];
    }
  };

  const filteredOrders = orders.filter((o) => {
    const tabKeys = getStatusFromTab(activeTab);
    if (activeTab === "tiba") {
      return (
        o.status?.toUpperCase() === "DIKIRIM" &&
        (o as any).pengiriman?.status === "ARRIVED"
      );
    }
    if (activeTab === "dikirim") {
      return (
        o.status?.toUpperCase() === "DIKIRIM" &&
        (o as any).pengiriman?.status !== "ARRIVED"
      );
    }
    return o.status && tabKeys.includes(o.status.toUpperCase());
  });

  // Group multi-store checkout orders for MENUNGGU_BAYAR tab
  const displayItems =
    activeTab === "menunggu_bayar"
      ? groupCheckoutOrders(filteredOrders)
      : filteredOrders;

  const handleConfirmReceived = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setConfirmModalOrder(orderId);
  };

  const handleConfirmReceivedAction = async (orderId: string) => {
    try {
      setConfirmingId(orderId);
      await ordersApi.confirmReceived(orderId);
      router.push(`/pesanan/${orderId}/success`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal mengkonfirmasi pesanan",
      );
      setConfirmingId(null);
    }
  };

  const handlePay = (ordersToPay: ApiOrderData[]) => {
    const orderIds = ordersToPay.map((o: any) => o.id_pesanan || o.id);
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
            onClick={() => router.push("/profil")}
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
              const tabKeys = getStatusFromTab(tab.id);
              if (tab.id === "tiba") {
                return (
                  o.status?.toUpperCase() === "DIKIRIM" &&
                  o.pengiriman?.status === "ARRIVED"
                );
              }
              if (tab.id === "dikirim") {
                return (
                  o.status?.toUpperCase() === "DIKIRIM" &&
                  o.pengiriman?.status !== "ARRIVED"
                );
              }
              return o.status && tabKeys.includes(o.status.toUpperCase());
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
                      | "selesai"
                      | "dibatalkan",
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-xs font-bold ${
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
            {displayItems.map((item, index) => {
              // Multi-store group
              if (Array.isArray(item)) {
                return (
                  <GroupedOrderCard
                    key={`group-${index}-${item.map((o: any) => o.id_pesanan || o.id).join("-")}`}
                    orders={item}
                    onPay={() => handlePay(item)}
                  />
                );
              }

              // Single order
              const order = item as ApiOrderData;
              const orderId = (order as any).id_pesanan || order.id_pesanan;
              return (
                <SingleOrderCard
                  key={`single-${index}-${orderId}`}
                  order={{ ...order, id_pesanan: orderId }} // Override id explicitly for the card
                  onPay={
                    order.status?.toUpperCase() === "MENUNGGU_BAYAR"
                      ? () => handlePay([order])
                      : undefined
                  }
                  onConfirmReceived={
                    order.status?.toUpperCase() === "DIKIRIM" &&
                    (order as any).pengiriman?.status === "ARRIVED"
                      ? (e) => handleConfirmReceived(e, orderId)
                      : undefined
                  }
                  isConfirming={confirmingId === orderId}
                />
              );
            })}

            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => fetchNextPage && fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-3.5 rounded-xl border border-primary-200 text-primary-600 font-medium text-sm hover:bg-primary-50 active:bg-primary-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Memuat..."
                    : "Muat Lebih Banyak Pesanan"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfigProvider theme={{ components: { Modal: { borderRadiusLG: 32 } } }}>
        <Modal
          open={!!confirmModalOrder}
          onCancel={() => setConfirmModalOrder(null)}
          footer={null}
          centered
          closeIcon={false}
          width={330}
          styles={{
            body: { padding: "64px 28px" },
            mask: {
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
            },
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 mb-8 relative">
              <Image
                src="/images/cart.svg"
                alt="Konfirmasi"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-medium text-base text-gray-800 mb-3 mt-2">
              Pesanan Sudah Tiba?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-10 px-2">
              Yuk pastikan pesananmu sudah diterima dengan baik agar dananya
              bisa diteruskan ke penjual.
            </p>
            <div className="w-full flex gap-3">
              <button
                onClick={() => setConfirmModalOrder(null)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-gray-500 font-medium text-[12px] hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (confirmModalOrder) {
                    const id = confirmModalOrder;
                    setConfirmModalOrder(null);
                    handleConfirmReceivedAction(id);
                  }
                }}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 text-white font-medium text-[12px] hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                disabled={!!confirmingId}
              >
                {confirmingId ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Konfirmasi"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
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
