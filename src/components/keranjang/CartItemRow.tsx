import React from "react";
import Image from "next/image";
import { Minus, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";

import { formatRupiah } from "@/lib/ecommerce-api";
import type { ApiCartItem } from "@/types";

interface CartItemRowProps {
  item: ApiCartItem;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggleSelection: () => void;
  onUpdateQuantity: (delta: number) => void;
  onUpdateVariant?: (newVarianId: string) => void;
  onPromptDelete?: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  isSelectMode,
  isSelected,
  onToggleSelection,
  onUpdateQuantity,
  onUpdateVariant,
  onPromptDelete,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMaxStock = false; // We don't have stock validation per item in cart anymore without grades, or maybe use max value

  const handleMinusClick = () => {
    if (item.jumlah <= 1) {
      onPromptDelete?.();
    } else {
      onUpdateQuantity(-1);
    }
  };

  return (
    <div
      className={`px-6 py-5 transition-all relative z-0 ${
        isSelectMode && !isSelected ? "opacity-40 grayscale-[0.5]" : ""
      }`}
    >
      <div className="flex items-start gap-5">
        {isSelectMode && (
          <div className="pt-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelection}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
            />
          </div>
        )}

        {/* Product Image */}
        <Link
          href={`/produk/${item.produkId}`}
          className="relative w-[72px] h-[72px] bg-gray-50 rounded-2xl flex-shrink-0 border border-gray-100 overflow-hidden group block"
        >
          {item.gambar && item.gambar.startsWith("http") ? (
            <Image
              src={item.gambar}
              alt={item.produkNama}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {item.gambar && !item.gambar.startsWith("http")
                ? item.gambar
                : "📦"}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link href={`/produk/${item.produkId}`}>
                <p className="font-display font-semibold text-base text-gray-900 line-clamp-2 leading-tight hover:text-primary-600 transition-colors cursor-pointer">
                  {item.produkNama}
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.availableVariants && item.availableVariants.length > 1 ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg border-none focus:outline-none transition-colors"
                >
                  <span>
                    {item.availableVariants.find((v) => v.id === item.varianId)
                      ?.ukuranKg
                      ? `Kemasan ${item.availableVariants.find((v) => v.id === item.varianId)?.ukuranKg} kg`
                      : item.varian || "Pilih Kemasan"}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 py-1">
                    {item.availableVariants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onUpdateVariant?.(v.id);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[11px] font-medium flex items-center justify-between transition-colors ${
                          item.varianId === v.id
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>Kemasan {v.ukuranKg} kg</span>
                        <span
                          className={`text-[10px] ${item.varianId === v.id ? "text-primary-500" : "text-gray-400"}`}
                        >
                          Sisa {v.stokKemasan}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : item.varian ? (
              <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                Variasi: {item.varian}
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                / {item.satuan}
              </span>
            )}
          </div>

          {/* Price + Quantity */}
          <div className="flex items-end justify-between mt-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold leading-none">
                Subtotal
              </p>
              <p className="font-display font-bold text-base text-gray-900 tracking-tight">
                {formatRupiah(item.harga * item.jumlah)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={handleMinusClick}
                  className="w-9 h-9 flex items-center justify-center transition-colors border-r border-gray-100 hover:bg-gray-50 active:bg-gray-100"
                >
                  <Minus size={14} className="text-gray-400" />
                </button>
                <span className="font-display text-sm font-semibold w-10 text-center text-gray-900 cursor-default">
                  {item.jumlah}
                </span>
                <button
                  onClick={() => onUpdateQuantity(1)}
                  disabled={isMaxStock}
                  className={`w-9 h-9 flex items-center justify-center transition-colors border-l border-gray-100 ${
                    isMaxStock
                      ? "bg-red-50 opacity-40 cursor-not-allowed border-l-red-100 text-red-400"
                      : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <Plus
                    size={14}
                    className={isMaxStock ? "text-red-400" : "text-gray-400"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
