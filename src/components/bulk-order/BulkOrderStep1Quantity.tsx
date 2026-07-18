"use client";

import React from "react";
import { Scale, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface BulkOrderStep1QuantityProps {
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

const QUICK_AMOUNTS = [300, 500, 1000, 2000, 5000];

import { formatRupiah } from "@/lib/ecommerce-api";

export const BulkOrderStep1Quantity: React.FC<BulkOrderStep1QuantityProps> = ({
  product,
  jumlah,
  onJumlahChange,
}) => {
  if (!product) return null;

  const isValid = jumlah >= 300;

  const handleChange = (val: number) => {
    onJumlahChange(Math.max(0, val));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Scale size={16} className="text-emerald-600" />
          </div>
          <h2 className="font-semibold text-gray-900">
            Berapa yang ingin dipesan?
          </h2>
        </div>

        {/* Product card */}
        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
          <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 overflow-hidden shrink-0 relative">
            {product.gambarUrl ? (
              <Image
                src={product.gambarUrl}
                alt={product.nama?.replace(" - ", " ") || ""}
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
              {product.nama?.replace(" - ", " ")}
            </h3>
            <p className="text-primary-600 font-bold mt-1">
              {formatRupiah(product.harga)}{" "}
              <span className="text-xs text-gray-400 font-normal">
                / {product.satuan}
              </span>
            </p>
          </div>
        </div>

        {/* Amount input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Total Pesanan
          </label>
          <div className="relative">
            <input
              type="number"
              min="300"
              required
              value={jumlah || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  handleChange(0);
                } else {
                  handleChange(parseInt(val) || 0);
                }
              }}
              onBlur={() => {
                if (jumlah > 0 && jumlah < 300) {
                  handleChange(300);
                }
              }}
              placeholder="Masukkan jumlah..."
              className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-5 pr-16 text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white focus:border-transparent transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
              {product.satuan}
            </div>
          </div>

          {/* Validation message */}
          {jumlah > 0 && jumlah < 300 ? (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium">
              <AlertCircle size={12} />
              Minimal pemesanan grosir adalah 300 {product.satuan}
            </p>
          ) : jumlah >= 300 ? (
            <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={16} />
              {(jumlah * product.harga).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}{" "}
              <span className="font-medium">estimasi nilai pesanan</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
