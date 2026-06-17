import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { formatRupiah } from "@/lib/ecommerce-api";

interface PaymentSuccessScreenProps {
  orderId: string;
  total: number;
  metode: { label: string; icon: string };
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  orderId,
  total,
  metode,
}) => {
  const router = useRouter();

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-emerald-50 to-white">
      {/* Success Animation Circle */}
      <div className="relative mb-6">
        <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle2 size={48} className="text-white" />
          </div>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-300 rounded-full animate-bounce" />
        <div
          className="absolute -bottom-1 -left-3 w-3 h-3 bg-emerald-200 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="absolute top-1/2 -right-4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">
        Pembayaran Berhasil! 🎉
      </h1>
      <p className="text-sm text-gray-500 text-center mb-2">
        Pesanan kamu sedang diproses oleh penjual
      </p>

      {/* Order Summary Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-5 my-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">ID Pesanan</span>
          <span className="text-sm font-mono font-bold text-gray-700">
            {orderId}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Metode Bayar</span>
          <span className="text-sm font-medium text-gray-700">
            {metode.icon} {metode.label}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">Total Dibayar</span>
          <span className="font-display font-bold text-lg text-emerald-600">
            {formatRupiah(Number(total))}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => router.push("/pesanan")}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-200"
        >
          <ShoppingBag size={18} /> Lihat Pesanan Saya
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold text-sm transition-all"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;
