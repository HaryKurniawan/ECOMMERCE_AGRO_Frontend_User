"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, ArrowRight, Leaf, Check } from "lucide-react";

interface CitySelectionModalProps {
  isOpen: boolean;
  availableCities: { name: string; sellerCount: number }[];
  onSelectCity: (city: string) => void;
}

const CitySelectionModal: React.FC<CitySelectionModalProps> = ({
  isOpen,
  availableCities,
  onSelectCity,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const selectedCityData = availableCities.find((c) => c.name === selectedCity);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pb-20 p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm relative animate-slide-up">
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl relative">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-700 px-8 pt-10 pb-14 rounded-t-[2rem]">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-12 -left-8 w-48 h-48 bg-black/10 rounded-full" />

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/30 shadow-lg">
                <MapPin size={28} className="text-white" />
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                Halo! Di mana kotamu?
              </h2>
              <p className="text-sm text-white/70 leading-relaxed max-w-[260px] mx-auto">
                Kami tampilkan produk segar langsung dari petani di kotamu
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 pb-8 relative rounded-b-[2rem]">
            {/* Overlap element to bridge hero and content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 -mt-7 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={14} className="text-primary-500" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Pilih kota pengiriman
                </p>
              </div>

              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                    selectedCity
                      ? "border-primary-400 bg-primary-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`font-semibold text-sm ${selectedCity ? "text-primary-700" : "text-gray-400"}`}
                  >
                    {selectedCity ? selectedCity : "Pilih kota..."}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""} ${selectedCity ? "text-primary-500" : "text-gray-400"}`}
                  />
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden max-h-52 overflow-y-auto">
                    {availableCities.length > 0 ? (
                      availableCities.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setSelectedCity(city.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors group ${
                            selectedCity === city.name
                              ? "bg-primary-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div>
                            <p
                              className={`font-semibold text-sm ${selectedCity === city.name ? "text-primary-700" : "text-gray-800"}`}
                            >
                              {city.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {city.sellerCount} seller aktif
                            </p>
                          </div>
                          {selectedCity === city.name ? (
                            <Check size={15} className="text-primary-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-primary-300 transition-colors" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        Belum ada kota tersedia
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedCityData && (
                <p className="text-[11px] text-primary-600 font-medium mt-2.5 ml-1">
                  ✓ {selectedCityData.sellerCount} seller tersedia di{" "}
                  {selectedCityData.name}
                </p>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => selectedCity && onSelectCity(selectedCity)}
              disabled={!selectedCity}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                selectedCity
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Mulai Belanja
              <ArrowRight
                size={16}
                className={selectedCity ? "text-white" : "text-gray-400"}
              />
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
              Kamu bisa ganti lokasi kapan saja melalui halaman profil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectionModal;
