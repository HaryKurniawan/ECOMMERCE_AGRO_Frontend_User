import { useState } from "react";
import toast from "react-hot-toast";

import { ordersApi } from "@/lib/ecommerce-api";

interface PackagingSpec {
  ukuranKg: number;
  jumlahBungkus: number;
}

export const useBulkOrder = (product: any) => {
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBulkOrderSubmit = async (data: {
    jumlah: number;
    alamatKirim: string;
    catatan: string;
    metodeBayar: string;
    packagingSpecs?: PackagingSpec[];
    diskonGrosirPersen?: number;
  }) => {
    if (!product) return;
    setLoading(true);

    try {
      const response = await ordersApi.createWholesale({
        tokoId: product.tokoId,
        produkId: product.id,
        jumlah: data.jumlah,
        harga: product.harga,
        alamatKirim: data.alamatKirim,
        catatan: data.catatan,
        metodeBayar: data.metodeBayar,
        packagingSpecs: data.packagingSpecs,
        diskonGrosirPersen: data.diskonGrosirPersen,
      });

      if (response.data) {
        toast.success(
          "Permintaan pesanan grosir berhasil dikirim ke Penjual.",
          { duration: 5000 },
        );
        setShowBulkOrderModal(false);
        setIsSuccess(true);
      }
    } catch (error: any) {
      console.error("Error submitting bulk order:", error);
      toast.error(
        error.response?.data?.message || "Gagal mengirim permintaan grosir.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    showBulkOrderModal,
    setShowBulkOrderModal,
    handleBulkOrderSubmit,
    bulkOrderLoading: loading,
    isSuccess,
    setIsSuccess,
  };
};
