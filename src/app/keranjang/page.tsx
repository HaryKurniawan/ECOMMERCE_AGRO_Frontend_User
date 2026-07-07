"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CartGroupSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useCartPage } from "@/hooks";
import { CartStoreGroup, CartSummary } from "@/src/components/keranjang";

const KeranjangPage: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    loading,
    isSelectMode,
    selectedIds,
    groupedByStore,
    subtotal,
    ongkir,
    total,
    toggleItemSelection,
    toggleStoreSelection,
    updateQuantity,
    updateVariant,
    removeItem,
    removeSelected,
    toggleSelectMode,
  } = useCartPage();

  const [itemToDelete, setItemToDelete] = React.useState<
    import("@/types").ApiCartItem | null
  >(null);

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen lg:min-h-[calc(100vh-140px)] flex flex-col bg-white lg:bg-transparent">
        <div className="bg-white/90 lg:bg-transparent lg:backdrop-blur-none backdrop-blur-xl border-b-2 border-gray-100 lg:border-none px-4 py-3 sticky top-0 lg:top-16 z-40">
          <div className="flex items-center gap-4 max-w-7xl mx-auto px-2">
            <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
            <div className="w-32 h-5 bg-gray-100 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex-1 px-4 py-4 space-y-4">
          <CartGroupSkeleton />
          <CartGroupSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:min-h-[calc(100vh-140px)] flex flex-col bg-white lg:bg-transparent">
      {/* Header */}
      <div className="bg-white/90 lg:bg-transparent lg:backdrop-blur-none backdrop-blur-xl border-b-2 border-gray-100 lg:border-none px-4 py-3 sticky top-0 lg:top-16 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100 lg:hidden"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            illustration="/empty-cart.svg"
            title="Keranjang masih kosong"
            description="Belum ada produk di keranjangmu. Yuk, temukan sayur segar pilihan hari ini!"
            actionLabel="Mulai Belanja"
            onAction={() => router.push("/")}
          />
        </div>
      ) : (
        <>
          <div className="flex-1 px-4 lg:px-6 py-4 pb-52 lg:pb-10">
            <div className="lg:flex lg:gap-6 max-w-7xl mx-auto items-start">
              <div className="flex-1 space-y-4">
                {cartItems.length > 0 && (
                  <div className="flex justify-end lg:justify-between items-center mb-2">
                    <h2 className="font-display font-semibold text-lg text-gray-900 hidden lg:block">
                      Daftar Produk
                    </h2>
                    <button
                      onClick={toggleSelectMode}
                      className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all border ${
                        isSelectMode
                          ? "bg-primary-50 text-primary-600 border-primary-100"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-gray-200 bg-white shadow-sm"
                      }`}
                    >
                      {isSelectMode ? "Selesai" : "Pilih Item"}
                    </button>
                  </div>
                )}
                {Object.entries(groupedByStore).map(
                  ([tokoId, { storeName, items }]) => (
                    <CartStoreGroup
                      key={tokoId}
                      tokoId={tokoId}
                      storeName={storeName}
                      items={items}
                      isSelectMode={isSelectMode}
                      selectedIds={selectedIds}
                      onToggleStore={() =>
                        toggleStoreSelection(items.map((i) => i.id))
                      }
                      onToggleItem={toggleItemSelection}
                      onUpdateQuantity={updateQuantity}
                      onUpdateVariant={updateVariant}
                      onPromptDelete={setItemToDelete}
                    />
                  ),
                )}
              </div>

              {/* Desktop Summary */}
              <div className="hidden lg:block lg:w-96">
                <div className="sticky top-24">
                  <CartSummary
                    subtotal={subtotal}
                    ongkir={ongkir}
                    total={total}
                    isSelectMode={isSelectMode}
                    selectedCount={selectedIds.length}
                    onRemoveSelected={removeSelected}
                    variant="desktop"
                  />
                </div>
              </div>
            </div>
          </div>

          <CartSummary
            subtotal={subtotal}
            ongkir={ongkir}
            total={total}
            isSelectMode={isSelectMode}
            selectedCount={selectedIds.length}
            onRemoveSelected={removeSelected}
            variant="mobile"
          />
        </>
      )}

      {/* Delete Confirmation Modal (Root Level) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up relative">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                Hapus Produk?
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Yakin ingin menghapus <strong>{itemToDelete.produkNama}</strong>{" "}
                dari keranjang?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    removeItem(itemToDelete.id);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeranjangPage;
