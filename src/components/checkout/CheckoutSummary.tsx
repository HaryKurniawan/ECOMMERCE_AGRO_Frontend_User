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
  shippingInfos?: any;
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
  shippingInfos,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-gray-800 mb-4 text-base font-semibold">
        Ringkasan Belanja
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span className="font-normal">Total Harga ({itemCount} Barang)</span>
          <span className="font-normal text-gray-900">
            {formatRupiah(totalBarang)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="font-normal">Total Ongkos Kirim</span>
          <span className="font-normal text-gray-900">
            {loadingShipping ? "Menghitung..." : formatRupiah(totalOngkir)}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-normal text-gray-700">
            Total Tagihan
          </span>
          <span className="text-2xl font-semibold text-primary-600">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={disabled || loadingSubmit || loadingShipping}
        className="w-full mt-6 bg-primary-600 text-white font-medium py-3 rounded-xl hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {loadingSubmit ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Memproses...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Buat Pesanan
          </>
        )}
      </button>

      {shippingInfos && (
        <div className="mt-4 p-2 bg-gray-100 text-xs rounded overflow-auto max-h-32">
          <pre>{JSON.stringify(shippingInfos, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CheckoutSummary;
