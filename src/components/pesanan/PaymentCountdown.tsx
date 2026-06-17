"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface PaymentCountdownProps {
  timeLeft: TimeLeft;
}

/**
 * Banner countdown pembayaran yang muncul saat status pesanan MENUNGGU_BAYAR.
 * Menampilkan jam, menit, dan detik tersisa.
 */
export default function PaymentCountdown({ timeLeft }: PaymentCountdownProps) {
  return (
    <div className="bg-amber-50/60 rounded-2xl p-5 flex items-center gap-4 border border-amber-200/60 shadow-sm animate-pulse">
      <Clock size={20} className="text-amber-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-amber-700/70 font-bold uppercase tracking-wider">
          Batas waktu bayar
        </p>
        <div className="flex gap-1.5 mt-1">
          {[
            { v: timeLeft.hours, l: "j" },
            { v: timeLeft.minutes, l: "m" },
            { v: timeLeft.seconds, l: "d" },
          ].map((t, i) => (
            <React.Fragment key={t.l}>
              <span className="font-display font-black text-xl text-amber-700 tabular-nums">
                {String(t.v).padStart(2, "0")}
              </span>
              <span className="text-[11px] text-amber-500/70 font-bold self-end mb-0.5">
                {t.l}
              </span>
              {i < 2 && (
                <span className="text-amber-300 font-bold self-center text-lg">
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
