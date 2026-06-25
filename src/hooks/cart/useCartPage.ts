import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { cartApi } from "@/lib/ecommerce-api";
import { useAuthStore } from "@/src/store/auth-store";
import type { ApiCartItem, VarianKemasan } from "@/types";

interface RawCartItem {
  id: string;
  produkId?: string;
  jumlah: number | string;
  produk?: {
    nama?: string;
    satuan?: string;
    gambarUrl?: string;
    harga?: number | string;
    beratGram?: number | string;
    toko?: { id: string; nama: string };
    varian?: VarianKemasan[];
  };
  varianKemasan?: {
    id: string;
    ukuranKg: number;
    biayaTambahan?: number;
    harga?: number;
  };
  varianKemasanId?: string;
}

export const useCartPage = () => {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchCart = useCallback(
    async (showLoading = true) => {
      if (!isAuthenticated) return;

      try {
        if (showLoading) setLoading(true);
        const res = await cartApi.get();
        const body = res.data;
        const inner = body?.data;

        // Handle both wrapped and unwrapped items
        const items = (
          Array.isArray(inner?.item)
            ? inner.item
            : Array.isArray(body?.item)
              ? body.item
              : []
        ) as RawCartItem[];

        const mappedItems: ApiCartItem[] = items.map((item: RawCartItem) => {
          const productData = item.produk;
          const varianData = item.varianKemasan;
          let displayPrice = productData?.harga || 0;
          let varianDeskripsi = undefined;

          if (varianData) {
            const baseHarga = Number(productData?.harga || 0);
            displayPrice =
              baseHarga * varianData.ukuranKg +
              Number(varianData.biayaTambahan || 0);
            varianDeskripsi = `Kemasan ${varianData.ukuranKg} kg`;
          }

          const availableVariants = productData?.varian || [];

          return {
            id: item.id,
            produkId: item.produkId || "",
            produkNama: productData?.nama || "Unknown Product",
            harga: Number(displayPrice),
            jumlah: Number(item.jumlah),
            satuan: productData?.satuan || "pcs",
            gambar: productData?.gambarUrl || "📦",
            tokoId: productData?.toko?.id || "",
            storeName: productData?.toko?.nama || "Unknown Store",
            beratGram: productData?.beratGram || 1000,
            varian: varianDeskripsi,
            varianId: item.varianKemasanId,
            availableVariants,
          };
        });

        setCartItems(mappedItems);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    Promise.resolve().then(() => fetchCart(false)); // Already loading by default
  }, [isAuthenticated, _hasHydrated, fetchCart, router]);

  // Group by store
  const groupedByStore = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        if (!acc[item.tokoId]) {
          acc[item.tokoId] = { storeName: item.storeName, items: [] };
        }
        acc[item.tokoId].items.push(item);
        return acc;
      },
      {} as Record<string, { storeName: string; items: ApiCartItem[] }>,
    );
  }, [cartItems]);

  // Selection Logic
  const toggleItemSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const toggleStoreSelection = (itemIds: string[]) => {
    const allSelected = itemIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !itemIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...itemIds])));
    }
  };

  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const selectedVariant = item.availableVariants?.find(
      (v) => v.id === item.varianId,
    );
    // fallback to item.stok if there are no variants, assuming it exists or default to 0 (unlimited if 0 but our UI treats 0 as out of stock, wait, let's just not block here if maxStock is 0 just in case)
    const maxStock = selectedVariant?.stokKemasan ?? 0;

    const newJumlah = Math.max(1, item.jumlah + delta);
    if (newJumlah === item.jumlah) return;

    if (maxStock > 0 && newJumlah > maxStock) {
      return;
    }

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, jumlah: newJumlah } : i)),
    );

    // Debounce API call
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }

    timeoutRefs.current[id] = setTimeout(async () => {
      try {
        await cartApi.updateItem(id, newJumlah, item.varianId);
        fetchCart(false);
      } catch (error: any) {
        console.error("Error updating quantity:", error);
        fetchCart(false); // Revert to server state
        const errMsg =
          error.response?.data?.message ||
          error.message ||
          "Gagal mengubah jumlah";
        alert(`Gagal: ${errMsg}`);
      }
    }, 400);
  };

  const updateVariant = async (id: string, newVarianId: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    try {
      await cartApi.updateItem(id, item.jumlah, newVarianId);
      fetchCart();
    } catch (error: any) {
      console.error("Error updating variant:", error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengubah variasi";
      alert(`Gagal: ${errMsg}`);
      fetchCart();
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartApi.removeItem(id);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const removeSelected = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => cartApi.removeItem(id)));
      await fetchCart();
      setSelectedIds([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error("Error removing selected:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) setSelectedIds([]);
  };

  // Totals based on selection
  const activeItems = isSelectMode
    ? cartItems.filter((item) => selectedIds.includes(item.id))
    : cartItems;

  const subtotal = activeItems.reduce(
    (sum, item) => sum + Number(item.harga) * Number(item.jumlah),
    0,
  );
  const ongkir = 0;
  const total = subtotal + ongkir;

  return {
    cartItems,
    loading,
    isSelectMode,
    selectedIds,
    groupedByStore,
    subtotal,
    ongkir,
    total,
    fetchCart,
    toggleItemSelection,
    toggleStoreSelection,
    updateQuantity,
    updateVariant,
    removeItem,
    removeSelected,
    toggleSelectMode,
  };
};
