/**
 * useCheckoutSubmit Hook
 * Handle order submission logic
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { ordersApi } from "@/lib/ecommerce-api";
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
        // Use 15000 as default if no shipping info available
        const ongkir = info?.isAvailable ? info.ongkir || 15000 : 15000;

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

      const res = await ordersApi.create({
        metodeBayar: paymentMethod,
        alamatKirim: selectedAddressId,
        pesanan: ordersPayload,
      });

      const orderData = res.data?.data || res.data;
      const orders = Array.isArray(orderData) ? orderData : [orderData];

      // Cek apakah ada paymentUrl dari Xendit (online payment)
      const firstPaymentUrl = orders[0]?.paymentUrl;
      if (firstPaymentUrl) {
        // Redirect ke halaman Xendit invoice
        window.location.href = firstPaymentUrl;
        return;
      }

      // Fallback: tidak ada paymentUrl, artinya COD/MANUAL - redirect ke halaman pesanan
      if (orders.length > 1) {
        router.push("/pesanan");
      } else {
        const firstOrderId = orders[0]?.id;
        if (firstOrderId) {
          router.push(`/pesanan/${firstOrderId}`);
        } else {
          router.push("/pesanan");
        }
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Terjadi kesalahan saat membuat pesanan");
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
