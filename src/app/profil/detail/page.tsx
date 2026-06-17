"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { useProfile } from "@/src/hooks/profil/useProfile";
import { useDefaultAddress } from "@/src/hooks/profil/useDefaultAddress";
import { useProfileActions } from "@/src/hooks/profil/useProfileActions";
import { useAuthStore } from "@/src/store/auth-store";
import { editPhoneSchema } from "@/src/lib/validations/schemas";

type EditPhoneFormData = z.infer<typeof editPhoneSchema>;

const ProfileDetailPage: React.FC = () => {
  const router = useRouter();
  const { _hasHydrated, isAuthenticated } = useAuthStore();
  const {
    profile,
    loading: profileLoading,
    refetch: fetchProfileData,
  } = useProfile(isAuthenticated, _hasHydrated);
  const { defaultAddress, loading: addressLoading } = useDefaultAddress(
    isAuthenticated,
    _hasHydrated,
  );
  const { updateProfile, actionLoading, toast } = useProfileActions();

  const loading = profileLoading || addressLoading;

  // Edit logic
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditPhoneFormData>({
    resolver: zodResolver(editPhoneSchema as never),
  });

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated && _hasHydrated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (isEditingPhone && profile?.phone) {
      setValue("phone", profile.phone);
    }
  }, [isEditingPhone, profile?.phone, setValue]);

  const handleSavePhone = async (data: EditPhoneFormData) => {
    const { success } = await updateProfile({ phoneNumber: data.phone });
    if (success) {
      setIsEditingPhone(false);
      fetchProfileData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat Detail Profil...</p>
      </div>
    );
  }

  if (!profile) return null;

  const infoItems = [
    {
      label: "Nama Lengkap",
      value: profile.name || "-",
      icon: User,
      editable: false,
    },
    {
      label: "Email",
      value: profile.email || "-",
      icon: Mail,
      editable: false,
    },
    {
      label: "Nomor Telepon",
      value: profile.phone || "-",
      icon: Phone,
      editable: true,
      placeholder: "Belum diatur",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl animate-[slide-down_0.3s_ease-out] flex items-center gap-2">
          <CheckCircle2
            size={16}
            className={
              toast.includes("berhasil") ? "text-green-400" : "text-red-400"
            }
          />
          {toast}
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 lg:top-16 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/profil")}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-display font-bold text-lg text-gray-900">
            Detail Profil
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col items-center pb-6 border-b border-gray-50">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-sm">
              🧑‍🌾
            </div>
            <h2 className="font-display font-bold text-xl text-gray-900">
              {profile.name}
            </h2>
            <p className="text-sm text-gray-500">Member Agrowisata</p>
          </div>

          <div className="space-y-5">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                  <item.icon size={18} />
                </div>
                <div className="flex-1 flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      {item.label}
                    </p>
                    {item.value === "-" && item.placeholder ? (
                      <p className="font-medium text-gray-400 text-sm italic">
                        {item.placeholder}
                      </p>
                    ) : (
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.value}
                      </p>
                    )}
                  </div>
                  {item.editable && (
                    <button
                      onClick={() => {
                        setIsEditingPhone(true);
                      }}
                      className="text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-colors opacity-0 group-hover:opacity-100 lg:opacity-100 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={14} />
                      Ubah
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">
              Alamat Utama
            </h3>
            <button
              onClick={() => router.push("/profil/alamat")}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Edit2 size={12} /> Ubah
            </button>
          </div>

          {defaultAddress ? (
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900 mb-1">
                  {defaultAddress.label}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-1">
                  {defaultAddress.alamat}
                </p>
                <p className="text-[10px] text-gray-500">
                  {defaultAddress.kota}, {defaultAddress.provinsi}{" "}
                  {defaultAddress.kodePos}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Belum ada alamat utama set
              </p>
              <button
                onClick={() => router.push("/profil/alamat")}
                className="mt-2 text-xs font-bold text-primary-600"
              >
                Tambah Alamat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Phone Modal */}
      {isEditingPhone && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 sm:items-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="font-display font-bold text-gray-900 mb-1 text-lg">
              Nomor Telepon
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Nomor ini digunakan untuk mempermudah driver menghubungi Anda saat
              pengiriman. Gunakan format Indonesia (08 atau +62).
            </p>

            <form onSubmit={handleSubmit(handleSavePhone)}>
              <div className="mb-6">
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="Contoh: 08123456789"
                    className={`w-full border ${errors.phone ? "border-red-300 ring-red-50" : "border-gray-200 focus:ring-primary-300"} rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all`}
                    onKeyDown={(e) => {
                      // Only allow numbers, +, and control keys
                      if (
                        !/[0-9+]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-xs text-red-500 font-medium italic ml-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingPhone(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                  disabled={actionLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3.5 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary-50"
                >
                  {actionLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetailPage;
