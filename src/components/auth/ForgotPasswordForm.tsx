"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { Modal, Button as AntdButton } from "antd";

import { authApi } from "@/lib/ecommerce-api";
import Button from "@/components/ui/Button";

import AlertMessage from "./AlertMessage";

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * ForgotPasswordForm Component
 * Form forgot password reusable dengan validasi dan error handling
 *
 * @example
 * ```tsx
 * <ForgotPasswordForm />
 * ```
 */
export default function ForgotPasswordForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [sentModalOpen, setSentModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await authApi.forgotPassword(data.email);
      setSentModalOpen(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        error?.response?.data?.message || "Terjadi kesalahan, coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const emailValue = getValues("email");

  // Form State
  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={24} />
            Reset Password Terkirim
          </div>
        }
        open={sentModalOpen}
        onCancel={() => setSentModalOpen(false)}
        footer={null}
        centered
        closable={false}
        mask={{ closable: false }}
      >
        <p className="text-gray-600 mt-4 mb-6">
          Jika email Anda terdaftar, instruksi reset password telah dikirim ke{" "}
          <span className="font-semibold text-gray-900">{emailValue}</span>.
          Silakan cek inbox atau folder spam Anda.
        </p>
        <div className="flex flex-col gap-3">
          <AntdButton
            type="primary"
            size="large"
            className="bg-green-600 hover:bg-green-700 w-full"
            onClick={() => {
              window.location.href = `mailto:${emailValue}`;
            }}
          >
            Buka Email
          </AntdButton>
          <AntdButton
            size="large"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Ke Halaman Login
          </AntdButton>
        </div>
      </Modal>
      <div className="text-center mb-8">
        <div className="w-24 h-24 mb-6 mx-auto flex items-center justify-center bg-green-50 rounded-full border border-green-100">
          <KeyRound size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lupa Password?
        </h2>
        <p className="text-sm text-gray-500 px-4">
          Masukkan email Anda. Kami akan kirimkan link untuk reset password.
        </p>
      </div>

      {errorMessage && (
        <AlertMessage
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Contoh: user@email.com"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email ? "border-red-300" : "border-gray-200"
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors bg-white`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="bg-green-700 hover:bg-green-800 shadow-sm shadow-green-200"
          >
            Kirim Link Reset
          </Button>
        </div>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>
      </div>
    </>
  );
}
