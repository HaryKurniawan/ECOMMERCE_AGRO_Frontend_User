"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import {
  RefreshCw,
  ShieldCheck,
  MessageCircle,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/profil/useProfile";
import { authApi } from "@/lib/api/auth";
import { phoneField } from "@/src/lib/validations/schemas";

export default function PhoneVerificationModal() {
  const {
    isAuthenticated,
    _hasHydrated,
    user,
    isPhoneVerificationModalOpen,
    closePhoneVerificationModal,
  } = useAuthStore();
  const { profile, refetch } = useProfile(isAuthenticated, _hasHydrated);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [localPhone, setLocalPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const phoneNumber = "+62" + localPhone;

  useEffect(() => {
    if (isPhoneVerificationModalOpen && profile) {
      if (profile.phone && !profile.noTeleponTerverifikasiPada) {
        const raw = profile.phone.replace(/^\+?62/, "").replace(/^0/, "");
        setLocalPhone(raw);
        setStep("otp");
      } else {
        setLocalPhone("");
        setOtpCode("");
        setStep("phone");
      }
    }
  }, [isPhoneVerificationModalOpen, profile]);

  const handleRequestOtp = async () => {
    setError("");
    const parsed = phoneField.safeParse(phoneNumber);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await authApi.requestOtp({
        email: profile?.email || user?.email || "",
        noTelepon: phoneNumber,
      });
      setStep("otp");
      setTimeLeft(300);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otpCode.length < 6) {
      setError("OTP harus 6 digit");
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyOtp({
        email: profile?.email || user?.email || "",
        otpCode,
      });
      await refetch();
      closePhoneVerificationModal();
      Modal.success({
        title: "Berhasil!",
        content: "Nomor WhatsApp Anda telah berhasil diverifikasi.",
        centered: true,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "OTP tidak valid atau sudah kadaluarsa",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = async () => {
    setError("");
    const parsed = phoneField.safeParse(phoneNumber);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      // Update phone number directly
      await authApi.updateProfile({ phoneNumber });
      // Use bypass code 000000
      await authApi.verifyOtp({
        email: profile?.email || user?.email || "",
        otpCode: "000000",
      });
      await refetch();
      closePhoneVerificationModal();
      Modal.success({
        title: "Bypass Berhasil!",
        content:
          "Nomor WhatsApp Anda telah berhasil dibypass (Mode Developer).",
        centered: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Bypass gagal");
    } finally {
      setLoading(false);
    }
  };

  if (!isPhoneVerificationModalOpen) return null;

  return (
    <Modal
      open={isPhoneVerificationModalOpen}
      closable={false}
      keyboard={true}
      onCancel={closePhoneVerificationModal}
      footer={null}
      centered
      width={420}
      style={{ borderRadius: "1.5rem", overflow: "hidden" }}
      styles={{ body: { padding: 0 } }}
    >
      <div className="bg-white rounded-[1.5rem] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-6 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
              {step === "phone" ? (
                <MessageCircle size={22} className="text-green-600" />
              ) : (
                <ShieldCheck size={22} className="text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 leading-tight">
                {step === "phone" ? "Verifikasi WhatsApp" : "Masukkan Kode OTP"}
              </h2>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {step === "phone"
                  ? "Masukkan nomor WhatsApp aktif Anda"
                  : `Dikirim ke ${phoneNumber}`}
              </p>
            </div>
          </div>
          <button
            onClick={closePhoneVerificationModal}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* Body */}
        <div className="px-5 py-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-[12px] px-4 py-3 rounded-xl mb-5 border border-red-100 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {step === "phone" ? (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                  Nomor WhatsApp
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-200 focus-within:border-green-400 transition-all">
                  <span className="px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50 border-r border-gray-200 select-none">
                    +62
                  </span>
                  <input
                    type="tel"
                    value={localPhone}
                    onChange={(e) =>
                      setLocalPhone(
                        e.target.value.replace(/\D/g, "").replace(/^0+/, ""),
                      )
                    }
                    placeholder="81234567890"
                    className="flex-1 px-4 py-3 text-sm outline-none bg-white text-gray-800"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-0.5">
                  Tanpa awalan 0 — contoh:{" "}
                  <span className="font-medium text-gray-600">81234567890</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRequestOtp}
                  disabled={loading || localPhone.length < 8}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center gap-2 text-sm"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={15} />
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </button>
                <button
                  onClick={handleBypass}
                  disabled={loading || localPhone.length < 8}
                  className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all flex justify-center items-center text-sm border border-gray-200"
                >
                  Bypass
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Timer badge */}
              <div
                className={`flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-[12px] font-medium ${
                  timeLeft > 0
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Clock size={13} />
                {timeLeft > 0 ? (
                  <>
                    Kode berlaku <strong>{formatTime(timeLeft)}</strong>
                  </>
                ) : (
                  "Kode sudah kadaluarsa"
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-widest text-center">
                  Kode OTP 6 Digit
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="––––––"
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-200 focus:border-green-400 focus:outline-none tracking-[0.8em] text-center text-2xl font-bold transition-all text-gray-900 bg-gray-50"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpCode.length < 6}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center gap-2 text-sm"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={15} />
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Verifikasi Sekarang
                  </>
                )}
              </button>

              <div className="flex gap-2.5">
                <button
                  onClick={handleRequestOtp}
                  disabled={loading || timeLeft > 0}
                  className="flex-1 text-gray-700 font-medium py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-[12px] border border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {timeLeft > 0
                    ? `Kirim Ulang (${formatTime(timeLeft)})`
                    : "Kirim Ulang OTP"}
                </button>
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtpCode("");
                    setError("");
                  }}
                  disabled={loading}
                  className="flex-1 text-gray-500 font-medium py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-[12px] border border-gray-200"
                >
                  Ganti Nomor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
