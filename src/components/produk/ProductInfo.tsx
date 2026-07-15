"use client";

import React from "react";
import { Star, Tag, CheckCircle2 } from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";
import type { ApiAddressData } from "@/types";

interface ProductInfoProps {
  product: {
    id: string;
    nama?: string;
    namaEtalase?: string;
    masterProdukId?: string;
    harga: number;
    satuan?: string;
    terjual?: number;
    rating?: number;
    varian?: { id: string; ukuranKg: number; stokKemasan: number }[];
    kemasan?: { id: string; ukuranKg: number; stokKemasan: number }[];
  };
  displayHarga: number;
  totalStok: number;
  onBulkOrder: () => void;
  onOpenCartModal: () => void;
  isAuthenticated: boolean;
  userAddress: ApiAddressData | null;
  isOutOfArea: boolean;
  onSetAddress: () => void;
  selectedVarianId?: string;
  onSelectVarian?: (id: string) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  displayHarga,
  totalStok,
  onBulkOrder,
  selectedVarianId,
  onSelectVarian,
}) => {
  return (
    <div className="px-4 lg:px-0 mt-4 lg:mt-0 space-y-5">
      {/* Variant Preview */}
      {(product.varian || product.kemasan)?.length ? (
        <div className="mb-4 pb-4 border-b border-gray-100 -mx-4 lg:mx-0 px-4 lg:px-0">
          <label
            htmlFor="kemasan-select"
            className="text-xs font-medium text-gray-600 block mb-2"
          >
            Pilih Kemasan:
          </label>
          <div
            id="kemasan-select"
            className="flex flex-wrap gap-2"
            role="group"
          >
            {(product.varian || product.kemasan)?.map((k) => {
              const isSelected = selectedVarianId === k.id;
              return (
                <button
                  key={k.id}
                  onClick={() => onSelectVarian?.(k.id)}
                  className={`px-4 py-1 border rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-white border-primary-600 text-primary-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50"
                  }`}
                >
                  {k.ukuranKg} kg
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Product name, Price, Rating, Sold */}
      <div>
        <div className="flex items-start justify-between gap-4">
          {/* Left Column: Title & Price */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div>
              <h1 className="font-semibold text-xl lg:text-2xl text-gray-900 leading-snug">
                {product.namaEtalase || product.nama?.replace(" - ", " ")}
              </h1>
              {product.masterProdukId && product.namaEtalase && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  Produk Terstandarisasi
                </p>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-semibold text-2xl text-primary-700 tracking-tight">
                {formatRupiah(displayHarga)}
              </span>
              <span className="text-sm text-gray-400">/ {product.satuan}</span>
            </div>
          </div>

          {/* Right Column: Rating & Stock */}
          <div className="flex flex-col items-end gap-3 shrink-0 mt-1">
            {/* Stock */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500 font-medium">Stok:</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                {totalStok} {product.satuan}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-gray-200">
              <Star size={12} fill="currentColor" className="text-amber-500" />
              <span className="text-xs font-bold text-gray-700">
                {product.rating?.toFixed(1) || "4.8"}
              </span>
              <span className="text-[11px] text-gray-500 font-medium ml-0.5 border-l border-gray-200 pl-1.5">
                {(product.terjual || 0).toLocaleString()} terjual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Order CTA */}
      <div className="lg:hidden mt-6 mb-10 pb-6 border-b border-gray-100 -mx-4 px-4">
        <button
          onClick={onBulkOrder}
          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Tag size={15} className="text-primary-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">
                Butuh lebih dari 100 {product.satuan}?
              </p>
              <p className="text-[10px] text-gray-400">
                Ajukan order grosir dengan harga spesial
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-primary-600 group-hover:bg-primary-50 transition-colors">
            Lihat
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
