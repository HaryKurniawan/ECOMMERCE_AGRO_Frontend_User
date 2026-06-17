"use client";

import React from "react";
import { Package, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { formatRupiah } from "@/lib/ecommerce-api";

interface BulkOrderStep1ProductProps {
  product: {
    id: string;
    nama?: string;
    gambarUrl?: string;
    harga: number;
    satuan?: string;
  } | null;
  jumlah: number;
  onJumlahChange: (value: number) => void;
}

export const BulkOrderStep1Product: React.FC<BulkOrderStep1ProductProps> = ({
  product,
  jumlah,
  onJumlahChange,
}) => {
  if (!product) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Package size={16} className="text-emerald-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Produk &amp; Kualitas</h2>
        </div>

        {/* Product card */}
        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-5">
          <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 overflow-hidden shrink-0 relative">
            {product.gambarUrl ? (
              <Image
                src={product.gambarUrl}
                alt={product.nama || ""}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                📦
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 py-1 pr-2">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {product.nama}
            </h3>
            <p className="text-primary-600 font-bold mt-1">
              {formatRupiah(product.harga)}{" "}
              <span className="text-xs text-gray-400 font-normal">
                / {product.satuan}
              </span>
            </p>
          </div>
        </div>

        {/* Total Quantity Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Total Jumlah Pesanan ({product.satuan})
          </label>
          <div className="relative">
            <input
              type="number"
              min="300"
              required
              value={jumlah}
              onChange={(e) => onJumlahChange(parseInt(e.target.value) || 0)}
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 pr-20 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white focus:border-transparent transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
              {product.satuan}
            </div>
          </div>
          {jumlah < 300 ? (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium">
              <AlertCircle size={12} />
              Minimal pemesanan grosir adalah 300 {product.satuan}
            </p>
          ) : (
            <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={12} />
              Jumlah memenuhi syarat minimum grosir
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
