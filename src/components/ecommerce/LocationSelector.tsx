"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, Check, Globe } from "lucide-react";

import { ALL_CITIES, type AvailableCity } from "@/lib/location";

interface LocationSelectorProps {
  selectedCity: string | null;
  availableCities: AvailableCity[];
  onSelectCity: (city: string | null) => void;
  /** "dark" untuk header hijau (mobile), "light" untuk navbar putih (desktop). */
  variant?: "light" | "dark";
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCity,
  availableCities,
  onSelectCity,
  variant = "light",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = variant === "dark";
  const label = selectedCity || "Semua Lokasi";

  const triggerClass = isDark
    ? "text-white/90 hover:text-white"
    : "text-gray-700 hover:text-primary-700";

  const handleSelect = (city: string | null) => {
    onSelectCity(city);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-1.5 transition-colors ${triggerClass}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <MapPin size={isDark ? 13 : 16} className="flex-shrink-0" />
        <span
          className={`font-medium text-left ${isDark ? "text-xs tracking-wide whitespace-normal break-words" : "text-sm truncate max-w-[140px]"}`}
        >
          {label}
        </span>
        <ChevronDown
          size={isDark ? 13 : 15}
          className={`transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-[70] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Pilih Lokasi Pengiriman
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {/* Opsi: Semua Lokasi */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                !selectedCity ? "bg-primary-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-primary-500" />
                <span
                  className={`text-sm font-semibold ${!selectedCity ? "text-primary-700" : "text-gray-800"}`}
                >
                  Semua Lokasi
                </span>
              </div>
              {!selectedCity && (
                <Check size={15} className="text-primary-500" />
              )}
            </button>

            {availableCities.length > 0 ? (
              availableCities.map((city) => {
                const active = selectedCity === city.name;
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleSelect(city.name)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors group ${
                      active ? "bg-primary-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-semibold ${active ? "text-primary-700" : "text-gray-800"}`}
                      >
                        {city.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {city.sellerCount} seller aktif
                      </p>
                    </div>
                    {active ? (
                      <Check size={15} className="text-primary-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-primary-300 transition-colors" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Belum ada lokasi tersedia
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Voucher: ALL_CITIES dipakai konsumen lain; re-export agar mudah diakses.
export { ALL_CITIES };
export default LocationSelector;
