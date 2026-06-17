"use client";

import React from "react";

import type { Category, Store } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  stores: Store[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  selectedStore: string;
  onStoreChange: (id: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  stores,
  selectedCategory,
  onCategoryChange,
  selectedStore,
  onStoreChange,
}) => {
  return (
    <aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-40 h-fit max-h-[80vh] overflow-y-auto scroll-hide bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-8">
        <h3 className="font-display font-bold text-[15px] text-gray-900 mb-3 tracking-wide">
          Kategori Produk
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left py-1.5 text-[14px] transition-colors ${!selectedCategory ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left py-1.5 text-[14px] transition-colors ${selectedCategory === cat.id ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              {cat.nama}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-[15px] text-gray-900 mb-3 tracking-wide">
          Daftar Toko Agro
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onStoreChange("")}
            className={`w-full text-left py-1.5 text-[14px] transition-colors ${!selectedStore ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
          >
            Semua Toko
          </button>
          {stores.slice(0, 8).map((store) => (
            <button
              key={store.id}
              onClick={() => onStoreChange(store.id)}
              className={`w-full text-left py-1.5 text-[14px] transition-colors truncate ${selectedStore === store.id ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              {store.nama}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
