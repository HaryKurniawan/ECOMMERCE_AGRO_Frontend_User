"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";

import { PaymentSkeleton } from "@/src/components/ecommerce/Skeleton";
import { usePembayaran } from "@/src/hooks/pembayaran/usePembayaran";

// Import UI sub-components
import {
  PaymentSuccessScreen,
  PaymentTimer,
  PaymentDetails,
  PaymentInstructions,
  PaymentMockupAction,
} from "@/src/components/pembayaran";

const PembayaranContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  // Support multi-order checkout: ?orderIds=id1,id2,...
  const orderIdsParam = searchParams.get("orderIds") || "";
  const orderIds = orderIdsParam
    ? orderIdsParam.split(",").filter(Boolean)
    : [];
  // Primary order ID for payment display (first one)
  const primaryOrderId = orderId || orderIds[0] || "ORD00000001";

  const {
    order,
    loading,
    isPaid,
    copied,
    isProcessing,
    timeLeft,
    vaNumber,
    totalGabungan,
    isMultiOrder,
    allOrderIds,
    isVaPayment,
    metodeBayar,
    handleCopy,
    handleSimulatePayment,
  } = usePembayaran(primaryOrderId, orderIds);

  // Protect page: redirect if order is already paid or not in MENUNGGU_BAYAR status
  useEffect(() => {
    if (loading || !order) return;

    // If order status is not MENUNGGU_BAYAR, redirect to pesanan page
    if (order.status?.toUpperCase() !== "MENUNGGU_BAYAR") {
      router.replace("/pesanan");
    }
  }, [order, loading, router]);

  // Prevent back navigation by replacing history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      router.replace("/pesanan");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // Jika sedang loading dari API
  if (loading) {
    return <PaymentSkeleton />;
  }

  // If order is not in MENUNGGU_BAYAR status, don't render payment page
  if (order?.status?.toUpperCase() !== "MENUNGGU_BAYAR") {
    return null;
  }

  // Gunakan totalGabungan (sudah termasuk semua pesanan dalam 1 checkout)
  const total = totalGabungan;
  const metode: { label: string; icon: string } = {
    label: (order?.metodeBayar as string) || "Transfer Bank",
    icon: "🏦",
  };

  // Jika pembayaran sukses, tampilkan halaman full-screen Success
  if (isPaid) {
    return (
      <PaymentSuccessScreen
        orderId={primaryOrderId}
        total={total}
        metode={metode}
      />
    );
  }

  // Jika belum sukses, tampilkan halaman Checkout Menunggu Pembayaran
  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.replace("/pesanan")}
            className="p-2 hover:bg-gray-50 rounded-xl"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">
              Menunggu Pembayaran
            </h1>
            {isMultiOrder && (
              <p className="text-xs text-gray-400">
                {allOrderIds.length} pesanan dari 1 checkout
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-4">
        {/* Timer Banner */}
        <PaymentTimer timeLeft={timeLeft} />

        {/* Payment Main Card (VA, Amount) */}
        <PaymentDetails
          metode={metode}
          vaNumber={vaNumber}
          total={total}
          copied={copied}
          onCopy={handleCopy}
          metodeBayar={metodeBayar}
          paymentUrl={order?.paymentUrl || undefined}
        />

        {/* Instuctions */}
        <PaymentInstructions vaNumber={vaNumber} total={total} />

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Shield size={14} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">
            Transaksi dilindungi enkripsi SSL 256-bit
          </span>
        </div>

        {/* Mockup Button */}
        <PaymentMockupAction
          isProcessing={isProcessing}
          onSimulatePayment={handleSimulatePayment}
          paymentUrl={order?.paymentUrl || undefined}
          metodeBayar={metodeBayar}
        />

        {/* Order ID Footer */}
        <div className="text-center pb-6">
          {isMultiOrder ? (
            <>
              <p className="text-xs text-gray-400">
                {allOrderIds.length} pesanan · 1 pembayaran
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5 font-mono">
                {allOrderIds[0]}...+{allOrderIds.length - 1} lainnya
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-400">
              ID Pesanan:{" "}
              <span className="font-mono font-bold">{primaryOrderId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PembayaranPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PembayaranContent />
    </Suspense>
  );
}
