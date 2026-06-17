import React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface CheckoutSummaryProps {
  itemCount: number;
  totalBarang: number;
  totalOngkir: number;
  grandTotal: number;
  loadingShipping: boolean;
  loadingSubmit: boolean;
  disabled: boolean;
  onSubmit: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  itemCount,
  totalBarang,
  totalOngkir,
  grandTotal,
  loadingShipping,
  loadingSubmit,
  disabled,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-display font-bold text-gray-900 mb-6 uppercase tracking-widest text-sm">
        Ringkasan Belanja
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span className="font-medium">Total Harga ({itemCount} Barang)</span>
          <span className="font-bold text-gray-900">
            {formatRupiah(totalBarang)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="font-medium">Total Ongkos Kirim</span>
          <span className="font-bold text-gray-900">
            {loadingShipping ? "Menghitung..." : formatRupiah(totalOngkir)}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-gray-500">Total Tagihan</span>
          <span className="font-display font-bold text-2xl text-primary-600">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={disabled || loadingSubmit || loadingShipping}
        className="w-full mt-6 bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex justify-center items-center gap-2 shadow-lg"
      >
        {loadingSubmit ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Bayar Sekarang
          </>
        )}
      </button>
    </div>
  );
};

export default CheckoutSummary;
