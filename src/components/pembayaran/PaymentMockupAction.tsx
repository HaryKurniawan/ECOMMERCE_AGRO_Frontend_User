import { Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface PaymentMockupActionProps {
  isProcessing: boolean;
  onSimulatePayment: () => void;
  paymentUrl?: string;
}

const PaymentMockupAction: React.FC<PaymentMockupActionProps> = ({
  isProcessing,
  onSimulatePayment,
  paymentUrl,
}) => {
  return (
    <div className="space-y-4">
      {/* Real Xendit Payment Action */}
      {paymentUrl ? (
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ExternalLink size={18} />
          Bayar via Xendit
        </a>
      ) : (
        <div className="text-center p-3 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p>Link pembayaran Xendit tidak tersedia</p>
        </div>
      )}

      {/* Mockup Button */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center mt-6">
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
