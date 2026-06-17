import { Copy, CheckCircle2 } from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface PaymentDetailsProps {
  metode: { label: string; icon: string };
  vaNumber: string;
  total: number;
  copied: boolean;
  onCopy: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  metode,
  vaNumber,
  total,
  copied,
  onCopy,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Metode */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 mb-1">Metode Pembayaran</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{metode.icon}</span>
          <span className="font-bold text-gray-800">{metode.label}</span>
        </div>
      </div>

      {/* VA Number / Payment Code */}
      <div className="p-4 bg-primary-50/50">
        <p className="text-xs text-gray-400 mb-2">Nomor Virtual Account</p>
        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-primary-200">
          <span className="font-mono font-bold text-lg text-gray-900 tracking-wider">
            {vaNumber}
          </span>
          <button
            onClick={onCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 size={12} /> Tersalin
              </>
            ) : (
              <>
                <Copy size={12} /> Salin
              </>
            )}
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1">Total Pembayaran</p>
        <p className="font-display font-bold text-2xl text-primary-700">
          {formatRupiah(Number(total))}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Transfer sesuai jumlah di atas agar pembayaran terverifikasi otomatis
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;
