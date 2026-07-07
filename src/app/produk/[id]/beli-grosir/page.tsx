"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useProductDetail } from "@/src/hooks/produk/useProductDetail";
import { useBulkOrder } from "@/src/hooks/produk/useBulkOrder";
import { useAuthStore } from "@/src/store/auth-store";
import { addressesApi } from "@/lib/ecommerce-api";
import {
  formatAddressDetails,
  getSelectedAddress,
} from "@/src/lib/address-utils";
import { ProductDetailSkeleton } from "@/src/components/ecommerce/Skeleton";
import {
  BulkOrderStep1Product,
  BulkOrderStep2Details,
  BulkOrderStep3Address,
  BulkOrderProgressIndicator,
  BulkOrderSummary,
} from "@/src/components/bulk-order";
import type { ApiAddressData } from "@/types";

export default function BeliGrosirPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const {
    product,
    loading: productLoading,
    isOutOfArea,
  } = useProductDetail(id, isAuthenticated);
  const { handleBulkOrderSubmit, bulkOrderLoading, isSuccess } =
    useBulkOrder(product);

  // Fetch addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery<
    unknown,
    Error,
    ApiAddressData[]
  >({
    queryKey: ["addresses", "list"],
    queryFn: () => addressesApi.getAll(),
    select: (res: any): ApiAddressData[] => {
      const rawBody = res?.data;
      return Array.isArray(rawBody?.data)
        ? rawBody.data
        : Array.isArray(rawBody)
          ? rawBody
          : [];
    },
    enabled: isAuthenticated && _hasHydrated,
    staleTime: 5 * 60 * 1000,
  });

  // State management
  const [jumlah, setJumlah] = useState<number>(300);
  const [catatan, setCatatan] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useManual, setUseManual] = useState(false);
  const [manualAlamat, setManualAlamat] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [packagingSpecs, setPackagingSpecs] = useState<
    Array<{ ukuranKg: number; jumlahBungkus: number }>
  >([]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      const defaultId = String(defaultAddr?.id ?? addresses[0].id);
      // Use a callback to avoid setState in effect
      const timer = setTimeout(() => {
        setSelectedAddressId(defaultId);
        setUseManual(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [addresses.length]);

  // Loading states
  if (!_hasHydrated || productLoading) return <ProductDetailSkeleton />;
  if (!isAuthenticated) {
    router.push(`/auth/login?redirect=/produk/${id}/beli-grosir`);
    return null;
  }

  // Out of area guard
  if (isOutOfArea) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="font-display font-bold text-xl text-gray-900 mb-2">
            Lokasi di Luar Jangkauan
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Maaf, pengajuan grosir hanya tersedia untuk area tertentu. Silakan
            hubungi penjual untuk informasi lebih lanjut.
          </p>
          <button
            onClick={() => router.back()}
            className="w-full bg-primary-600 text-white font-semibold py-3 rounded-2xl hover:bg-primary-700 transition-all"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Form validation
  const isFormValid =
    jumlah >= 300 &&
    (useManual ? manualAlamat.trim().length > 0 : selectedAddressId !== "");

  // Handle submit
  const handleSubmit = async () => {
    let finalAlamat = "";
    if (useManual) {
      finalAlamat = manualAlamat;
    } else {
      const addr = getSelectedAddress(addresses, selectedAddressId);
      if (addr) {
        finalAlamat = formatAddressDetails(addr);
      }
    }
    await handleBulkOrderSubmit({
      jumlah,
      alamatKirim: finalAlamat,
      catatan,
    });
  };

  // Step labels
  const STEPS = ["Produk & Kualitas", "Rincian Pesanan", "Alamat Kirim"];

  return (
    <div className="min-h-screen bg-gray-50/80 pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 sticky top-0 lg:top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90 lg:hidden"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="font-semibold text-base text-gray-900">
            Pengajuan Grosir
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        {/* Progress Indicator */}
        <BulkOrderProgressIndicator currentStep={currentStep} steps={STEPS} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form Steps */}
          <div className="lg:col-span-2 space-y-5">
            {/* Step 1: Product & Quality */}
            {currentStep === 1 && (
              <BulkOrderStep1Product
                product={product}
                jumlah={jumlah}
                onJumlahChange={setJumlah}
              />
            )}

            {/* Step 2: Order Details */}
            {currentStep === 2 && (
              <BulkOrderStep2Details
                jumlah={jumlah}
                packagingSpecs={packagingSpecs}
                catatan={catatan}
                onPackagingSpecsChange={setPackagingSpecs}
                onCatatanChange={setCatatan}
              />
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <BulkOrderStep3Address
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                useManual={useManual}
                manualAlamat={manualAlamat}
                addressesLoading={addressesLoading}
                onAddressSelect={setSelectedAddressId}
                onManualAddressToggle={setUseManual}
                onManualAlamatChange={setManualAlamat}
                onNavigateToForm={() => router.push("/profil/alamat")}
              />
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <BulkOrderSummary
              product={product}
              jumlah={jumlah}
              packagingSpecs={packagingSpecs}
              currentStep={currentStep}
              isFormValid={isFormValid}
              bulkOrderLoading={bulkOrderLoading}
              onNextStep={() => setCurrentStep((prev) => prev + 1)}
              onPrevStep={() => setCurrentStep((prev) => prev - 1)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up relative p-8 text-center border border-gray-100">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 size={36} className="text-white" />
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2 tracking-tight">
              Pengajuan Berhasil! 🎉
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Pengajuan grosir kamu telah dikirim ke Penjual. Kamu bisa memantau
              status pesanan di halaman pesanan.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.replace("/pesanan")}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary-200"
              >
                Lihat Status Pengajuan
              </button>
              <button
                onClick={() => router.replace("/")}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold text-sm transition-all"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
