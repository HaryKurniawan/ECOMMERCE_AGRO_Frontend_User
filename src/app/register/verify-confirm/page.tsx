"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/src/store/auth-store";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  isVerifiedB2B?: boolean;
}

interface VerifyResponse {
  data: {
    accessToken?: string;
    user?: AuthUser;
    message?: string;
  };
}

function VerifyConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const setAuth = useAuthStore((state) => state.setAuth);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading",
  );
  const [message, setMessage] = useState<string>(
    !token ? "Token tidak ditemukan." : "",
  );

  useEffect(() => {
    if (!token) return;

    authApi
      .verifyEmail(token)
      .then((res: VerifyResponse) => {
        const data = res.data;
        if (data.accessToken) {
          setAuth({
            id: data.user?.id || "",
            email: data.user?.email || "",
            name: data.user?.name,
            role: data.user?.role || "CUSTOMER",
            isVerifiedB2B: data.user?.isVerifiedB2B,
          });
        }
        setStatus("success");
        setMessage(data.message || "Email berhasil diverifikasi!");
        setTimeout(() => router.push("/"), 2000);
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "Token tidak valid atau sudah kadaluarsa.",
        );
      });
  }, [token, router, setAuth]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-5 max-w-sm mx-auto">
      {status === "loading" && (
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">
            Memverifikasi Email...
          </h1>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Email Terverifikasi!
          </h1>
          <p className="text-gray-500 text-sm">{message}</p>
          <p className="text-gray-400 text-xs mt-2">
            Mengalihkan ke halaman utama...
          </p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Verifikasi Gagal
          </h1>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors"
          >
            Daftar Ulang
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VerifyConfirmContent />
    </Suspense>
  );
}
