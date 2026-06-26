"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Package,
  MapPin,
  Store,
  Heart,
  Settings,
  Shield,
  MessageCircle,
  HelpCircle,
  UserCheck,
  User,
  Building2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Star,
  LogOut,
} from "lucide-react";

import {
  useProfile,
  useOrdersSummary,
  useProfileActions,
  useSyncProfile,
} from "@/hooks";
import { useAuthStore } from "@/src/store/auth-store";
import { ProfileSkeleton } from "@/src/components/ecommerce/Skeleton";
import ActionModal from "@/src/components/ActionModal";

const ProfilPage: React.FC = () => {
  const router = useRouter();
  const { _hasHydrated, isAuthenticated } = useAuthStore();
  const { profile, loading: profileLoading } = useProfile(
    isAuthenticated,
    _hasHydrated,
  );
  const { orders, loading: ordersLoading } = useOrdersSummary(
    isAuthenticated,
    _hasHydrated,
  );
  const { logout } = useProfileActions();

  // Sync profile data with auth store
  useSyncProfile();

  const loading = profileLoading || ordersLoading;

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
  };

  const menuUtama = [
    {
      id: "detail-profil",
      label: "Detail Profil",
      icon: UserCheck,
      desc: "Lihat informasi lengkap akun Anda",
      path: "/profil/detail",
    },
    {
      id: "beri-nilai",
      label: "Beri Nilai Pesanan",
      icon: Star,
      desc: "Berikan ulasan untuk pesanan selesai",
      path: "/pesanan?status=selesai",
    },
    {
      id: "toko-favorit",
      label: "Toko Favorit",
      icon: Heart,
      desc: "Daftar toko yang Anda ikuti",
      path: "/profil/favorit",
    },
    {
      id: "alamat",
      label: "Alamat Tersimpan",
      icon: MapPin,
      desc: "Kelola alamat pengiriman",
      path: "/profil/alamat",
    },
  ];

  const menuLainnya = [
    {
      id: "pengaturan",
      label: "Pengaturan Akun",
      icon: Settings,
      path: "/profil/pengaturan",
    },
    {
      id: "bantuan",
      label: "Pusat Bantuan",
      icon: MessageCircle,
      path: "/chat",
    },
  ];

  if (!_hasHydrated || loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) return null;

  const orderStatuses = [
    { id: "menunggu_bayar", label: "Belum Bayar", icon: CreditCard },
    { id: "diproses", label: "Dikemas", icon: Package },
    { id: "dikirim", label: "Dikirim", icon: Truck },
    { id: "tiba", label: "Tiba", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Compact Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 pt-6 pb-20 px-5 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-500/15 rounded-full" />
        <div className="max-w-2xl mx-auto flex items-center justify-between relative z-10">
          <h1 className="font-display font-bold text-lg text-white">
            Profil Saya
          </h1>
          <button
            onClick={() => router.push("/profil/pengaturan")}
            className="p-2 bg-white/15 backdrop-blur-sm rounded-full text-white hover:bg-white/25 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Profile Card (Overlapping) */}
      <div className="max-w-2xl mx-auto px-4 -mt-14 relative z-10">
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-black/[0.03] border border-gray-100 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
              <User size={32} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-lg text-gray-900 truncate leading-tight">
                {profile.name || profile.email}
              </h2>
              <p className="text-xs text-gray-400 truncate">{profile.email}</p>
            </div>
            <button
              onClick={() => router.push("/profil/detail")}
              className="text-gray-300 hover:text-primary-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {(profile.role === "SELLER" ||
            profile.role === "ADMIN_FARMER" ||
            profile.role === "SUPER_ADMIN") && (
            <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-100">
              {profile.role === "SELLER" && (
                <button
                  onClick={() => router.push("/seller/dashboard")}
                  className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Store size={16} />
                  Dasbor Seller
                </button>
              )}
              {(profile.role === "ADMIN_FARMER" ||
                profile.role === "SUPER_ADMIN") && (
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={16} />
                  Admin Panel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Orders Quick-Access */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[15px] text-gray-900">
              Pesanan Saya
            </h3>
            <button
              onClick={() => router.push("/pesanan")}
              className="text-xs text-primary-600 font-bold hover:text-primary-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {orderStatuses.map((item) => {
              const count = orders.filter((o) => {
                if (item.id === "tiba") {
                  return (
                    o.status?.toUpperCase() === "DIKIRIM" &&
                    (o as any).pengiriman?.status === "ARRIVED"
                  );
                }
                if (item.id === "dikirim") {
                  return (
                    o.status?.toUpperCase() === "DIKIRIM" &&
                    (o as any).pengiriman?.status !== "ARRIVED"
                  );
                }
                return o.status?.toLowerCase() === item.id.toLowerCase();
              }).length;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/pesanan?status=${item.id}`)}
                  className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-gray-50 transition-colors relative active:scale-95"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                    <item.icon size={23} strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 text-center leading-tight">
                    {item.label}
                  </span>
                  {count > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Menus */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 overflow-hidden">
          {menuUtama.map((menu, i) => (
            <button
              key={menu.id}
              onClick={() => router.push(menu.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100 ${i !== menuUtama.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                <menu.icon size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-gray-800 text-sm">
                  {menu.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {menu.desc}
                </p>
              </div>
              <ChevronRight size={17} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Other Menus */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          {menuLainnya.map((menu, i) => (
            <button
              key={menu.id}
              onClick={() => router.push(menu.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100 ${i !== menuLainnya.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <menu.icon size={20} className="text-gray-400 flex-shrink-0" />
              <p className="flex-1 text-left font-semibold text-gray-800 text-sm">
                {menu.label}
              </p>
              <ChevronRight size={17} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors border-t border-gray-50 group active:bg-red-100"
          >
            <LogOut
              size={20}
              className="text-red-400 group-hover:text-red-500 flex-shrink-0"
            />
            <p className="flex-1 text-left font-semibold text-red-500 group-hover:text-red-600 text-sm">
              Keluar Akun
            </p>
          </button>
        </div>
      </div>

      <ActionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        icon={<LogOut size={40} className="text-primary-500" />}
        title="Keluar Akun"
        description="Apakah Anda yakin ingin keluar dari akun ini?"
        primaryButton={{
          label: "Ya, Keluar",
          onClick: handleConfirmLogout,
          danger: true,
        }}
        secondaryButton={{
          label: "Batal",
          onClick: () => setIsLogoutModalOpen(false),
        }}
      />
    </div>
  );
};

export default ProfilPage;
