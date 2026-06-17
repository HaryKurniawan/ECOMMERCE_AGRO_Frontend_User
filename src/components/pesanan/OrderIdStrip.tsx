"use client";

import { Receipt, CheckCircle, Copy } from "lucide-react";

import { formatTanggal } from "@/lib/ecommerce-api";

interface OrderIdStripProps {
  orderId: string;
  createdAt: string;
  copied: boolean;
  onCopy: () => void;
}

/**
 * Strip ringkas yang menampilkan nomor pesanan singkat, tanggal, dan tombol salin.
 */
export default function OrderIdStrip({
  orderId,
  createdAt,
  copied,
  onCopy,
}: OrderIdStripProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
          <Receipt size={13} className="text-gray-400" />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">
            No. Pesanan
          </p>
          <p className="font-mono font-bold text-xs text-gray-800">
            #{orderId.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-gray-400 font-medium">
          {formatTanggal(createdAt)}
        </span>
        <button
          onClick={onCopy}
          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Salin nomor pesanan"
        >
          {copied ? (
            <CheckCircle size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} className="text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
}
