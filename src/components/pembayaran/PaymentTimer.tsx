import { Clock } from "lucide-react";

interface PaymentTimerProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const PaymentTimer: React.FC<PaymentTimerProps> = ({ timeLeft }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg shadow-amber-200">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={18} />
        <span className="font-bold text-sm">Selesaikan pembayaran dalam</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
          <span className="font-display font-bold text-2xl">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-xs ml-1">Jam</span>
        </div>
        <span className="text-xl font-bold">:</span>
        <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
          <span className="font-display font-bold text-2xl">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-xs ml-1">Menit</span>
        </div>
        <span className="text-xl font-bold">:</span>
        <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
          <span className="font-display font-bold text-2xl">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-xs ml-1">Detik</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTimer;
