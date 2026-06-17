import { Loader2, CheckCircle2 } from "lucide-react";

interface PaymentMockupActionProps {
  isProcessing: boolean;
  onSimulatePayment: () => void;
}

const PaymentMockupAction: React.FC<PaymentMockupActionProps> = ({
  isProcessing,
  onSimulatePayment,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center">
      <p className="text-xs text-emerald-700 font-semibold mb-2">
        🧪 Tombol Mockup (Demo Only)
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
  );
};

export default PaymentMockupAction;
