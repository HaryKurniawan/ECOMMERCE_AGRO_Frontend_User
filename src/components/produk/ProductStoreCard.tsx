"use client";

import React from "react";
import Image from "next/image";
import { MapPin, ArrowRight, Store, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductStoreCardProps {
  store: {
    id: string;
    nama?: string;
    foto?: string;
    kabupaten?: string;
    rating?: number;
  } | null;
}

const ProductStoreCard: React.FC<ProductStoreCardProps> = ({ store }) => {
  const router = useRouter();

  return (
    <div className="px-4 lg:px-0">
      <button
        onClick={() => store?.id && router.push(`/toko/${store.id}`)}
        className="w-full group text-left"
      >
        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary-200 transition-all duration-200">
          {/* Store Avatar */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100 flex-shrink-0 flex items-center justify-center shadow-sm">
            {store?.foto ? (
              <Image
                src={store.foto}
                alt={store.nama || "Toko"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Store className="text-primary-400" size={22} />
            )}
          </div>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-sm text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                {store?.nama || "Toko Agro"}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {store?.kabupaten && (
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin size={10} className="flex-shrink-0" />
                  {store.kabupaten}
                </span>
              )}
              {store?.rating && (
                <>
                  <span className="text-gray-200 text-xs">·</span>
                  <span className="text-[11px] text-amber-500 flex items-center gap-0.5 font-medium">
                    <Star size={10} fill="currentColor" />
                    {store.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 pr-1">
            Kunjungi
            <ArrowRight size={13} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ProductStoreCard;
