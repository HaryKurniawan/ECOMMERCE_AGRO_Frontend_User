import Link from "next/link";
import { Headphones } from "lucide-react";

import { AuthLayout, LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <>
      <AuthLayout title="Login">
        <LoginForm />
      </AuthLayout>

      {/* Minimalist Contact CS Button (Guest Chat) */}
      <Link
        href="/chat/guest"
        className="fixed bottom-6 right-6 bg-white text-gray-500 px-4 py-2.5 rounded-full shadow-sm border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all z-50 flex items-center gap-2"
        title="Hubungi CS"
      >
        <Headphones size={18} />
        <span className="text-sm font-medium">Butuh Bantuan?</span>
      </Link>
    </>
  );
}
