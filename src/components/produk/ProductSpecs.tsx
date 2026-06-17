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

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  product,
  setQuantity,
}) => {
  const specs = [];

  if (product.estimasiSegarHari) {
    specs.push({
      icon: <Clock size={15} className="text-emerald-500" />,
      bg: "bg-emerald-50",
      label: "Segar s/d",
      value: `${product.estimasiSegarHari}–${product.estimasiSegarHari + 1} hari`,
    });
  }

  if (product.nutrisi) {
    specs.push({
      icon: <Leaf size={15} className="text-blue-500" />,
      bg: "bg-blue-50",
      label: "Nutrisi",
      value: product.nutrisi,
    });
  }

  if (product.asalKebun) {
    specs.push({
      icon: <MapPin size={15} className="text-amber-500" />,
      bg: "bg-amber-50",
      label: "Asal",
      value: product.asalKebun,
    });
  }

  if (product.kategoriNama) {
    specs.push({
      icon: <Tag size={15} className="text-purple-500" />,
      bg: "bg-purple-50",
      label: "Kategori",
      value: product.kategoriNama,
    });
  }

  return (
    <div className="pt-6">
      {/* Description & Specs */}
      <div className="px-4 lg:px-0">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              Detail Produk
            </h3>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {product.deskripsi || "-"}
            </p>

            {specs.length > 0 && (
              <div className="mt-7 pt-5 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 mb-3">
                  Informasi Tambahan
                </h4>
                <div className="space-y-4">
                  {specs.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {s.label}
                        </p>
                        <p className="text-xs font-medium text-gray-800 mt-0.5">
                          {s.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
