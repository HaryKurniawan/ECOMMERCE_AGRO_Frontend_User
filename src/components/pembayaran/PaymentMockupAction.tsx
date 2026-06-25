import Image from "next/image";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  QrCode,
  CreditCard,
  Wallet,
} from "lucide-react";

interface PaymentMockupActionProps {
  isProcessing: boolean;
  onSimulatePayment: () => void;
  paymentUrl?: string;
  metodeBayar?: string;
}

// Xendit Invoice App Mockup — mirip tampilan DANA, OVO, dsb.
const XenditAppMockup: React.FC<{
  paymentUrl: string;
  metodeBayar?: string;
}> = ({ paymentUrl, metodeBayar }) => {
  const isEwallet = ["OVO", "DANA", "GOPAY", "LINKAJA", "SHOPEEPAY"].includes(
    (metodeBayar || "").toUpperCase(),
  );
  const isQris = metodeBayar?.toUpperCase() === "QRIS";

  const appInfo = {
    DANA: {
      color: "from-[#108BE3] to-[#0071BC]",
      imgSrc: "/images/payment/DANA.png",
      name: "DANA",
    },
    OVO: {
      color: "from-[#4C3494] to-[#3D2878]",
      imgSrc: "/images/payment/OVO.png",
      name: "OVO",
    },
    GOPAY: {
      color: "from-[#00AED6] to-[#0090B0]",
      imgSrc: "/images/payment/GOPAY.png",
      name: "GoPay",
    },
    LINKAJA: {
      color: "from-red-500 to-red-600",
      imgSrc: null,
      name: "LinkAja",
    },
    SHOPEEPAY: {
      color: "from-[#EE4D2D] to-[#D23F22]",
      imgSrc: "/images/payment/SPAY.png",
      name: "ShopeePay",
    },
  };

  const app =
    appInfo[metodeBayar?.toUpperCase() as keyof typeof appInfo] || null;

  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
      {/* Xendit WRIS Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
            <CreditCard size={14} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">Xendit Invoice</span>
        </div>
        <span className="text-white/70 text-[10px]">Secure Payment</span>
      </div>

      {/* Available payment method logos */}
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">
          Metode yang tersedia
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { bg: "bg-blue-100", text: "text-blue-700", label: "BCA" },
            { bg: "bg-orange-100", text: "text-orange-700", label: "Mandiri" },
            { bg: "bg-blue-100", text: "text-blue-900", label: "BRI" },
            { bg: "bg-blue-50", text: "text-blue-600", label: "BNI" },
            { bg: "bg-blue-100", text: "text-blue-500", label: "DANA" },
            { bg: "bg-purple-100", text: "text-purple-700", label: "OVO" },
            { bg: "bg-green-100", text: "text-green-600", label: "GoPay" },
            { bg: "bg-gray-100", text: "text-gray-600", label: "QRIS" },
          ].map((m) => (
            <span
              key={m.label}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${m.bg} ${m.text}`}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* App-specific mockup or generic */}
      {isEwallet && app ? (
        <div
          className={`bg-gradient-to-br ${app.color} p-4 m-3 rounded-xl text-white text-center flex flex-col items-center`}
        >
          {app.imgSrc ? (
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-2 p-1.5">
              <Image
                src={app.imgSrc}
                alt={app.name}
                width={48}
                height={48}
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="text-3xl mb-1">💳</div>
          )}
          <p className="text-xs font-bold">{app.name}</p>
          <p className="text-[10px] text-white/70 mt-1">
            Klik tombol di bawah untuk membuka aplikasi
          </p>
        </div>
      ) : isQris ? (
        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
            <QrCode size={48} className="text-gray-500" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Scan QR via aplikasi apapun
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 m-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone size={20} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">
              Buka Xendit Invoice
            </p>
            <p className="text-[10px] text-gray-400">
              Pilih metode bayar favoritmu
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="px-3 pb-3">
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Bayar Sekarang via Xendit
        </a>
      </div>
    </div>
  );
};

const PaymentMockupAction: React.FC<PaymentMockupActionProps> = ({
  isProcessing,
  onSimulatePayment,
  paymentUrl,
  metodeBayar,
}) => {
  return (
    <div className="space-y-4">
      {/* Real Xendit Payment Action */}
      {paymentUrl ? (
        <XenditAppMockup paymentUrl={paymentUrl} metodeBayar={metodeBayar} />
      ) : (
        <div className="rounded-2xl overflow-hidden border border-dashed border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-indigo-400" />
            <p className="text-xs text-indigo-600 font-semibold">
              Link pembayaran Xendit
            </p>
          </div>
          <p className="text-[11px] text-indigo-400">
            Link akan tersedia setelah pesanan dikonfirmasi. Periksa halaman
            pesanan Anda.
          </p>
        </div>
      )}

      {/* Mockup/Demo Button */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center">
        <p className="text-xs text-emerald-700 font-semibold mb-2">
          🧪 Tombol Mockup (Demo Bypass Payment)
        </p>
        <button
          onClick={onSimulatePayment}
          disabled={isProcessing}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={18} />
          )}
          {isProcessing ? "Memproses..." : "Simulasi: Berhasil Dibayar"}
        </button>
      </div>
    </div>
  );
};

export default PaymentMockupAction;
