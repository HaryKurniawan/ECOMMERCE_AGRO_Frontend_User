"use client";

import { Loader2 } from "lucide-react";

import type { ApiOrderData } from "@/types";
import { OrderCard } from "@/components/business";

interface SingleOrderCardProps {
  order: ApiOrderData;
  onPay?: () => void;
  onConfirmReceived?: (e: React.MouseEvent) => void;
  isConfirming?: boolean;
}

export default function SingleOrderCard({
  order,
  onPay,
  onConfirmReceived,
  isConfirming,
}: SingleOrderCardProps) {
  const isUnpaid = order.status?.toUpperCase() === "MENUNGGU_BAYAR";
  const isArrived =
    order.status?.toUpperCase() === "DIKIRIM" &&
    (order as any).pengiriman?.status === "ARRIVED";

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <OrderCard order={order} className="border-0 shadow-none rounded-none" />

      {isUnpaid && onPay && (
        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Selesaikan pembayaran
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPay();
            }}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all hover:bg-primary-700"
          >
            Bayar Sekarang
          </button>
        </div>
      )}

      {isArrived && onConfirmReceived && (
        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Barang sudah sampai?
          </span>
          <button
            onClick={onConfirmReceived}
            disabled={isConfirming}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all hover:bg-emerald-700 disabled:opacity-60 flex items-center gap-2"
          >
            {isConfirming && <Loader2 size={12} className="animate-spin" />}
            Pesanan Diterima
          </button>
        </div>
      )}
    </div>
  );
}
