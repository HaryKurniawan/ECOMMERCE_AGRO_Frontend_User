"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import StoreCard from "@/src/components/ecommerce/StoreCard";
import SearchBar from "@/src/components/ecommerce/SearchBar";
import { StoreGridSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useStores } from "@/src/hooks/toko/useStores";

// =====================================================
// DAFTAR TOKO PAGE — LIST SEMUA TOKO AGRO DAERAH
// =====================================================

const wilayahList = [
  "Semua",
  "Bandung Raya",
  "Priangan Timur",
  "Pantura",
  "Sukabumi Raya",
  "Ciayumajakuning",
  "Cekungan Bandung",
];

const DaftarTokoPage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState("Semua");
  const { stores, loading } = useStores();

  const filteredStores = stores.filter((s) => {
    const matchSearch =
      (s.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.kabupaten || "").toLowerCase().includes(search.toLowerCase());
    const matchWilayah =
      selectedWilayah === "Semua" || s.wilayah === selectedWilayah;
    return matchSearch && matchWilayah;
  });

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-5 pb-6 lg:pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl">
                Toko Agro Daerah
              </h1>
              <p className="text-primary-100 text-xs mt-1">
                {stores.length} toko di Jawa Barat
              </p>
            </div>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari toko atau kabupaten..."
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 mt-6 space-y-6 pb-24">
        {/* Filter Wilayah */}
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
          <div className="flex gap-2">
            {wilayahList.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWilayah(w)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  selectedWilayah === w
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                    : "bg-white text-gray-600 border border-gray-100 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Store List */}
        {loading ? (
          <StoreGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} variant="full" />
            ))}
          </div>
        )}

        {!loading && filteredStores.length === 0 && (
          <EmptyState
            illustration="/empty-store.svg"
            title="Toko tidak ditemukan"
            description="Coba ubah kata kunci pencarian atau pilih wilayah lain untuk menemukan toko terdekat."
            actionLabel="Reset Pencarian"
            onAction={() => {
              setSearch("");
              setSelectedWilayah("Semua");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DaftarTokoPage;
