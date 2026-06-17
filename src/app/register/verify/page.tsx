"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Suspense, useState } from "react";

import { authApi } from "@/lib/api/auth";

// ── Step indicator ─────────────────────────────────────────────────────────

const steps = [
  { label: "Daftar", done: true },
  { label: "Verifikasi Email", done: false, active: true },
  { label: "Masuk", done: false },
];

// ── Main Content ───────────────────────────────────────────────────────────

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "email Anda";

  const [devOpen, setDevOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (resending || !email || email === "email Anda") return;
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      alert("Gagal mengirim ulang email verifikasi. Coba lagi nanti.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center justify-center p-5">
      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        {/* ── Logo / Brand ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-emerald-100 px-4 py-2 rounded-full shadow-sm">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-emerald-700 text-sm">
              Agro Jabar Market
            </span>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl shadow-emerald-900/10 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />

          <div className="p-7">
            {/* Steps */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.done
                          ? "bg-emerald-500 text-white"
                          : step.active
                            ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400 ring-offset-1"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap ${
                        step.done
                          ? "text-emerald-600"
                          : step.active
                            ? "text-emerald-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 h-px mt-[-14px] mx-1 ${
                        step.done ? "bg-emerald-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <Mail size={38} className="text-emerald-600" />
                </div>
                {/* Ping dot */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75" />
                  <span className="relative w-2 h-2 bg-white rounded-full" />
                </span>
              </div>
            </div>

            {/* Text */}
            <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
              Cek Email Anda
            </h1>
            <p className="text-gray-500 text-sm text-center mb-1 leading-relaxed">
              Kami telah mengirimkan tautan verifikasi ke:
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center mb-5">
              <p className="font-bold text-emerald-800 text-sm break-all">
                {email}
              </p>
            </div>
            <p className="text-xs text-gray-400 text-center mb-6">
              Tidak menemukannya? Periksa folder{" "}
              <span className="font-semibold">Spam</span> atau{" "}
              <span className="font-semibold">Promosi</span> Anda.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 h-14 shadow-lg shadow-emerald-200"
              >
                <ExternalLink size={18} /> Buka Aplikasi Email
              </a>

              <button
                onClick={handleResend}
                disabled={resending || resent}
                className="w-full bg-white text-emerald-700 font-semibold py-3.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 h-14 disabled:opacity-70"
              >
                {resending ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : resent ? (
                  <CheckCircle size={18} />
                ) : (
                  <RefreshCw size={18} />
                )}
                {resending
                  ? "Mengirim..."
                  : resent
                    ? "Email Terikirim"
                    : "Kirim Ulang Email"}
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full bg-transparent text-gray-500 font-medium py-2 flex items-center justify-center gap-2 hover:text-gray-700 transition-colors text-sm"
              >
                <ArrowLeft size={16} /> Kembali ke Login
              </button>
            </div>
          </div>
        </div>

        {/* ── Developer Options (Collapsible) ── */}
        <div className="mt-5">
          <button
            onClick={() => setDevOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            <RefreshCw
              size={12}
              className={`transition-transform ${devOpen ? "rotate-180" : ""}`}
            />
            <span className="font-mono tracking-wider">DEV OPTIONS</span>
          </button>

          {devOpen && (
            <div className="bg-white/70 backdrop-blur-sm border border-dashed border-gray-300 rounded-2xl p-4 mt-2 space-y-2">
              <p className="text-xs text-center text-gray-400 mb-3">
                ⚠️ Mode pengembangan — tidak tampil di produksi
              </p>
              <button
                onClick={() => router.push("/register/success")}
                className="w-full bg-blue-50 text-blue-600 font-semibold py-3 flex items-center justify-center gap-2 rounded-xl text-sm hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <CheckCircle size={16} /> Simulasi: Email Sudah Diverifikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emerald-50" />}>
      <VerifyContent />
    </Suspense>
  );
}
