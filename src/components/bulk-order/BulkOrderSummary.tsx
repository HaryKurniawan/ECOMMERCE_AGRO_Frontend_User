"use client";

import React from "react";
import {
  Loader2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  AlertCircle,
} from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface PackagingSpec {
  ukuranKg: number;
  jumlahBungkus: number;
}

interface BulkOrderSummaryProps {
  product: {
    satuan?: string;
    harga: number;
  } | null;
  jumlah: number;
  packagingSpecs: PackagingSpec[];
  currentStep: number;
  isFormValid: boolean;
  bulkOrderLoading: boolean;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export const BulkOrderSummary: React.FC<BulkOrderSummaryProps> = ({
  product,
  jumlah,
  packagingSpecs,
  currentStep,
  isFormValid,
  bulkOrderLoading,
  onNextStep,
  onPrevStep,
  onSubmit,
}) => {
  if (!product) return null;

  const harga = product.harga || 0;
  const totalEstimate = harga * jumlah;

  const isStepValid =
    currentStep === 1
      ? jumlah >= 300
      : currentStep === 2
        ? jumlah >= 300 && packagingSpecs.length > 0
        : isFormValid;

  const handleMainAction = () => {
    if (currentStep < 3) {
      onNextStep();
    } else {
      onSubmit();
    }
  };

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-5">
          Ringkasan Pengajuan
        </h3>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Harga / {product.satuan}</span>
            <span className="font-semibold text-gray-800">
              {formatRupiah(harga)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Jumlah</span>
            <span className="font-semibold text-gray-800">
              {jumlah.toLocaleString()} {product.satuan}
            </span>
          </div>

          {/* Packaging Specification Summary */}
          {packagingSpecs.length > 0 && (
            <div className="pt-3 border-t border-dashed border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium mb-2">
                Jenis Kemasan
              </p>
              <div className="space-y-1.5">
                {packagingSpecs.map((spec, idx) => (
                  <div key={idx} className="text-xs text-gray-700">
                    <span className="font-semibold">
                      {spec.ukuranKg}kg × {spec.jumlahBungkus}
                    </span>
                    <span className="text-gray-400 ml-1">
                      ({spec.ukuranKg * spec.jumlahBungkus}kg)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-dashed border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium mb-1">
              Estimasi Nilai Pesanan
            </p>
            <p className="text-2xl font-bold text-emerald-600 tracking-tight">
              {formatRupiah(totalEstimate)}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              *belum termasuk biaya pengiriman
            </p>
          </div>
        </div>

        <button
          onClick={handleMainAction}
          disabled={!isStepValid || (currentStep === 3 && bulkOrderLoading)}
          className="w-full h-13 py-3.5 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-all active:scale-[0.97] disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2.5 group"
        >
          {bulkOrderLoading && currentStep === 3 ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              {currentStep === 3 && <Sparkles size={18} />}
              <span>
                {currentStep === 1
                  ? "Lanjut ke Rincian"
                  : currentStep === 2
                    ? "Lanjut ke Alamat"
                    : "Ajukan Sekarang"}
              </span>
              {currentStep < 3 && (
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </>
          )}
        </button>

        {currentStep > 1 && (
          <button
            onClick={onPrevStep}
            className="w-full h-11 mt-2 bg-white text-gray-600 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-[0.97]"
          >
            Kembali
          </button>
        )}

        {/* Trust badges */}
        <div className="mt-5 space-y-2.5 pt-5 border-t border-gray-50">
          <div className="flex items-center gap-2.5 text-gray-400">
            <ShieldCheck size={15} className="text-emerald-500 flex-shrink-0" />
            <p className="text-xs">Transaksi aman &amp; terverifikasi</p>
          </div>
          <div className="flex items-center gap-2.5 text-gray-400">
            <Truck size={15} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs">Pengiriman skala besar tersedia</p>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
        <AlertCircle
          size={16}
          className="text-amber-500 flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Perlu diketahui 👋
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Pengajuan ini belum final. Penjual akan mengecek ketersediaan stok
            dan biaya kirim terlebih dahulu lalu menghubungi kamu.
          </p>
        </div>
      </div>
    </div>
  );
};
