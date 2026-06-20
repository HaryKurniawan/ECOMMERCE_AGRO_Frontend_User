"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Store,
  Loader2,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle,
  Star,
  MessageCircle,
  ShoppingBag,
  Wallet,
  ChevronRight,
  Camera,
} from "lucide-react";
import Image from "next/image";

import { formatRupiah, formatTanggal } from "@/lib/ecommerce-api";
import type { ApiOrderItem } from "@/types";
import { OrderDetailSkeleton } from "@/src/components/ecommerce/Skeleton";
import EmptyState from "@/src/components/ecommerce/EmptyState";
import { useOrderDetail, useCountdown } from "@/hooks";

import ShippingTrackingSection from "../../../components/pesanan/ShippingTrackingSection";
import PaymentCountdown from "../../../components/pesanan/PaymentCountdown";
import OrderIdStrip from "../../../components/pesanan/OrderIdStrip";
import {
  ORDER_ROADMAP,
  ORDER_STATUS_COLORS,
} from "../../../components/pesanan/order-status.constants";

/* ─── Main ────────────────────────────────────────────────────────────────── */

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    order,
    loading,
    confirming,
    chattingLoading,
    copied,
    handleConfirm,
    handleChat,
    handleCopy,
  } = useOrderDetail(id);

  const timeLeft = useCountdown(order?.createdAt);

  if (loading) return <OrderDetailSkeleton />;
  if (!order)
    return (
      <div className="min-h-screen bg-white pt-20">
        <EmptyState
          title="Pesanan Tidak Ditemukan"
          description="Pesanan tidak dapat ditemukan."
          illustration="empty-order.svg"
          actionLabel="Kembali"
          onAction={() => router.push("/pesanan")}
        />
      </div>
    );

  let statusKey = order.status?.toUpperCase() || "";
  if (
    statusKey === "DIKIRIM" &&
    (order as any).pengiriman?.status === "ARRIVED"
  ) {
    statusKey = "ARRIVED";
  }
  const colors =
    ORDER_STATUS_COLORS.get(statusKey) || ORDER_STATUS_COLORS.get("DIPROSES")!;

  // Backend uses 'item', each item has 'produk', and 'produk' has 'toko'
  const items = (order as any).item || [];
  const storeName =
    items[0]?.produk?.toko?.nama || (order as any).storeName || "Toko";

  const subtotal =
    items.reduce(
      (a: number, i: any) => a + Number(i.jumlah || 0) * Number(i.harga || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-100/80">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-[15px] text-gray-900 flex-1">
            Detail Pesanan
          </h1>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} border-current/10`}
          >
            {ORDER_ROADMAP.find((r) => r.key === statusKey)?.label || statusKey}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
        {/* Shipping Tracking */}
        {(order as any).pengiriman && (
          <ShippingTrackingSection shipping={(order as any).pengiriman} />
        )}

        {/* Order ID Strip */}
        <OrderIdStrip
          orderId={order.id}
          createdAt={order.createdAt}
          copied={copied}
          onCopy={handleCopy}
        />

        {/* Store + Items */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Store header */}
          <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-2">
              <Store size={14} className="text-gray-400" />
              <span className="font-bold text-[13px] text-gray-800">
                {storeName}
              </span>
            </div>
            <button
              onClick={handleChat}
              disabled={chattingLoading}
              className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
            >
              {chattingLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <MessageCircle size={12} />
              )}
              Chat Seller
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="px-5 py-4 flex gap-3.5">
                <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center text-xl">
                  {item.produk?.gambarUrl ? (
                    <Image
                      src={item.produk.gambarUrl}
                      alt={item.produk.nama || ""}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    "📦"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">
                    {item.produk?.nama || "Item"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.jumlah} x {formatRupiah(item.harga)}
                  </p>
                </div>
                <p className="text-[13px] font-bold text-gray-800 self-center flex-shrink-0">
                  {formatRupiah(
                    Number(item.jumlah || 0) * Number(item.harga || 0),
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Countdown for pending payment */}
        {statusKey === "MENUNGGU_BAYAR" && (
          <PaymentCountdown timeLeft={timeLeft} />
        )}

        {/* Address */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
              <MapPin size={13} className="text-primary-600" />
            </div>
            <h2 className="font-bold text-sm text-gray-800">
              Alamat Pengiriman
            </h2>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed pl-9">
            {order.alamatKirim}
          </p>
          <div className="flex items-center gap-2 mt-3 pl-9 text-[11px] text-gray-400">
            <Calendar size={12} />
            <span>
              Jadwal:{" "}
              <span className="font-semibold text-gray-600">
                {order.jadwalKirim
                  ? formatTanggal(String(order.jadwalKirim))
                  : "Segera"}
              </span>
            </span>
          </div>
        </section>

        {/* Foto Sebelum Kirim */}
        {order.fotoSebelumKirimUrl && (
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <Camera size={13} className="text-blue-600" />
              </div>
              <h2 className="font-bold text-sm text-gray-800">
                Foto Sebelum Kirim (Dari Seller)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Ini adalah kondisi pesanan Anda sebelum dikirimkan oleh Seller.
            </p>
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-100">
              <Image
                src={order.fotoSebelumKirimUrl}
                alt="Foto produk sebelum dikirim"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </section>
        )}

        {/* Payment */}
        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                <CreditCard size={13} className="text-violet-500" />
              </div>
              <h2 className="font-bold text-sm text-gray-800">Pembayaran</h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Subtotal ({items.length || 0} produk)
                </span>
                <span className="text-gray-600 font-medium">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ongkos Kirim</span>
                <span className="text-gray-600 font-medium">
                  {formatRupiah(Number(order.ongkir || 0))}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-gray-100">
                <span className="text-gray-400">Metode</span>
                <span className="text-gray-600 font-semibold">
                  {order.metodeBayar}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-t border-gray-100">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className="font-display font-black text-lg text-primary-700">
              {formatRupiah(Number(order.totalHarga || 0))}
            </span>
          </div>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2.5">
          <button
            onClick={handleChat}
            disabled={chattingLoading}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 text-gray-600 rounded-2xl font-bold text-[13px] hover:bg-gray-50 transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {chattingLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <MessageCircle size={15} />
            )}
            <span className="hidden sm:inline">Chat Seller</span>
            <span className="sm:hidden">Chat</span>
          </button>

          {statusKey === "MENUNGGU_BAYAR" ? (
            <button
              onClick={() => {
                router.push(`/pembayaran?orderId=${order.id}`);
              }}
              className="flex-1 py-3 bg-primary-600 text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Wallet size={15} /> Bayar Sekarang
            </button>
          ) : (order as any).pengiriman?.status === "ARRIVED" &&
            order.status !== "SELESAI" ? (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {confirming ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle size={15} />
              )}
              Konfirmasi Diterima
            </button>
          ) : statusKey === "SELESAI" ? (
            <div className="flex-1 flex gap-2">
              <button
                onClick={() => router.push(`/pesanan/${order.id}/rating`)}
                className="flex-1 py-3 border border-amber-300 text-amber-600 rounded-2xl font-bold text-[13px] hover:bg-amber-50 transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
              >
                <Star size={14} className="fill-amber-400" /> Ulasan
              </button>
              <button
                onClick={() => router.push("/katalog")}
                className="flex-1 py-3 bg-primary-600 text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <ShoppingBag size={14} /> Beli Lagi
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/notifikasi")}
              className="flex-1 py-3 bg-primary-600 text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Pantau Pesanan{" "}
              <ChevronRight size={14} className="text-white/60" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
