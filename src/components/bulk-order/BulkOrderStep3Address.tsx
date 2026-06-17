"use client";

import React from "react";
import { MapPin } from "lucide-react";

import { AddressSelector } from "@/src/components/ecommerce/AddressSelector";
import { AddressButton } from "@/src/components/ecommerce/AddressButton";
import { ManualAddressInput } from "@/src/components/ecommerce/ManualAddressInput";
import type { ApiAddressData } from "@/types";

interface BulkOrderStep3AddressProps {
  addresses: ApiAddressData[];
  selectedAddressId: string;
  useManual: boolean;
  manualAlamat: string;
  addressesLoading: boolean;
  onAddressSelect: (id: string) => void;
  onManualAddressToggle: (useManual: boolean) => void;
  onManualAlamatChange: (alamat: string) => void;
  onNavigateToForm: () => void;
}

export const BulkOrderStep3Address: React.FC<BulkOrderStep3AddressProps> = ({
  addresses,
  selectedAddressId,
  useManual,
  manualAlamat,
  addressesLoading,
  onAddressSelect,
  onManualAddressToggle,
  onManualAlamatChange,
  onNavigateToForm,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MapPin size={16} className="text-indigo-500" />
            </div>
            <h2 className="font-semibold text-gray-900">Alamat Pengiriman</h2>
          </div>
        </div>

        {/* Loading state */}
        {addressesLoading ? (
          <AddressSelector
            addresses={[]}
            selectedAddressId=""
            onAddressSelect={() => {}}
            onManualAddress={() => {}}
            loading={true}
          />
        ) : useManual ? (
          <ManualAddressInput
            value={manualAlamat}
            onChange={onManualAlamatChange}
            onUseSaved={() => onManualAddressToggle(false)}
            hasAddresses={addresses.length > 0}
            required={true}
          />
        ) : addresses.length === 0 ? (
          <AddressButton
            onNavigateToForm={onNavigateToForm}
            onManualAddress={() => onManualAddressToggle(true)}
          />
        ) : (
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={onAddressSelect}
            onManualAddress={() => onManualAddressToggle(true)}
          />
        )}
      </div>
    </div>
  );
};
