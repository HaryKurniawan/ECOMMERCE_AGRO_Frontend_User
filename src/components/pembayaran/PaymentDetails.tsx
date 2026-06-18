import { Copy, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface PaymentDetailsProps {
  metode: { label: string; icon: string };
  vaNumber: string;
  total: number;
  copied: boolean;
  onCopy: () => void;
  metodeBayar?: string; // Mengetahui apakah ini QRIS, EWallet, atau VA
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  metode,
  vaNumber, // Ini bisa berupa Nomor VA, QR String, atau URL
  total,
  copied,
  onCopy,
  metodeBayar,
}) => {
  const isQRIS = metodeBayar?.toUpperCase() === "QRIS";
  const isEWallet = ["OVO", "DANA"].includes(metodeBayar?.toUpperCase() || "");

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

      {/* Payment Information Area */}
      <div className="p-4 bg-primary-50/50 flex flex-col items-center justify-center">
        {isQRIS ? (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <QRCodeSVG value={vaNumber} size={200} />
            <p className="text-xs text-center text-gray-500 mt-3 font-semibold">
              Scan QR Code ini untuk membayar
            </p>
          </div>
        ) : isEWallet ? (
          <div className="text-center p-3">
            {metodeBayar === "OVO" ? (
              <p className="text-sm font-semibold text-primary-800">
                Silakan cek aplikasi OVO Anda. Kami telah mengirimkan notifikasi
                untuk mengonfirmasi pembayaran.
              </p>
            ) : (
              <p className="text-sm font-semibold text-primary-800">
                Klik tombol di bawah ini untuk membuka {metode.label}.
              </p>
            )}
          </div>
        ) : (
          <div className="w-full">
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
        )}
      </div>

      {/* Amount */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1">Total Pembayaran</p>
        <p className="font-display font-bold text-2xl text-primary-700">
          {formatRupiah(Number(total))}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          {isQRIS || isEWallet
            ? "Lakukan pembayaran sesuai instruksi di atas"
            : "Transfer sesuai jumlah di atas agar pembayaran terverifikasi otomatis"}
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;
