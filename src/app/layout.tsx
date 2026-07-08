"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("@/src/components/ecommerce/Navbar"), {
  ssr: false,
  loading: () => (
    <div className="h-[73px] bg-white border-b border-gray-200 hidden lg:block" />
  ),
});

const BottomNav = dynamic(
  () => import("@/src/components/ecommerce/BottomNav"),
  {
    ssr: false,
    loading: () => null,
  },
);

import AuthGuard from "@/src/components/AuthGuard";
import OnboardingModal from "@/src/components/ecommerce/OnboardingModal";
import { useAuthStore } from "@/src/store/auth-store";
import { useRestoreAuth } from "@/src/hooks/auth";

import { Providers } from "./providers";

import "./globals.css";

const bottomNavPaths = ["/", "/booking", "/notifikasi", "/profil", "/chat"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isVerifiedB2B = user?.isVerifiedB2B === true;

  // Restore and validate auth on app load
  useRestoreAuth();

  const isAuth =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password");

  const isEcommerce = !isAuth;

  let showBottomNav = bottomNavPaths.includes(pathname || "");
  if (pathname === "/chat" && isVerifiedB2B) {
    showBottomNav = false;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {isEcommerce ? (
            <AuthGuard>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main
                  className={`lg:pt-32 ${showBottomNav ? "pb-20" : ""} ${pathname?.startsWith("/chat") ? "lg:pb-0" : "lg:pb-6"}`}
                >
                  <div className="desktop-container">{children}</div>
                </main>
                {showBottomNav && <BottomNav />}
                <OnboardingModal />
              </div>
            </AuthGuard>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
