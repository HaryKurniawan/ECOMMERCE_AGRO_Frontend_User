"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { register as registerApi } from "@/lib/auth";
import { UserRole } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { TextInput, PasswordInput } from "@/components/form";
import Button from "@/components/ui/Button";

import AlertMessage from "./AlertMessage";
import GoogleLoginButton from "./GoogleLoginButton";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * RegisterForm Component
 * Form register reusable dengan validasi dan error handling
 *
 * @example
 * ```tsx
 * <RegisterForm />
 * ```
 */
export default function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
        role: UserRole.KONSUMEN,
      }),
    onSuccess: async (data, variables) => {
      // Clear auth session untuk simulasi email verification
      try {
        await fetch("/api/proxy/auth/logout", { method: "POST" });
        useAuthStore.getState().clearAuth();
      } catch (e) {
        console.error("Failed to clear auth session", e);
      }

      router.push(
        `/register/verify?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if (axiosError?.response?.data?.message) {
        setErrorMessage(axiosError.response.data.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Registrasi gagal. Silakan coba lagi.");
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  const blockNumbers = (e: React.KeyboardEvent) => {
    if (/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <>
      {errorMessage && (
        <AlertMessage
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            placeholder="Contoh: John Doe"
            onKeyDown={blockNumbers}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name ? "border-red-300" : "border-gray-200"
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors bg-white`}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500 ml-1">
              {errors.name.message}
            </p>
          )}
        </div>

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

        {/* Password Input */}
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          showStrength
          {...register("password")}
        />

        {/* Confirm Password Input */}
        <PasswordInput
          label="Konfirmasi Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={mutation.isPending}
            className="bg-green-700 hover:bg-green-800 shadow-sm shadow-green-200"
          >
            Daftar Sekarang
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-100" />
        <span className="px-3 text-xs text-gray-400 bg-white">
          atau daftar dengan
        </span>
        <div className="flex-1 border-t border-gray-100" />
      </div>

      {/* Google Login */}
      <GoogleLoginButton />

      {/* Login Link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-gray-900 font-semibold hover:underline"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}
