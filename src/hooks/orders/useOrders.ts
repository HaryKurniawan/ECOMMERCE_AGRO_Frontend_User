import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { ordersApi } from "@/lib/ecommerce-api";
import { queryKeys } from "@/src/hooks/query-keys";
import type { ApiOrderData } from "@/types";

export const useOrders = (isAuthenticated: boolean, _hasHydrated: boolean) => {
  const query = useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => ordersApi.getMyOrders(),
    select: (res): ApiOrderData[] => {
      const data = res?.data?.data?.data || res?.data?.data || res?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: _hasHydrated && isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;

    const eventSource = new EventSource("/api/proxy/ecom-pesanan/stream", {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === "heartbeat") return;
        query.refetch();
      } catch {
        // ignore JSON parse errors
      }
    };

    return () => {
      eventSource.close();
    };
  }, [_hasHydrated, isAuthenticated, query]);

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
