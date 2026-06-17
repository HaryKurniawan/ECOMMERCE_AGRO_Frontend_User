import React, { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { ApiAddressData } from "@/types";

interface AddressSectionProps {
  addresses: ApiAddressData[];
  selectedAddressId: string;
  onSelect: (id: string) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses,
  selectedAddressId,
  onSelect,
}) => {
  const router = useRouter();
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary-600" size={20} />
          <h2 className="font-semibold text-lg text-gray-800">
            Alamat Pengiriman
          </h2>
        </div>
        {addresses.length > 0 && (
          <button
            onClick={() => setShowAllAddresses(!showAllAddresses)}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 active:scale-95 transition-all"
          >
            {showAllAddresses ? "Tutup" : "Alamat Lainnya"}
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-900 mb-1">Belum Ada Alamat</p>
          <p className="text-sm text-gray-500 mb-4">
            Tambahkan alamat pengiriman terlebih dahulu agar pesanan bisa
            dikirim.
          </p>
          <button
            onClick={() => {
              const currentUrl =
                window.location.pathname + window.location.search;
              router.push(
                `/profil/alamat/form?redirect=${encodeURIComponent(currentUrl)}`,
              );
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium text-sm rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 active:scale-[0.97]"
          >
            <Plus size={16} />
            Tambah Alamat Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {(showAllAddresses
            ? addresses
            : addresses.filter((a) => String(a.id) === selectedAddressId)
          ).map((addr) => {
            const isSelected = selectedAddressId === String(addr.id);
            return (
              <label
                key={addr.id}
                htmlFor={`addr-${addr.id}`}
                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all overflow-hidden ${
                  isSelected
                    ? "border-primary-500 bg-white ring-1 ring-primary-500"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  id={`addr-${addr.id}`}
                  type="radio"
                  name="address"
                  value={String(addr.id)}
                  checked={isSelected}
                  onChange={(e) => {
                    onSelect(e.target.value);
                    setShowAllAddresses(false); // otomatis tutup daftar setelah memilih
                  }}
                  className="sr-only" // Sembunyikan radio button bawaan
                />

                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    {/* Nama & Telepon */}
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-bold text-gray-900 text-sm">
                        {addr.penerima || addr.label}
                      </span>
                      {addr.telepon && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-600 text-sm">
                            {addr.telepon}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Label & Alamat */}
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1.5 mt-0.5 items-start">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold uppercase">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded font-bold uppercase">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {addr.alamat},{" "}
                          {addr.kecamatan ? `${addr.kecamatan}, ` : ""}
                          {addr.kota}, {addr.provinsi}{" "}
                          {addr.kodePos ? addr.kodePos : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Indikator Pilih - hanya muncul di daftar alamat lainnya */}
                  {showAllAddresses && !isSelected && (
                    <div className="ml-4 flex items-center justify-center h-full pt-1">
                      <div className="text-sm font-semibold text-primary-600">
                        Pilih
                      </div>
                    </div>
                  )}
                </div>
              </label>
            );
          })}

          {showAllAddresses && (
            <button
              onClick={() => {
                const currentUrl =
                  window.location.pathname + window.location.search;
                router.push(
                  `/profil/alamat/form?redirect=${encodeURIComponent(currentUrl)}`,
                );
              }}
              className="w-full mt-2 py-3 border border-dashed border-primary-300 text-primary-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
            >
              <Plus size={16} />
              Tambah Alamat Baru
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSection;
