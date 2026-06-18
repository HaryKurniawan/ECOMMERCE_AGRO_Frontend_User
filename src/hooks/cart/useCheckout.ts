/**
 * useCheckout Hook
 * Main hook untuk checkout flow - orchestrates data, shipping, dan submit logic
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/src/store/auth-store";

import { useCheckoutData } from "./useCheckoutData";
import { useCheckoutShipping } from "./useCheckoutShipping";
import { useCheckoutSubmit } from "./useCheckoutSubmit";
import {
  groupItemsByStore,
  calculateTotalShipping,
  calculateTotalItems,
} from "./checkout-helpers";

export const useCheckout = () => {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // State
  const [paymentMethod, setPaymentMethod] = useState("BCA_VA");
  const [catatanPerStore, setCatatanPerStore] = useState<
    { tokoId: string; text: string }[]
  >([]);

  // Data fetching (cart items & addresses)
  const {
    items,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading: loadingInitial,
    loadData,
  } = useCheckoutData();

  // Group items by store
  const groupedByStore = useMemo(() => groupItemsByStore(items), [items]);

  // Shipping calculation
  const { shippingInfos, loading: loadingShipping } = useCheckoutShipping(
    selectedAddressId,
    groupedByStore,
    items.length,
  );

  // Calculate totals
  const totalBarang = useMemo(() => calculateTotalItems(items), [items]);
  const { totalOngkir, allDeliverable } = useMemo(
    () => calculateTotalShipping(shippingInfos, groupedByStore),
    [shippingInfos, groupedByStore],
  );
  const grandTotal = totalBarang + totalOngkir;

  // Order submission
  const { loading: loadingSubmit, handleSubmit } = useCheckoutSubmit(
    selectedAddressId,
    paymentMethod,
    groupedByStore,
    shippingInfos,
    catatanPerStore,
    allDeliverable,
  );

  // Auth check & initial data load
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    Promise.resolve().then(() => loadData(false));
  }, [isAuthenticated, _hasHydrated, loadData, router]);

  // Helper functions
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const updateCatatan = (tokoId: string, text: string) => {
    setCatatanPerStore((prev) => {
      const existing = prev.find((c) => c.tokoId === tokoId);
      if (existing) {
        return prev.map((c) => (c.tokoId === tokoId ? { ...c, text } : c));
      }
      return [...prev, { tokoId, text }];
    });
  };

  return {
    // Data
    items,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    shippingInfos,
    groupedByStore,
    selectedAddress,

    // State
    paymentMethod,
    setPaymentMethod,
    catatanPerStore,

    // Loading states
    loadingInitial,
    loadingShipping,
    loadingSubmit,

    // Calculations
    totalBarang,
    totalOngkir,
    grandTotal,
    allDeliverable,

    // Actions
    handleSubmit,
    updateCatatan,
  };
};
