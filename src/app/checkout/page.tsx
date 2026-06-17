"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CheckoutSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useCheckout } from "@/hooks";
import {
  AddressSection,
  StoreOrderGroup,
  PaymentMethodSection,
  CheckoutSummary,
} from "@/src/components/checkout";

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const {
    items,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    shippingInfos,
    loadingInitial,
    loadingShipping,
    loadingSubmit,
    catatanPerStore,
    paymentMethod,
    setPaymentMethod,
    groupedByStore,
    totalBarang,
    totalOngkir,
    grandTotal,
    allDeliverable,
    handleSubmit,
    updateCatatan,
  } = useCheckout();

  if (loadingInitial) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 lg:top-16 z-40">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-50 rounded-full lg:hidden"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="font-display font-semibold text-xl text-gray-900">
              Checkout
            </h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <EmptyState
            title="Checkout Kosong"
            description="Tidak ada item yang dipilih untuk diproses checkout."
            illustration="/empty-cart.svg"
            actionLabel="Kembali ke Keranjang"
            onAction={() => router.push("/keranjang")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 lg:top-16 z-40">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-50 rounded-full lg:hidden"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-display font-semibold text-xl text-gray-900">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:flex lg:gap-8">
        {/* Left Column - Details */}
        <div className="flex-1 space-y-6">
          <AddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={(id) => setSelectedAddressId(id)}
          />

          <div className="space-y-6">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2 px-1">
              Pesanan Anda
            </h2>

            {groupedByStore.map((storeData) => (
              <StoreOrderGroup
                key={storeData.tokoId}
                storeId={storeData.tokoId}
                storeName={storeData.storeName}
                items={storeData.items}
                shipping={shippingInfos.find(
                  (s) => s.tokoId === storeData.tokoId,
                )}
                loadingShipping={loadingShipping}
                catatan={
                  catatanPerStore.find((c) => c.tokoId === storeData.tokoId)
                    ?.text || ""
                }
                onCatatanChange={(text) =>
                  updateCatatan(storeData.tokoId, text)
                }
                hasSelectedAddress={!!selectedAddressId}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:w-96 mt-6 lg:mt-0">
          <div className="sticky top-24 space-y-6">
            <PaymentMethodSection
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />

            <CheckoutSummary
              itemCount={items.length}
              totalBarang={totalBarang}
              totalOngkir={totalOngkir}
              grandTotal={grandTotal}
              loadingShipping={loadingShipping}
              loadingSubmit={loadingSubmit}
              disabled={!allDeliverable || !selectedAddressId}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
