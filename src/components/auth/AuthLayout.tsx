import { ReactNode } from "react";
import Link from "next/link";
import { Headphones } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showGuestChat?: boolean;
}

/**
 * AuthLayout Component
 * Layout reusable untuk halaman authentication (Login, Register, Forgot Password)
 *
 * @example
 * ```tsx
 * <AuthLayout title="Login" subtitle="Masuk ke akun Anda">
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
  showGuestChat = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-6 max-w-lg mx-auto relative">
      <div className="flex-1 flex flex-col justify-center w-full pb-8 pt-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* Content */}
        {children}
      </div>

      {/* Guest Chat Button */}
      {showGuestChat && (
        <Link
          href="/chat/guest"
          className="fixed bottom-6 right-6 bg-white text-gray-500 px-4 py-2.5 rounded-full shadow-sm border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all z-50 flex items-center gap-2"
          title="Hubungi CS"
        >
          <Headphones size={18} />
          <span className="text-sm font-medium">Butuh Bantuan?</span>
        </Link>
      )}
    </div>
  );
}
