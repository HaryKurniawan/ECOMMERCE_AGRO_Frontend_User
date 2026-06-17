"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star } from "lucide-react";

import { formatTanggal } from "@/lib/ecommerce-api";
import { useUlasanList } from "@/src/hooks/produk/useUlasanList";
import StarRating from "@/src/components/ecommerce/StarRating";

const UlasanProdukPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const {
    product,
    reviews,
    reviewsTotal,
    loading,
    fetchLoading,
    ratingFilter,
    handleLoadMore,
    handleSetRatingFilter,
    page,
  } = useUlasanList(id);

  if (loading && !product) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="animate-spin text-primary-500" size={36} />
      </div>
    );
  }

  const FILTERS = [
    { label: "Semua", value: null },
    { label: "5 Bintang", value: 5 },
    { label: "4 Bintang", value: 4 },
    { label: "3 Bintang", value: 3 },
    { label: "2 Bintang", value: 2 },
    { label: "1 Bintang", value: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-900 text-[15px] truncate">
            Ulasan Pembeli
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {product?.nama || "Memuat produk..."}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Rating Summary & Filters */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 mb-2 shadow-sm">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-gray-900 leading-none mb-1">
                {product?.rating ? product.rating.toFixed(1) : "—"}
              </span>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star
                  size={12}
                  fill="currentColor"
                  opacity={product?.rating && product.rating >= 4.5 ? 1 : 0.4}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-medium">
                {reviewsTotal} Ulasan
              </span>
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 pb-2">
              {FILTERS.map((filter) => {
                const isSelected = ratingFilter === filter.value;
                return (
                  <button
                    key={filter.label}
                    onClick={() => handleSetRatingFilter(filter.value)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isSelected
                        ? "bg-primary-50 text-primary-700 border-primary-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white border-y border-gray-100 min-h-[50vh]">
          {loading && page === 1 ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-primary-400" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Star size={32} className="text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                Belum ada ulasan
              </h3>
              <p className="text-xs text-gray-500">
                {ratingFilter
                  ? `Belum ada ulasan dengan ${ratingFilter} Bintang untuk produk ini.`
                  : "Jadilah yang pertama memberikan ulasan untuk produk ini."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reviews.map(
                (rev: {
                  id: string;
                  user?: { name: string };
                  createdAt: string;
                  rating: number;
                  ulasan?: string;
                }) => (
                  <div
                    key={rev.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm border border-primary-200 shadow-sm">
                          {(rev.user?.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {rev.user?.name || "Pembeli"}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatTanggal(rev.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pl-[2.85rem]">
                      <div className="mb-2">
                        <StarRating value={rev.rating} readonly size={14} />
                      </div>
                      {rev.ulasan && (
                        <p className="text-[13px] text-gray-600 leading-relaxed">
                          {rev.ulasan}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Load More Button */}
          {reviews.length < reviewsTotal && (
            <div className="p-4 flex justify-center border-t border-gray-50 bg-gray-50/30">
              <button
                onClick={handleLoadMore}
                disabled={fetchLoading}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {fetchLoading && <Loader2 size={14} className="animate-spin" />}
                {fetchLoading ? "Memuat..." : "Muat Lebih Banyak"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UlasanProdukPage;
