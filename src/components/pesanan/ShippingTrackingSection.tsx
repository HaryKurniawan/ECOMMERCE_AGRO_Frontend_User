import React from "react";
import Image from "next/image";
import { Truck, CheckCircle, Camera } from "lucide-react";

interface ShippingTrackingSectionProps {
  shipping: {
    status?: string;
    kurirNama?: string;
    kurirTelepon?: string;
    trackingHistory?: { status: string; timestamp?: string; note?: string }[];
    buktiKirimFoto?: string[];
    buktiKirimCatatan?: string;
    buktiKirimWaktu?: string;
  };
}

const STEPS = [
  { status: "PREPARING", label: "Pesanan Disiapkan" },
  { status: "PICKUP_CONFIRMATION", label: "Diserahkan ke Kurir" },
  { status: "PICKED_UP", label: "Diterima Kurir" },
  { status: "IN_TRANSIT", label: "Dalam Perjalanan" },
  { status: "ARRIVED", label: "Tiba di Tujuan" },
];

const ShippingTrackingSection: React.FC<ShippingTrackingSectionProps> = ({
  shipping,
}) => {
  const hist = shipping.trackingHistory || [];
  const buktiFoto = shipping.buktiKirimFoto || [];
  const buktiCatatan = shipping.buktiKirimCatatan;
  const buktiWaktu = shipping.buktiKirimWaktu;
  const hasBukti = buktiFoto.length > 0;

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
            <Truck size={13} className="text-orange-500" />
          </div>
          <h2 className="font-bold text-sm text-gray-800">Pengiriman</h2>
        </div>
        {shipping.kurirNama && (
          <span className="text-[11px] text-gray-400 font-medium">
            {shipping.kurirNama}
            {shipping.kurirTelepon ? ` · ${shipping.kurirTelepon}` : ""}
          </span>
        )}
      </div>

      <div className="relative pl-5">
        <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-gray-100 rounded-full" />
        {STEPS.map((step, idx) => {
          const done = hist.find((h) => h.status === step.status);
          const isCurrent = shipping.status === step.status;

          return (
            <div
              key={step.status}
              className={`relative flex items-start gap-4 ${
                idx < STEPS.length - 1 ? "pb-4" : ""
              }`}
            >
              <div
                className={`relative -left-5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  done
                    ? "bg-emerald-50 ring-2 ring-emerald-200/50"
                    : isCurrent
                      ? "bg-blue-50 ring-4 ring-blue-100/50 animate-pulse"
                      : "bg-gray-50 ring-2 ring-gray-100"
                }`}
              >
                {done ? (
                  <CheckCircle size={12} className="text-emerald-500" />
                ) : isCurrent ? (
                  <Truck size={10} className="text-blue-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-200" />
                )}
              </div>
              <div className="-mt-0.5 flex-1 min-w-0">
                <p
                  className={`text-[12px] font-semibold ${
                    done
                      ? "text-gray-700"
                      : isCurrent
                        ? "text-blue-600"
                        : "text-gray-300"
                  }`}
                >
                  {step.label}
                </p>
                {done?.timestamp && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(done.timestamp).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {done?.note && (
                  <p className="text-[10px] text-gray-400 italic mt-0.5">
                    {done.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bukti Penerimaan dari Kurir */}
      {hasBukti && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Camera size={13} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">
              Bukti Penerimaan
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {buktiFoto.map((foto, idx) => (
              <a
                key={idx}
                href={foto}
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                <Image
                  src={foto}
                  alt={`Bukti penerimaan ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </a>
            ))}
          </div>

          {buktiCatatan && (
            <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-semibold text-gray-400 mb-0.5">
                Catatan Kurir
              </p>
              <p className="text-[12px] text-gray-700 leading-relaxed">
                {buktiCatatan}
              </p>
            </div>
          )}

          {buktiWaktu && (
            <p className="text-[10px] text-gray-400 mt-2">
              Diterima{" "}
              {new Date(buktiWaktu).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default ShippingTrackingSection;
