"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Phone, CheckCircle, RefreshCw } from "lucide-react";
import { z } from "zod";

import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/profil/useProfile";
import { authApi } from "@/lib/api/auth";
import { phoneField } from "@/src/lib/validations/schemas";

export default function PhoneVerificationModal() {
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();
  const { profile, refetch } = useProfile(isAuthenticated, _hasHydrated);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tampilkan modal jika user terautentikasi dan profile sudah dimuat,
    // tetapi belum memiliki noTeleponTerverifikasiPada.
    if (_hasHydrated && isAuthenticated && profile) {
      if (!profile.noTeleponTerverifikasiPada) {
        setIsOpen(true);
        if (profile.phone) {
          setPhoneNumber(profile.phone);
          setStep("otp");
          // Jika nomor telepon sudah ada tapi belum diverifikasi, bisa langsung ke step OTP.
          // Namun, user mungkin perlu request ulang jika OTP sudah kadaluarsa.
        } else {
          setStep("phone");
        }
      } else {
        setIsOpen(false);
      }
    }
  }, [_hasHydrated, isAuthenticated, profile]);

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
      // Setelah berhasil, refetch profile untuk mengupdate status
      await refetch();
      setIsOpen(false);
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

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      closable={false}
      keyboard={false}
      mask={{ closable: false }}
      footer={null}
      centered
      width={400}
      title={null}
    >
      <div className="text-center pt-5 pb-2">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="text-emerald-600" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Verifikasi Nomor WhatsApp
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Demi keamanan, Anda wajib memverifikasi nomor WhatsApp yang aktif
          sebelum dapat berbelanja.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-left">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Contoh: 081234567890"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleRequestOtp}
              disabled={loading || !phoneNumber}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                "Kirim OTP"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Masukkan Kode OTP
              </label>
              <p className="text-xs text-gray-500 mb-2">
                OTP telah dikirim ke WhatsApp{" "}
                <span className="font-semibold">{phoneNumber}</span>
              </p>
              <input
                type="text"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6 Digit OTP"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none tracking-widest text-center text-lg font-mono"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otpCode.length < 6}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                "Verifikasi"
              )}
            </button>
            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-transparent text-emerald-600 font-medium py-2 hover:bg-emerald-50 rounded-xl transition-colors text-sm"
            >
              Kirim Ulang OTP
            </button>
            <button
              onClick={() => setStep("phone")}
              disabled={loading}
              className="w-full bg-transparent text-gray-500 font-medium py-1 hover:text-gray-700 transition-colors text-sm underline"
            >
              Ganti Nomor Telepon
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
