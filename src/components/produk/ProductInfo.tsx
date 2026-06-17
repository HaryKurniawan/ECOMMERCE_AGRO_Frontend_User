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
        <div className="lg:hidden mb-4">
          <label
            htmlFor="kemasan-select"
            className="text-xs font-medium text-gray-600 block mb-2.5"
          >
            Pilih Kemasan:
          </label>
          <div
            id="kemasan-select"
            className="flex flex-wrap gap-2.5"
            role="group"
          >
            {(product.varian || product.kemasan)?.map((k) => {
              const isSelected = selectedVarianId === k.id;
              return (
                <button
                  key={k.id}
                  onClick={() => onSelectVarian?.(k.id)}
                  className={`px-6 py-1.5 border rounded-lg text-sm font-medium transition-all ${
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
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl lg:text-2xl text-gray-900 leading-snug">
              {product.namaEtalase || product.nama}
            </h1>
            {product.masterProdukId && product.namaEtalase && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" />
                Produk Terstandarisasi
              </p>
            )}
          </div>
          <span className="text-[11px] text-gray-400 font-medium shrink-0 mt-1.5">
            {(product.terjual || 0).toLocaleString()} terjual
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-2xl text-primary-700 tracking-tight">
              {formatRupiah(displayHarga)}
            </span>
            <span className="text-sm text-gray-400">/ {product.satuan}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-50 px-2.5 py-1.5 rounded-xl border border-primary-100 shrink-0">
            <Star size={12} fill="currentColor" className="text-primary-500" />
            <span className="text-xs font-bold text-primary-700">
              {product.rating?.toFixed(1) || "4.8"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600 font-medium">
            Stok Tersedia:
          </span>
          <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-lg border border-green-100">
            {totalStok} kg
          </span>
        </div>
      </div>

      {/* Bulk Order CTA */}
      <button
        onClick={onBulkOrder}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-primary-50 border-[1.5px] border-dashed border-primary-600/50 hover:border-primary-600 rounded-xl transition-all group mt-6 mb-10"
      >
        <div className="flex items-center gap-2.5">
          <Tag size={15} className="text-primary-600" />
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">
              Butuh lebih dari 100 {product.satuan}?
            </p>
            <p className="text-[10px] text-gray-400">
              Ajukan order grosir dengan harga spesial
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg group-hover:bg-primary-100 transition-colors">
          Lihat
        </span>
      </button>
    </div>
  );
};

export default ProductInfo;
