"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";

import SearchBar from "@/src/components/ecommerce/SearchBar";
import CartCountButton from "@/src/components/ecommerce/CartCountButton";
import type { Category } from "@/types";

interface KatalogHeaderProps {
  total: number;
  search: string;
  setSearch: (v: string) => void;
  onOpenFilter: () => void;
  activeFiltersCount: number;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  isVerifiedB2B: boolean;
}

const KatalogHeader: React.FC<KatalogHeaderProps> = ({
  total,
  search,
  setSearch,
  onOpenFilter,
  activeFiltersCount,
  categories,
  selectedCategory,
  onCategoryChange,
  isVerifiedB2B,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-40 shadow-sm lg:hidden">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-[17px] text-gray-900">
            Katalog Sayur
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {total} produk ditemukan
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isVerifiedB2B && (
            <button
              onClick={() => router.push("/chat")}
              className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Chat"
            >
              <MessageCircle size={20} className="text-gray-600" />
            </button>
          )}
          <CartCountButton variant="light" size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari sayur..."
          />
        </div>
        <button
          onClick={onOpenFilter}
          className={`relative flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
            activeFiltersCount > 0
              ? "bg-primary-600 border-primary-600 text-white"
              : "bg-white border-gray-200 text-gray-500 hover:border-primary-300"
          }`}
        >
          <SlidersHorizontal size={18} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="overflow-x-auto scroll-hide mt-3 -mx-4 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
              !selectedCategory
                ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-200"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-200"
              }`}
            >
              {cat.nama}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KatalogHeader;
