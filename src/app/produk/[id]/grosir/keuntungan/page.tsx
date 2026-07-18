"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  ClipboardCheck,
  PackageCheck,
  Star,
  ChevronDown,
  ChevronUp,
  BadgePercent,
  Boxes,
  HandshakeIcon,
} from "lucide-react";

const STATUS_FLOW = [
  {
    icon: ShoppingBag,
    status: "Menunggu Konfirmasi Penjual",
    color: "bg-amber-100 text-amber-600",
    border: "border-amber-200",
    desc: "Pengajuan grosirmu sudah masuk ke penjual. Tunggu konfirmasi dari mereka.",
    detail: "Biasanya dikonfirmasi dalam 1×24 jam kerja.",
  },
  {
    icon: CreditCard,
    status: "Menunggu Pembayaran",
    color: "bg-blue-100 text-blue-600",
    border: "border-blue-200",
    desc: "Penjual telah mengkonfirmasi pesananmu. Selesaikan pembayaran sesuai metode yang dipilih.",
    detail:
      "Bayar sebelum batas waktu yang ditentukan agar pesanan tidak dibatalkan.",
  },
  {
    icon: ClipboardCheck,
    status: "Diproses",
    color: "bg-indigo-100 text-indigo-600",
    border: "border-indigo-200",
    desc: "Pembayaran diterima. Penjual sedang mempersiapkan produk grosirmu.",
    detail: "Proses pengemasan dan pemeriksaan kualitas sedang berlangsung.",
  },
  {
    icon: Truck,
    status: "Dikirim",
    color: "bg-purple-100 text-purple-600",
    border: "border-purple-200",
    desc: "Produkmu sedang dalam perjalanan menuju alamatmu.",
    detail: "Kamu bisa memantau kurir melalui halaman detail pesanan.",
  },
  {
    icon: PackageCheck,
    status: "Selesai",
    color: "bg-emerald-100 text-emerald-600",
    border: "border-emerald-200",
    desc: "Produk telah sampai ke tanganmu. Pesanan dinyatakan selesai.",
    detail:
      "Jangan lupa beri ulasan agar penjual bisa terus meningkatkan kualitasnya.",
  },
  {
    icon: Star,
    status: "Beri Ulasan",
    color: "bg-yellow-100 text-yellow-600",
    border: "border-yellow-200",
    desc: "Bagikan pengalamanmu belanja grosiran untuk membantu pembeli lain.",
    detail: "Ulasanmu sangat berarti bagi penjual dan komunitas.",
  },
];

const FAQS = [
  {
    q: "Berapa minimum pembelian grosiran?",
    a: "Minimum pembelian grosiran adalah 300 kg untuk keseluruhan pesanan. Ini memastikan harga spesial bisa kami berikan.",
  },
  {
    q: "Bagaimana cara memilih kemasan?",
    a: "Setelah mengisi jumlah pesanan, kamu bisa memilih ukuran kemasan (mis. 1 kg, 2 kg, 5 kg, 10 kg). Sistem akan menghitung jumlah bungkus otomatis berdasarkan total pesanan.",
  },
  {
    q: "Kapan diskon grosir diterapkan?",
    a: "Diskon grosir langsung dipotong dari subtotal saat kamu submit pesanan. Kamu bisa melihat rincian potongan di ringkasan pesanan sebelum konfirmasi.",
  },
  {
    q: "Apakah pesanan bisa dibatalkan?",
    a: "Pesanan bisa dibatalkan selama masih dalam status 'Menunggu Konfirmasi Penjual'. Setelah dikonfirmasi, pembatalan perlu menghubungi penjual langsung.",
  },
  {
    q: "Bagaimana jika ada masalah dengan produk?",
    a: "Hubungi penjual melalui chat di halaman pesanan. Jika tidak ada respons, kamu bisa melaporkan ke CS kami.",
  },
];

