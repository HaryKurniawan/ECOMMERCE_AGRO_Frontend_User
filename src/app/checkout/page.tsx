"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, Phone, Loader2, X } from "lucide-react";

import { CheckoutSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useCheckout } from "@/hooks";
import {
  AddressSection,
  StoreOrderGroup,
  PaymentMethodSection,
  CheckoutSummary,
} from "@/src/components/checkout";
import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/profil/useProfile";
import ActionModal from "@/src/components/ActionModal";
import { authApi } from "@/src/lib/api/auth";

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, openPhoneVerificationModal } =
    useAuthStore();
  const { profile, refetch: refetchProfile } = useProfile(
    isAuthenticated,
    _hasHydrated,
  );

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  const handleSavePhone = async () => {
    if (!phoneInput) return;
    setSavingPhone(true);
    try {
      // Remove any leading zero from user input just in case
      let cleanedInput = phoneInput.replace(/^0+/, "");
      // Remove non-digit characters
      cleanedInput = cleanedInput.replace(/\D/g, "");
      const formattedPhone = "+62" + cleanedInput;

      await authApi.updateProfile({ phoneNumber: formattedPhone });
      await refetchProfile();
      setPhoneModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan nomor telepon.");
    } finally {
      setSavingPhone(false);
    }
  };

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
    errorModal,
    closeErrorModal,
  } = useCheckout();

  if (loadingInitial) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 lg:top-16 z-40">
          <div className="relative flex items-center justify-center max-w-5xl mx-auto">
            <button
              onClick={() => router.push("/keranjang")}
              className="absolute left-0 p-2 hover:bg-gray-50 rounded-full transition-colors lg:hidden"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="font-display font-semibold text-[17px] text-gray-900 py-1">
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
        <div className="relative flex items-center justify-center max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/keranjang")}
            className="absolute left-0 p-2 hover:bg-gray-50 rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-display font-semibold text-[17px] text-gray-900 py-1">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:flex lg:gap-8">
        {/* Left Column - Details */}
        <div className="flex-1 space-y-6">
          {/* Missing Phone Number Alert Card */}
          {profile && !profile.phone && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 text-sm">
                    Nomor WhatsApp Belum Ditambahkan
                  </h3>
                  <p className="text-amber-700/80 text-xs mt-0.5">
                    Kami membutuhkan nomor WhatsApp Anda agar kurir dapat
                    menghubungi Anda.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPhoneModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap w-full sm:w-auto active:scale-[0.98]"
              >
                Tambahkan Nomor
              </button>
            </div>
          )}

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
              disabled={
                !allDeliverable ||
                !selectedAddressId ||
                !!(profile && !profile.phone)
              }
              onSubmit={handleSubmit}
              shippingInfos={shippingInfos}
            />
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ActionModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        description={errorModal.message}
        icon={<ShieldAlert size={28} className="text-red-500" />}
        variant="horizontal"
        primaryButton={{
          label: "Ke Beranda",
          onClick: () => router.push("/"),
        }}
        secondaryButton={{
          label: "Ubah Alamat",
          onClick: () => router.push("/profil/alamat"),
        }}
      />

      {/* Phone Number Modal */}
      {phoneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setPhoneModalOpen(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                Tambah Nomor WhatsApp
              </h3>
              <button
                onClick={() => setPhoneModalOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Masukkan nomor WhatsApp Anda agar kurir dan penjual dapat
                menghubungi Anda terkait pesanan ini.
              </p>

              <div className="flex mb-2">
                <div className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-4 py-3 flex items-center justify-center shrink-0">
                  <span className="font-bold text-slate-600">+62</span>
                </div>
                <input
                  type="tel"
                  placeholder="81234567890"
                  value={phoneInput}
                  onChange={(e) =>
                    setPhoneInput(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 w-full border border-slate-200 rounded-r-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Pastikan nomor aktif dan terdaftar di WhatsApp.
              </p>

              <button
                onClick={handleSavePhone}
                disabled={!phoneInput || savingPhone}
                className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {savingPhone ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan & Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
