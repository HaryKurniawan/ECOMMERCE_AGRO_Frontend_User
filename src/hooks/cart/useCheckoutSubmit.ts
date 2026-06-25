/**
 * useCheckoutSubmit Hook
 * Handle order submission logic
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { ordersApi, cartApi } from "@/lib/ecommerce-api";
import type { ApiShippingInfo } from "@/types";

import type { StoreGroup } from "./checkout-helpers";

export function useCheckoutSubmit(
  selectedAddressId: string,
  paymentMethod: string,
  groupedByStore: StoreGroup[],
  shippingInfos: ApiShippingInfo[],
  catatanPerStore: { tokoId: string; text: string }[],
  allDeliverable: boolean,
) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selectedAddressId) {
      return alert("Silakan pilih alamat pengiriman");
    }

    if (!allDeliverable) {
      return alert(
        "Beberapa toko berada di luar jangkauan pengiriman. Silakan sesuaikan keranjang Anda.",
      );
    }

    setLoading(true);
    try {
      const ordersPayload = groupedByStore.map((group) => {
        const info = shippingInfos.find((s) => s.tokoId === group.tokoId);
        const ongkir = info?.isAvailable ? (info.ongkir ?? 0) : 0;

        return {
          tokoId: group.tokoId,
          ongkir,
          metodeKirim: "LOKAL",
          catatan:
            catatanPerStore.find((c) => c.tokoId === group.tokoId)?.text || "",
          item: group.items.map((i) => ({
            produkId: i.produkId || "",
            jumlah: Number(i.jumlah),
            harga: Number(i.harga),
            varianKemasanId: i.varianKemasanId || undefined,
          })),
        };
      });

      let finalMobileNumber = undefined;
      if (paymentMethod === "OVO") {
        const hp = prompt(
          "Masukkan No HP OVO Anda (awali dengan 08, contoh: 0812...):",
        );
        if (!hp) {
          setLoading(false);
          return;
        }
        finalMobileNumber = hp.startsWith("0") ? `+62${hp.substring(1)}` : hp;
        if (!finalMobileNumber.startsWith("+62"))
          finalMobileNumber = `+62${finalMobileNumber}`;
      }

      const payload = {
        metodeBayar: paymentMethod,
        alamatKirim: selectedAddressId,
        jadwalKirim: undefined,
        mobileNumber: finalMobileNumber,
        pesanan: ordersPayload,
      };

      const res = await ordersApi.create(payload);

      const orderData = res.data?.data || res.data;
      const orders = Array.isArray(orderData) ? orderData : [orderData];

      if (orders.length > 0) {
        // Hapus item cart yang sudah di-checkout
        try {
          const cartItemIds = groupedByStore.flatMap((g) =>
            g.items.map((i) => i.id).filter(Boolean),
          );
          if (cartItemIds.length > 0) {
            await Promise.allSettled(
              cartItemIds.map((id) => cartApi.removeItem(id)),
            );
          }
        } catch (clearErr) {
          console.warn("Failed to clear cart items after checkout:", clearErr);
        }

        // Ambil semua order ID untuk multi-checkout support di halaman pembayaran
        const orderIdsParam = orders.map((o: any) => o.id).join(",");
        router.replace(`/pembayaran?orderIds=${orderIdsParam}`);
        return;
      }

      router.replace("/pesanan");
    } catch (err: any) {
      console.error("Checkout failed", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat membuat pesanan";
      alert(`Gagal Checkout: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  }, [
    selectedAddressId,
    allDeliverable,
    groupedByStore,
    shippingInfos,
    catatanPerStore,
    paymentMethod,
    router,
  ]);

  return {
    loading,
    handleSubmit,
  };
}
