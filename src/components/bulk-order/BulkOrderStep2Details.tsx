"use client";

import React from "react";
import { PencilLine, Plus } from "lucide-react";

interface PackagingSpec {
  ukuranKg: number;
  jumlahBungkus: number;
}

interface BulkOrderStep2DetailsProps {
  packagingSpecs: PackagingSpec[];
  catatan: string;
  onPackagingSpecsChange: (specs: PackagingSpec[]) => void;
  onCatatanChange: (catatan: string) => void;
}

export const BulkOrderStep2Details: React.FC<BulkOrderStep2DetailsProps> = ({
  packagingSpecs,
  catatan,
  onPackagingSpecsChange,
  onCatatanChange,
}) => {
  const handleAddSpec = () => {
    onPackagingSpecsChange([
      ...packagingSpecs,
      { ukuranKg: 10, jumlahBungkus: 1 },
    ]);
  };

  const handleRemoveSpec = (idx: number) => {
    onPackagingSpecsChange(packagingSpecs.filter((_, i) => i !== idx));
  };

  const handleUpdateSpec = (
    idx: number,
    field: keyof PackagingSpec,
    value: number,
  ) => {
    const newSpecs = [...packagingSpecs];
    newSpecs[idx][field] = value;
    onPackagingSpecsChange(newSpecs);
  };

  const totalKg = packagingSpecs.reduce(
    (sum, spec) => sum + spec.ukuranKg * spec.jumlahBungkus,
    0,
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
            <PencilLine size={16} className="text-blue-500" />
          </div>
          <h2 className="font-semibold text-gray-900">Rincian Pesanan</h2>
        </div>

        <div className="space-y-5">
          {/* Packaging Specification */}
          <div>
            <label
              id="packaging-spec-label"
              className="block text-xs font-semibold text-gray-500 mb-3"
            >
              Spesifikasi Kemasan (Maksimal 2 jenis)
            </label>
            <div
              className="space-y-3"
              role="group"
              aria-labelledby="packaging-spec-label"
            >
              {packagingSpecs.map((spec, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label
                      htmlFor={`ukuran-${idx}`}
                      className="block text-[10px] font-semibold text-gray-400 mb-1"
                    >
                      Ukuran per Bungkus (kg)
                    </label>
                    <input
                      id={`ukuran-${idx}`}
                      type="number"
                      min="1"
                      max="50"
                      value={spec.ukuranKg}
                      onChange={(e) =>
                        handleUpdateSpec(
                          idx,
                          "ukuranKg",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full h-10 bg-gray-50 border border-gray-100 rounded-lg px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`jumlah-${idx}`}
                      className="block text-[10px] font-semibold text-gray-400 mb-1"
                    >
                      Jumlah Bungkus
                    </label>
                    <input
                      id={`jumlah-${idx}`}
                      type="number"
                      min="1"
                      value={spec.jumlahBungkus}
                      onChange={(e) =>
                        handleUpdateSpec(
                          idx,
                          "jumlahBungkus",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full h-10 bg-gray-50 border border-gray-100 rounded-lg px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="h-10 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {packagingSpecs.length < 2 && (
              <button
                type="button"
                onClick={handleAddSpec}
                className="mt-3 w-full h-10 border-2 border-dashed border-gray-200 text-gray-600 rounded-lg hover:border-primary-300 hover:text-primary-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Tambah Jenis Kemasan
              </button>
            )}

            {packagingSpecs.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">
                  Total: {totalKg} kg
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="catatan"
              className="block text-xs font-semibold text-gray-500 mb-2"
            >
              Catatan untuk Penjual{" "}
              <span className="font-normal text-gray-400">(opsional)</span>
            </label>
            <textarea
              id="catatan"
              value={catatan}
              onChange={(e) => onCatatanChange(e.target.value)}
              placeholder="Contoh: butuh pengiriman pagi hari, kemasan kayu, dll..."
              className="w-full h-28 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
