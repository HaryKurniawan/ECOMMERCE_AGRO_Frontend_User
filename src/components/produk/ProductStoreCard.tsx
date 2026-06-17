"use client";

import React from "react";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";
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
        className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:bg-primary-50/30 transition-all group text-left"
      >
        {/* Store Avatar */}
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 flex-shrink-0 flex items-center justify-center">
          {store?.foto ? (
            <Image
              src={store.foto}
              alt={store.nama || "Toko"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl">🏪</span>
          )}
        </div>

        {/* Store Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 group-hover:text-primary-700 transition-colors truncate">
            {store?.nama || "Toko Agro"}
          </p>
          {store?.kabupaten && (
            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
              <MapPin size={10} />
              {store.kabupaten}
            </p>
          )}
        </div>

        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0"
        />
      </button>
    </div>
  );
};

export default ProductStoreCard;
