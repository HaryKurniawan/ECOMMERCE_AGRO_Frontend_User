import React from "react";
import { Wallet } from "lucide-react";

import { PAYMENT_METHODS, type PaymentMethod } from "./payment-methods";

interface PaymentMethodSectionProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedMethod,
  onSelect,
}) => {
  // Ambil kategori unik
  const categories = Array.from(
    new Set(PAYMENT_METHODS.map((m) => m.sublabel)),
  );

  const MethodItem = ({ method }: { method: PaymentMethod }) => {
    const Icon = method.icon;
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
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${isSelected ? "bg-primary-100" : "bg-gray-100"}`}
        >
          <Icon size={16} className={method.iconColor || "text-gray-500"} />
        </div>
        <span
          className={`text-sm ${isSelected ? "font-semibold text-gray-900" : "font-normal text-gray-700"}`}
        >
          {method.label}
        </span>
        {isSelected && (
          <div className="ml-auto w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
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
