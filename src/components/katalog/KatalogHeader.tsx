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
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="p-2 bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all shrink-0 -ml-2"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari sayur..."
            rightElement={
              <button
                onClick={onOpenFilter}
                className={`relative flex items-center justify-center p-1.5 rounded-lg transition-all ${
                  activeFiltersCount > 0
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <SlidersHorizontal size={18} />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border border-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            }
          />
        </div>
        <div className="flex items-center gap-1 shrink-0 -mr-1">
          {isVerifiedB2B && (
            <button
              onClick={() => router.push("/chat")}
              className="relative p-2 bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
              aria-label="Chat"
            >
              <MessageCircle size={20} className="text-gray-600" />
            </button>
          )}
          <CartCountButton variant="light" size="sm" />
        </div>
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