export default function GrosirKeuntunganPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="font-bold text-[15px] text-gray-900">
            Keuntungan &amp; Tata Cara
          </h1>
          <p className="text-xs text-gray-400">Pembelian Grosiran</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <Sparkles size={28} className="mb-3 relative z-10" />
          <h2 className="text-xl font-bold relative z-10">
            Mengapa Beli Grosiran?
          </h2>
          <p className="text-emerald-100 text-sm mt-1 relative z-10 leading-relaxed">
            Dapatkan harga terbaik untuk produk segar berkualitas tinggi
            langsung dari penjual kami.
          </p>
        </div>

        {/* Keuntungan */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Keuntungan Grosiran
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: BadgePercent,
                title: "Diskon Harga Spesial",
                desc: "Dapatkan potongan harga khusus yang tidak tersedia untuk pembelian satuan. Semakin besar pesanan, semakin hemat yang kamu dapatkan.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: Boxes,
                title: "Kemasan Fleksibel",
                desc: "Pilih ukuran kemasan sesuai kebutuhan: 1 kg, 2 kg, 5 kg, hingga 10 kg per bungkus. Cocok untuk kebutuhan bisnis maupun rumah tangga besar.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: HandshakeIcon,
                title: "Langsung dari Penjual",
                desc: "Transaksi langsung tanpa perantara. Produk lebih segar karena langsung dikirim dari toko ke tanganmu.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Truck,
                title: "Pengiriman Terintegrasi",
                desc: "Pesanan grosiran dikirim oleh kurir terpercaya dari toko. Kamu bisa memantau status pengiriman secara real-time.",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: Clock,
                title: "Jadwal Fleksibel",
                desc: "Penjual akan menghubungi dan menjadwalkan pengiriman sesuai kebutuhan bisnis kamu.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: Package,
                title: "Kualitas Terjamin",
                desc: "Produk melalui pemeriksaan kualitas sebelum dikemas dan dikirim, memastikan kesegaran sampai ke tanganmu.",
                color: "bg-teal-50 text-teal-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tata Cara Pemesanan */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Tata Cara Pemesanan
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Ikuti langkah berikut untuk melakukan pemesanan grosiran
          </p>

          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Pilih Produk",
                desc: "Buka halaman produk yang ingin kamu beli dan klik tombol 'Beli Grosir'.",
              },
              {
                step: 2,
                title: "Tentukan Jumlah & Kemasan",
                desc: "Masukkan jumlah pesanan (min. 300 kg) dan pilih ukuran kemasan yang kamu inginkan.",
              },
              {
                step: 3,
                title: "Tambah Catatan",
                desc: "Tambahkan catatan khusus jika ada, misalnya preferensi kualitas atau jadwal pengiriman yang diinginkan.",
              },
              {
                step: 4,
                title: "Pilih Alamat Pengiriman",
                desc: "Pilih alamat dari daftar tersimpan atau masukkan alamat manual.",
              },
              {
                step: 5,
                title: "Konfirmasi & Kirim Pengajuan",
                desc: "Cek ringkasan pesanan termasuk diskon yang didapat, lalu submit pengajuan.",
              },
              {
                step: 6,
                title: "Tunggu Konfirmasi Penjual",
                desc: "Penjual akan mengkonfirmasi dan menghubungi kamu untuk finalisasi pesanan.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Pesanan */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Alur Status Pesanan
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Pantau perkembangan pesananmu di setiap tahap
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

            <div className="space-y-4">
              {STATUS_FLOW.map((s, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div
                    className={`w-10 h-10 rounded-xl ${s.color} border ${s.border} flex items-center justify-center flex-shrink-0 relative z-10`}
                  >
                    <s.icon size={18} />
                  </div>
                  <div
                    className={`flex-1 bg-white rounded-2xl p-3.5 border ${s.border} shadow-sm`}
                  >
                    <p className="font-semibold text-sm text-gray-800">
                      {s.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5 italic">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Pertanyaan Umum (FAQ)
          </h3>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-sm text-gray-800 pr-4">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-3xl p-6 text-center">
          <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">
            Siap Mulai Berbelanja?
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Kembali ke halaman produk dan mulai pengajuan grosirmu sekarang.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            Kembali &amp; Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
