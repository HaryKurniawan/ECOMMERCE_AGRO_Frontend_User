"use client";

import React from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";

import { formatRupiah } from "@/lib/ecommerce-api";

interface ProductSidebarProps {
  product: {
    satuan?: string;
  };
  quantity: number;
  setQuantity: (qty: number) => void;
  displayHarga: number;
  displayStok: number;
  totalStok: number;
  onBuyNow: () => void;
  onAddToCart: () => void;
  onChatSeller: () => void;
  onBulkOrder: () => void;
  chatLoading: boolean;
  actionLoading: boolean;
  isOutOfArea?: boolean;
  isAuthenticated?: boolean;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  product,
  quantity,
  setQuantity,
  displayHarga,
  displayStok,
  onBuyNow,
  onAddToCart,
  onChatSeller,
  onBulkOrder,
  chatLoading,
  actionLoading,
  isOutOfArea = false,
  isAuthenticated = false,
}) => {
  const isShoppingDisabled = isAuthenticated && isOutOfArea;

  return (
    <aside className="hidden lg:block w-[300px] xl:w-[330px] flex-shrink-0 font-normal">
      <div
        className="fixed top-40 z-30 w-[300px] xl:w-[330px]"
        style={{ right: "max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))" }}
      >
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] font-normal text-gray-700">
          <div className="mb-5">
            <p className="text-2xl font-bold text-primary-700">
              {formatRupiah(displayHarga)}
              <span className="text-sm font-normal text-gray-400 ml-1">
                / {product.satuan}
              </span>
            </p>
          </div>

          {/* Quantity */}
          <div className="mb-5">
            <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-2.5">
              Jumlah
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 flex-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-30"
                  disabled={
                    quantity <= 1 || actionLoading || isShoppingDisabled
                  }
                >
                  <Minus size={13} strokeWidth={3} className="text-gray-600" />
                </button>
                <span className="flex-1 text-center font-normal text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-all active:scale-90"
                  disabled={
                    quantity >= displayStok ||
                    actionLoading ||
                    isShoppingDisabled
                  }
                >
                  <Plus size={13} strokeWidth={3} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Order CTA */}
          <div className="mb-5">
            <button
              onClick={onBulkOrder}
              disabled={isShoppingDisabled}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 border border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-emerald-600 shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
                    Butuh lebih dari 100 {product.satuan}?
                  </p>
                  <p className="text-[9px] text-gray-400 leading-tight">
                    Ajukan order grosir
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md group-hover:bg-emerald-100 transition-colors whitespace-nowrap">
                Lihat
              </span>
            </button>
          </div>

          {/* Subtotal */}
          <div className="py-4 border-t border-b border-gray-50 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Subtotal</span>
              <span className="font-normal text-xl text-gray-900 tracking-tight">
                {formatRupiah(displayHarga * quantity)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 font-normal">
            <button
              onClick={onBuyNow}
              disabled={actionLoading || isShoppingDisabled}
              className="w-full h-12 bg-primary-600 text-white rounded-2xl font-normal hover:bg-primary-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {actionLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} />
                  Beli Sekarang
                </>
              )}
            </button>

            <button
              onClick={onAddToCart}
              disabled={actionLoading || isShoppingDisabled}
              className="w-full h-12 bg-white border border-primary-200 text-primary-700 rounded-2xl font-normal hover:bg-primary-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ShoppingCart size={16} strokeWidth={2} />
              Tambah ke Keranjang
            </button>

            <button
              onClick={onChatSeller}
              disabled={chatLoading || actionLoading}
              className="w-full h-11 bg-white border border-gray-100 text-gray-500 rounded-2xl font-normal hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {chatLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MessageCircle size={16} strokeWidth={2} />
              )}
              Tanya Penjual
            </button>

            {isShoppingDisabled && (
              <div className="text-center text-xs text-red-500 mt-3 p-2 bg-red-50/50 rounded-2xl border border-red-100 font-normal">
                Toko di luar jangkauan pengiriman Anda
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
