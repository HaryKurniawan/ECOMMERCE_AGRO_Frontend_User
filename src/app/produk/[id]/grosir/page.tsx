"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { useProductDetail } from "@/src/hooks/produk/useProductDetail";
import { useAuthStore } from "@/src/store/auth-store";
import { apiClient } from "@/src/lib/api-client";

export default function GrosirLandingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const { product, loading: productLoading } = useProductDetail(
    id,
    isAuthenticated,
  );

  // Fetch diskon grosir dari config toko
  const { data: diskonGrosirPersen = 0, isLoading: diskonLoading } =
    useQuery<number>({
      queryKey: [
        "toko",
        "harga",
        "config",
        "diskon-grosir-public",
        product?.tokoId,
      ],
      queryFn: async () => {
        try {
          const res = await apiClient.get(`/toko/harga/config`);
          return res.data?.data?.diskonGrosirPersen ?? 0;
        } catch {
          return 0;
        }
      },
      enabled: _hasHydrated && !!product?.tokoId,
      staleTime: 5 * 60 * 1000,
    });

  if (productLoading || !_hasHydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary-500" size={36} />
      </div>
    );
  }

  const handleOrder = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/produk/${id}/beli-grosir`);
      return;
    }
    router.push(`/produk/${id}/beli-grosir`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-semibold text-base text-gray-900">
          Pembelian Grosir
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-36">
        {/* Illustration */}
        <div className="w-full max-w-[280px] md:max-w-sm mb-2">
          <Image
            src="/images/grosir-hero.png"
            alt="Pembelian Grosiran"
            width={400}
            height={300}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Produk Info */}
        {product && (
          <div className="mt-2 mb-1 flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="text-xs font-medium text-green-700 truncate max-w-[200px]">
              {product.nama}
            </span>
            <span className="text-xs text-green-500">· Min. 300 kg</span>
          </div>
        )}

        {/* Title & Discount */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-medium text-gray-800 leading-snug">
            Hemat Lebih Banyak
            <br />
            dengan Pembelian Grosir
          </h2>

          {diskonLoading ? (
            <div className="mt-3 h-10 w-48 mx-auto bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            diskonGrosirPersen > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-200">
                <Sparkles size={18} />
                <span className="font-bold text-lg">
                  Diskon {diskonGrosirPersen}% untuk pesanan grosiran!
                </span>
              </div>
            )
          )}
        </div>

        {/* Link ke halaman info */}
        <button
          onClick={() => router.push(`/produk/${id}/grosir/keuntungan`)}
          className="mt-6 flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors group"
        >
          <span>Lihat keuntungan &amp; tata cara pemesanan</span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-4 pb-safe">
        <div className="max-w-lg mx-auto">
          {diskonGrosirPersen > 0 && (
            <p className="text-center text-xs text-gray-400 mb-2">
              Hemat{" "}
              <span className="font-semibold text-emerald-600">
                {diskonGrosirPersen}% dari harga normal
              </span>{" "}
              untuk pesanan grosiran kamu
            </p>
          )}
          <button
            onClick={handleOrder}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-semibold text-[15px] flex items-center justify-center transition-all active:scale-[0.98] hover:bg-primary-700"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
