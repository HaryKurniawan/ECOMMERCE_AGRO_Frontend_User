"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";

import StoreCard from "@/src/components/ecommerce/StoreCard";
import { StoreGridSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useStores } from "@/src/hooks/toko/useStores";

// =====================================================
// DAFTAR TOKO PAGE — LIST SEMUA TOKO AGRO DAERAH (REDESIGNED)
// =====================================================

const DaftarTokoPage: React.FC = () => {
  const router = useRouter();
  const { stores, loading } = useStores();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    return stores.filter((store) =>
      store.nama.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [stores, searchQuery]);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 via-white to-white border border-gray-200 rounded-2xl mx-4 lg:mx-6 mt-4 lg:mt-6 overflow-hidden">
        <div className="w-full px-6 py-3 lg:py-3 flex items-center justify-between">
          <div className="flex flex-col gap-3 max-w-xl w-full">
            <div>
              <h1 className="font-display font-semibold text-lg text-white">
                Toko Agro Daerah
              </h1>
              <p className="text-white/80 text-xs mt-0.5">
                {stores.length} toko terdaftar di Jawa Barat
              </p>
            </div>

            <div className="relative w-full sm:w-80 mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari toko agro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Store Image on the right corner */}
          <div className="relative w-36 h-36 rounded-3xl overflow-hidden shrink-0 mt-3">
            <Image
              src="/images/toko.png"
              alt="Ilustrasi Toko Agro"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="w-full px-6 mt-8 pb-24">
        {/* Store List Grid */}
        {loading ? (
          <StoreGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} variant="full" />
            ))}
          </div>
        )}

        {!loading && filteredStores.length === 0 && (
          <EmptyState
            illustration="/empty-store.svg"
            title="Toko tidak ditemukan"
            description="Saat ini belum ada toko Agro Jabar terdaftar di wilayah Jawa Barat."
          />
        )}
      </div>
    </div>
  );
};

export default DaftarTokoPage;
