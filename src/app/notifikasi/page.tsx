"use client";

import { useState } from "react";
import { ShoppingBag, Info, Clock } from "lucide-react";

import EmptyState from "@/src/components/ecommerce/EmptyState";
import type { ApiNotification, ApiNotifCategory } from "@/types";

const DUMMY_NOTIFS: ApiNotification[] = [
  {
    id: "2",
    type: "transaksi",
    title: "Pesanan Selesai",
    message:
      "Pesanan #ORD-99281 telah sampai di tujuan. Terima kasih telah berbelanja di Agro Jabar.",
    time: "5 jam yang lalu",
    isRead: true,
    icon: ShoppingBag,
    color: "bg-primary-100 text-primary-600",
  },
  {
    id: "3",
    type: "info",
    title: "Update Alamat",
    message: "Alamat pengiriman utama Anda telah berhasil diubah.",
    time: "Yesterday",
    isRead: true,
    icon: Info,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "4",
    type: "transaksi",
    title: "Menunggu Pembayaran",
    message:
      "Segera selesaikan pembayaran untuk pesanan #ORD-99305 sebelum jam 18:00.",
    time: "Yesterday",
    isRead: true,
    icon: Clock,
    color: "bg-rose-100 text-rose-600",
  },
];

const NotifikasiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ApiNotifCategory>("Semua");
  const [notifications, setNotifications] =
    useState<ApiNotification[]>(DUMMY_NOTIFS);

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Transaksi") return n.type === "transaksi";
    if (activeTab === "Info") return n.type === "info";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-lg text-gray-900">
              Notifikasi
            </h1>
          </div>
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-primary-600 px-3 py-1.5 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto scroll-hide">
        <div className="flex items-center gap-6 px-4 max-w-2xl mx-auto w-full">
          {(["Semua", "Transaksi", "Info"] as ApiNotifCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab ? "text-primary-600" : "text-gray-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-3 pb-24">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => {
            const Icon = notif.icon as React.ElementType;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md ${!notif.isRead ? "border-l-4 border-l-primary-500" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}
                >
                  {Icon && <Icon size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-bold truncate ${!notif.isRead ? "text-gray-900" : "text-gray-600"}`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between">
                    {!notif.isRead && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-primary-600">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />{" "}
                        Baru
                      </span>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="p-1 px-2 text-[10px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all flex items-center gap-1"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            illustration="/empty-notif.svg"
            title="Semua sudah dibaca!"
            description="Kamu sudah up-to-date. Notifikasi tentang pesanan dan info penting akan muncul di sini."
          />
        )}
      </div>
    </div>
  );
};

export default NotifikasiPage;
