"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Loader2,
  Edit2,
  CheckCircle2,
  ShieldAlert,
  X,
  Check,
} from "lucide-react";

import { useProfile } from "@/src/hooks/profil/useProfile";
import { useDefaultAddress } from "@/src/hooks/profil/useDefaultAddress";
import { useProfileActions } from "@/src/hooks/profil/useProfileActions";
import { useAuthStore } from "@/src/store/auth-store";

const ProfileDetailPage: React.FC = () => {
  const router = useRouter();
  const { _hasHydrated, isAuthenticated, openPhoneVerificationModal } =
    useAuthStore();
  const {
    profile,
    loading: profileLoading,
    refetch,
  } = useProfile(isAuthenticated, _hasHydrated);
  const { loading: addressLoading } = useDefaultAddress(
    isAuthenticated,
    _hasHydrated,
  );
  const { updateProfile, actionLoading, toast } = useProfileActions();

  const loading = profileLoading || addressLoading;

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated && _hasHydrated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (profile?.name) setNameValue(profile.name);
  }, [profile?.name]);

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    const { success } = await updateProfile({ name: nameValue.trim() });
    if (success) {
      setIsEditingName(false);
      refetch();
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

  const isPhoneVerified = !!profile.noTeleponTerverifikasiPada;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
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
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 lg:top-16 z-30">
        <div className="max-w-2xl mx-auto flex items-center relative">
          <button
            onClick={() => router.push("/profil")}
            className="absolute left-0 p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-semibold text-base text-gray-800 w-full text-center">
            Detail Profil
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Avatar Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 mb-3 flex-shrink-0">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="font-medium text-xl text-gray-900 text-center leading-tight">
            {profile.name || profile.email}
          </h2>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Nama Lengkap */}
          <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-100">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 flex-shrink-0 mt-0.5">
              <User size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Nama Lengkap
              </p>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") setIsEditingName(false);
                    }}
                    disabled={actionLoading}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={actionLoading || !nameValue.trim()}
                    className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNameValue(profile.name || "");
                    }}
                    className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={actionLoading}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {profile.name || (
                      <span className="italic text-gray-400 font-normal">
                        Belum diatur
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-1 text-xs font-semibold flex-shrink-0"
                  >
                    <Edit2 size={13} />
                    Ubah
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-100">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 flex-shrink-0 mt-0.5">
              <Mail size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="font-semibold text-gray-900 text-sm truncate">
                {profile.email || "-"}
              </p>
            </div>
          </div>

          {/* Nomor Telepon */}
          <div className="flex items-start gap-4 px-5 py-4">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 flex-shrink-0 mt-0.5">
              <Phone size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Nomor Telepon
                </p>
                {profile.phone && isPhoneVerified && (
                  <span className="flex items-center gap-0.5 text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-bold border border-green-100">
                    <CheckCircle2 size={9} />
                    Terverifikasi
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                {profile.phone ? (
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {profile.phone}
                  </p>
                ) : (
                  <p className="italic text-gray-400 text-sm font-normal">
                    Belum diatur
                  </p>
                )}
                <button
                  onClick={() => openPhoneVerificationModal()}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold flex-shrink-0 ${
                    isPhoneVerified
                      ? "text-primary-600 hover:bg-primary-50"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {isPhoneVerified ? (
                    <>
                      <Edit2 size={13} />
                      Ubah
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={13} />
                      Verifikasi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
