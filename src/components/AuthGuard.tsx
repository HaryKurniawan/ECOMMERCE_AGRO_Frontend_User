"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/src/store/auth-store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated, openLoginModal: _ } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    const isGuestChatRoute = pathname?.startsWith("/chat/guest");
    const isActiveGuestChat =
      typeof window !== "undefined" &&
      pathname?.startsWith("/chat/") &&
      !!localStorage.getItem("guest_token");

    const isPublicRoute =
      pathname === "/" ||
      pathname?.startsWith("/katalog") ||
      pathname?.startsWith("/produk") ||
      pathname?.startsWith("/toko") ||
      pathname?.startsWith("/auth/") ||
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/forgot-password") ||
      isGuestChatRoute ||
      isActiveGuestChat;

    // STRICT ROLE CHECK: Only KONSUMEN allowed
    if (isAuthenticated) {
      const user = useAuthStore.getState().user;
      const ALLOWED_ROLE = "KONSUMEN";

      if (user && user.role !== ALLOWED_ROLE) {
        console.warn("🚫 Unauthorized role detected:", user.role);

        // Clear auth immediately
        useAuthStore.getState().clearAuth();

        // Clear all tokens
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          document.cookie = "accessToken=; path=/; max-age=0";
        }

        // Show modal and redirect
        const timer = setTimeout(() => {
          setShowUnauthorizedModal(false);
          router.replace("/login?error=unauthorized_role");
        }, 3000);

        setShowUnauthorizedModal(true);

        return () => clearTimeout(timer);
      }
    }

    if (!isPublicRoute && !isAuthenticated) {
      console.log(
        "🔐 Not authenticated, redirecting to login. Path:",
        pathname,
      );
      router.replace("/login");
    }
  }, [isAuthenticated, _hasHydrated, pathname, router]);

  const isGuestChatRoute = pathname?.startsWith("/chat/guest");
  // Safe check for localStorage on initial render
  const isActiveGuestChat =
    typeof window !== "undefined"
      ? pathname?.startsWith("/chat/") && !!localStorage.getItem("guest_token")
      : false;

  const isPublicRoute =
    pathname === "/" ||
    pathname?.startsWith("/katalog") ||
    pathname?.startsWith("/produk") ||
    pathname?.startsWith("/toko") ||
    pathname?.startsWith("/auth/") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    isGuestChatRoute ||
    isActiveGuestChat;

  const isAuthorized = isPublicRoute || isAuthenticated;

  if (!_hasHydrated || !isAuthorized) {
    if (!isPublicRoute) return null;
  }

  // Unauthorized Role Modal
  if (showUnauthorizedModal) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600 mb-6">
            Anda tidak memiliki akses ke aplikasi ini. Hanya pengguna dengan
            role <strong>KONSUMEN</strong> yang dapat mengakses platform
            e-commerce.
          </p>
          <div className="text-sm text-gray-500">
            Anda akan dialihkan ke halaman login...
          </div>
        </div>
      </div>
    );
  }

  return children;
}
