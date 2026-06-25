import React from "react";
import Image from "next/image";
import { Wallet } from "lucide-react";

import { PAYMENT_METHODS, type PaymentMethod } from "./payment-methods";

interface PaymentMethodSectionProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

/** Render logo: gambar asli kalau ada, fallback badge teks dengan warna brand */
const PaymentLogo: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  if (method.logo) {
    return (
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${method.bgColor} p-1`}
      >
        <Image
          src={method.logo}
          alt={method.label}
          width={36}
          height={36}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
    );
  }
  // Fallback: badge teks singkat berwarna brand (untuk bank VA)
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${method.bgColor}`}
    >
      <span className="text-white font-black text-[10px] tracking-tight leading-tight text-center">
        {method.badge}
      </span>
    </div>
  );
};

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const categories = Array.from(
    new Set(PAYMENT_METHODS.map((m) => m.sublabel)),
  );

  const MethodItem = ({ method }: { method: PaymentMethod }) => {
    const isSelected = selectedMethod === method.id;
    return (
      <label
        key={method.id}
        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
          isSelected
            ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <input
          type="radio"
          name="payment-method"
          checked={isSelected}
          onChange={() => onSelect(method.id)}
          className="sr-only"
        />
        <PaymentLogo method={method} />
        <span
          className={`text-sm flex-1 ${isSelected ? "font-semibold text-gray-900" : "font-normal text-gray-700"}`}
        >
          {method.label}
        </span>
        {isSelected && (
          <div className="ml-auto w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </label>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <Wallet className="text-primary-600" size={20} />
        Metode Pembayaran
      </h2>

      {categories.map((category, idx) => (
        <div key={category} className={idx > 0 ? "mt-4" : ""}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {category}
          </p>
          <div className="space-y-2">
            {PAYMENT_METHODS.filter((m) => m.sublabel === category).map((m) => (
              <MethodItem key={m.id} method={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSection;
