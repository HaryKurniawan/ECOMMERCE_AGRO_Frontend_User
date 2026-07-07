"use client";

import React from "react";
import { Clock, Leaf, MapPin, Tag } from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface ProductSpecsProps {
  product: {
    estimasiSegarHari?: number;
    nutrisi?: string;
    asalKebun?: string;
    kategoriNama?: string;
    deskripsi?: string;
  };
  setQuantity: (qty: number) => void;
}

const specConfig = [
  {
    key: "estimasiSegarHari" as const,
    Icon: Clock,
    label: "Segar s/d",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    getValue: (p: ProductSpecsProps["product"]) =>
      p.estimasiSegarHari
        ? `${p.estimasiSegarHari}–${p.estimasiSegarHari + 1} hari`
        : null,
  },
  {
    key: "nutrisi" as const,
    Icon: Leaf,
    label: "Nutrisi",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-100",
    getValue: (p: ProductSpecsProps["product"]) => p.nutrisi || null,
  },
  {
    key: "asalKebun" as const,
    Icon: MapPin,
    label: "Asal Kebun",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    getValue: (p: ProductSpecsProps["product"]) => p.asalKebun || null,
  },
  {
    key: "kategoriNama" as const,
    Icon: Tag,
    label: "Kategori",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-100",
    getValue: (p: ProductSpecsProps["product"]) => p.kategoriNama || null,
  },
];

const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const activeSpecs = specConfig.filter((s) => s.getValue(product) !== null);

  return (
    <div className="px-4 lg:px-0">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">
            Detail Produk
          </h3>
        </div>

        {/* Description */}
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
            {product.deskripsi || "Tidak ada deskripsi."}
          </p>
        </div>

        {/* Specs grid */}
        {activeSpecs.length > 0 && (
          <div className="border-t border-gray-50 px-5 py-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-4">
              Informasi Tambahan
            </p>
            <div className="grid grid-cols-2 gap-3">
              {activeSpecs.map(
                ({ Icon, label, color, bgColor, borderColor, getValue }, i) => {
                  const value = getValue(product);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${borderColor} ${bgColor}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <Icon size={15} className={color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecs;
