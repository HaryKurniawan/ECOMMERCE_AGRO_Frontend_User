"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Star,
  Home,
  Briefcase,
  Warehouse,
  MoreHorizontal,
} from "lucide-react";

import { addressesApi } from "@/lib/ecommerce-api";
import { AddressListSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import type { ApiAddressData } from "@/types";

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Rumah: <Home size={14} />,
  Kantor: <Briefcase size={14} />,
  Gudang: <Warehouse size={14} />,
  Lainnya: <MoreHorizontal size={14} />,
};

function AlamatPageContent() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<ApiAddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<string | number | null>(
    null,
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressesApi.getAll();
      const data = res?.data?.data || res?.data || [];
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat alamat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchAddresses());
  }, []);

  const handleOpenForm = (address?: ApiAddressData) => {
    if (address) {
      router.push(`/profil/alamat/form?id=${address.id}`);
    } else {
      router.push("/profil/alamat/form");
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    setConfirmDelete(null);
    try {
      await addressesApi.remove(String(id));
      showToast("Alamat dihapus ✓");
      await fetchAddresses();
    } catch {
      showToast("Gagal menghapus alamat.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async (id: string | number) => {
    setActionLoading(true);
    try {
      await addressesApi.setDefault(String(id));
      showToast("Alamat utama diperbarui ✓");
      await fetchAddresses();
    } catch {
      showToast("Gagal mengatur alamat utama.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 p-4 sticky top-0 lg:top-16 z-40">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="font-display font-bold text-lg text-gray-900">
              Daftar Alamat
            </h1>
          </div>
        </div>
        <div className="p-4 max-w-2xl mx-auto">
          <AddressListSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl animate-slide-down flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 lg:top-16 z-[999]">
        <div className="relative flex items-center justify-center max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="absolute left-0 p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="font-display font-semibold text-[17px] text-gray-900 py-1">
            Alamat Saya
          </h1>
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {addresses.length === 0 ? (
          <EmptyState
            title="Belum Ada Alamat"
            description="Tambahkan alamat pengiriman agar kamu bisa mulai berbelanja di Agro Jabar."
            illustration="empty-address.svg"
            actionLabel="Tambah Alamat Baru"
            onAction={() => handleOpenForm()}
          />
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  address.isDefault
                    ? "border-primary-400 shadow-[0_2px_12px_rgba(22,163,74,0.08)]"
                    : "border-gray-100 shadow-sm hover:border-gray-200"
                }`}
              >
                {/* Default badge stripe */}
                {address.isDefault && (
                  <div className="bg-primary-600 px-4 py-1.5 flex items-center gap-1.5">
                    <Star size={11} fill="white" className="text-white" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide">
                      Alamat Utama
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {LABEL_ICONS[address.label || "Lainnya"] || (
                          <MoreHorizontal size={12} />
                        )}
                        {address.label || "Alamat"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenForm(address)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (address.id) setConfirmDelete(address.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {address.alamat}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {address.kota}, {address.provinsi}
                  </p>

                  {!address.isDefault && (
                    <button
                      onClick={() => {
                        if (address.id) handleSetDefault(address.id);
                      }}
                      disabled={actionLoading}
                      className="mt-3 w-full text-xs font-semibold text-primary-600 hover:text-primary-700 py-2 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Jadikan Alamat Utama
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 pb-safe">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => handleOpenForm()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 text-white rounded-2xl font-semibold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
          >
            <Plus size={18} />
            Tambah Alamat Baru
          </button>
        </div>
      </div>

      {/* ── Delete Confirm Bottom Sheet ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 sm:items-center">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-display font-bold text-center text-gray-900 mb-1">
              Hapus Alamat?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              Alamat ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlamatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      }
    >
      <AlamatPageContent />
    </Suspense>
  );
}
