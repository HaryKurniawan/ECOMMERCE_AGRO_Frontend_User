"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/src/store/auth-store";
import { useCityStore } from "@/src/store/city-store";
import {
  storesApi,
  productsApi,
  categoriesApi,
  addressesApi,
} from "@/lib/ecommerce-api";
import { extractArray } from "@/lib/api-helpers";
import {
  computeAvailableCities,
  enrichProductsWithCity,
  filterProductsByCity,
  storeMatchesCity,
} from "@/lib/location";
import { queryKeys } from "@/src/hooks/query-keys";
import type {
  EcomProduct,
  Store as EcomStore,
  Category,
  ApiAddressData as Address,
} from "@/types";

export const useHomeData = () => {
  const { isAuthenticated, user } = useAuthStore();

  const storesQuery = useQuery({
    queryKey: queryKeys.stores.all,
    queryFn: () => storesApi.getAll().catch(() => ({ data: { data: [] } })),
    select: (res): EcomStore[] => extractArray<EcomStore>(res),
    staleTime: 10 * 60 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: queryKeys.products.list({ limit: 1000 }),
    queryFn: () =>
      productsApi.getAll({ limit: 1000 }).catch(() => ({ data: { data: [] } })),
    select: (res): EcomProduct[] => extractArray<EcomProduct>(res),
    staleTime: 5 * 60 * 1000,
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.getAll().catch(() => ({ data: [] })),
    select: (res): Category[] => extractArray<Category>(res),
    staleTime: 30 * 60 * 1000,
  });

  const addressesQuery = useQuery({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => addressesApi.getAll().catch(() => ({ data: [] })),
    select: (res): Address[] => extractArray<Address>(res),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const { selectedCity, setCity, hasSetCity } = useCityStore();

  // Derived data
  const storesData = storesQuery.data ?? [];
  const productsData = productsQuery.data ?? [];

  // Auto-detect city from default address (hanya jika user belum memilih manual)
  useEffect(() => {
    if (hasSetCity) return;
    if (
      isAuthenticated &&
      addressesQuery.data &&
      addressesQuery.data.length > 0
    ) {
      const defaultAddress =
        addressesQuery.data.find((a) => a.isDefault) || addressesQuery.data[0];
      if (defaultAddress && defaultAddress.kota) {
        // Hanya set jika ada toko yang melayani kota tersebut
        const isCitySupported = storesData.some((s: EcomStore) =>
          storeMatchesCity(s, defaultAddress.kota || ""),
        );
        if (isCitySupported && defaultAddress.kota !== selectedCity) {
          setCity(defaultAddress.kota);
        }
      }
    }
  }, [
    hasSetCity,
    isAuthenticated,
    addressesQuery.data,
    storesData,
    selectedCity,
    setCity,
  ]);

  // Tambahkan label kota seller ke setiap produk (untuk ditampilkan di card)
  const enrichedProducts = useMemo(
    () => enrichProductsWithCity(productsData, storesData),
    [productsData, storesData],
  );

  // Produk yang sudah difilter sesuai lokasi terpilih.
  // null / "Semua Lokasi" => tampilkan semua (default untuk guest).
  const filteredProducts = useMemo(
    () => filterProductsByCity(enrichedProducts, storesData, selectedCity),
    [enrichedProducts, storesData, selectedCity],
  );

  // Daftar kota dengan seller aktif (untuk dropdown lokasi)
  const availableCities = useMemo(
    () => computeAvailableCities(storesData),
    [storesData],
  );

  const loading =
    storesQuery.isLoading ||
    productsQuery.isLoading ||
    categoriesQuery.isLoading ||
    (isAuthenticated && addressesQuery.isLoading);

  return {
    stores: storesData,
    products: filteredProducts, // difilter sesuai lokasi terpilih
    allProducts: enrichedProducts, // semua produk (sudah ada label kota)
    categories: categoriesQuery.data ?? [],
    addresses: addressesQuery.data ?? [],
    availableCities,
    selectedCity,
    setCity,
    hasSetCity,
    loading,
    isAuthenticated,
    isVerifiedB2B: user?.isVerifiedB2B === true,
  };
};
