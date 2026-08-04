"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { addressesApi } from "@/lib/ecommerce-api";
import { queryKeys } from "@/src/hooks/query-keys";
import { useAuthStore } from "@/src/store/auth-store";
import { useLocationFilter } from "@/src/hooks/product/useLocationFilter";

export default function MandatoryAddressModal() {
  const { isAuthenticated, _hasHydrated, user, showOnboarding } =
    useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Ambil state selectedCity dan fungsi setCity (tersimpan di localStorage)
  const { availableCities, selectedCity, setCity } = useLocationFilter();
  const [localCity, setLocalCity] = useState<string>(selectedCity || "");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Jika di localStorage (selectedCity) berubah, update local state
  useEffect(() => {
    if (selectedCity) {
      setLocalCity(selectedCity);
    }
  }, [selectedCity]);

  // Skip if not hydrated, not authenticated, or not a KONSUMEN
  const isKonsumen = user?.role === "KONSUMEN";
  const shouldCheck = _hasHydrated && isAuthenticated && isKonsumen;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => addressesApi.getAll(),
    enabled: shouldCheck,
  });

  const addresses = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const hasValidAddress = addresses.some(
    (addr: any) => addr.alamat && addr.kota,
  );

  const isFormPage = pathname === "/profil/alamat/form";

  const [forceHide, setForceHide] = useState(false);

  // Fallback pengamanan ekstra: pantau secara manual jika modal Onboarding ada di layar
  useEffect(() => {
    const interval = setInterval(() => {
      const hasOnboarding = document.querySelector('[aria-label="Onboarding"]');
      setForceHide(!!hasOnboarding);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Jangan tampilkan jika OnboardingModal sedang aktif (mencegah modal bertumpuk)
  const showModal =
    shouldCheck &&
    !isLoading &&
    !hasValidAddress &&
    !isFormPage &&
    pathname !== "/login" &&
    !showOnboarding &&
    !forceHide;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={28} strokeWidth={2} />
        </div>

        {selectedCity ? (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
              Lengkapi Alamat Anda
            </h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Anda telah memilih area <strong>{selectedCity}</strong>. Silakan
              lengkapi detail alamat pengiriman Anda untuk melanjutkan.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
              Pilih Kota Domisili Anda
            </h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Silakan pilih kota tempat tinggal Anda dari daftar area yang saat
              ini terjangkau oleh layanan kami.
            </p>

            <div className="relative mb-6 text-left z-50">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between bg-gray-50 border ${isDropdownOpen ? "border-primary-500 ring-4 ring-primary-500/10 bg-white" : "border-gray-200"} text-gray-700 text-sm font-medium rounded-2xl px-4 py-3.5 focus:outline-none transition-all cursor-pointer`}
              >
                <span>{localCity || "-- Pilih Kota Tersedia --"}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <ul className="max-h-56 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-200">
                      <li
                        onClick={() => {
                          setLocalCity("");
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${!localCity ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                        -- Pilih Kota Tersedia --
                      </li>
                      {availableCities.map((cityObj) => (
                        <li
                          key={cityObj.name}
                          onClick={() => {
                            setLocalCity(cityObj.name);
                            setCity(cityObj.name); // Simpan ke localStorage
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${localCity === cityObj.name ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {cityObj.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              if (localCity) {
                if (localCity !== selectedCity) setCity(localCity);
                router.push(
                  `/profil/alamat/form?city=${encodeURIComponent(localCity)}&redirect=/`,
                );
              }
            }}
            disabled={!localCity}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-2xl hover:bg-primary-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lanjut Isi Alamat
          </button>

          {selectedCity && (
            <button
              onClick={() => {
                setCity("");
                setLocalCity("");
              }}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 py-2 transition-colors active:scale-95"
            >
              Ganti Area Pengiriman
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
