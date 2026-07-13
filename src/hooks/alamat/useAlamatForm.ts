"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Modal } from "antd";

import { addressesApi, storesApi } from "@/lib/ecommerce-api";
import { queryKeys } from "@/src/hooks/query-keys";
import { alamatSchema } from "@/src/lib/validations/schemas";
import type { MapPickerValue } from "@/src/components/ui/MapPicker";
import type { ApiAddressData, Store } from "@/types";
import { useCityStore } from "@/src/store/city-store";
import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/profil/useProfile";

type AlamatFormData = z.infer<typeof alamatSchema>;

export function useAlamatForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const redirectTo = searchParams.get("redirect");
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(!!editId);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityWarning, setCityWarning] = useState("");
  const [addressesLength, setAddressesLength] = useState(0);
  const [mapValue, setMapValue] = useState<MapPickerValue | undefined>(
    undefined,
  );

  const { selectedCity, setCity } = useCityStore();
  const defaultCity = searchParams.get("city") || selectedCity;

  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { profile } = useProfile(isAuthenticated, _hasHydrated);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AlamatFormData>({
    resolver: zodResolver(alamatSchema as never),
    defaultValues: {
      label: "Rumah",
      penerima: "",
      telepon: "",
      alamat: "",
      kota: defaultCity || "",
      kecamatan: "",
      kelurahan: "",
      provinsi: "",
      kodePos: "",
      isDefault: false,
    },
  });

  const formData = watch();

  useEffect(() => {
    if (!editId && profile) {
      if (!getValues("penerima") && profile.name) {
        setValue("penerima", profile.name);
      }
      if (!getValues("telepon") && profile.phone) {
        setValue("telepon", profile.phone);
      }
    }
  }, [editId, profile, setValue, getValues]);

  useEffect(() => {
    const checkAddresses = async () => {
      try {
        const res = await addressesApi.getAll();
        const data = res?.data?.data || res?.data || [];
        setAddressesLength(Array.isArray(data) ? data.length : 0);

        if (editId) {
          const target = Array.isArray(data)
            ? data.find((a: ApiAddressData) => String(a.id) === String(editId))
            : null;

          if (target) {
            reset({
              label: target.label || "Rumah",
              penerima: target.penerima || "",
              telepon: target.telepon || "",
              alamat: target.alamat || "",
              kota: target.kota || "",
              kecamatan: target.kecamatan || "",
              kelurahan: target.kelurahan || "",
              provinsi: target.provinsi || "",
              kodePos: target.kodePos || "",
              isDefault: !!target.isDefault,
            });
            if (target.lat && target.lng) {
              setMapValue({
                lat: Number(target.lat),
                lng: Number(target.lng),
                displayName: target.alamat,
              });
            }
          }
        } else if (Array.isArray(data) && data.length === 0) {
          setValue("isDefault", true);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setLoading(false);
      }
    };
    checkAddresses();
  }, [editId, reset, setValue]);

  const handleMapChange = (val: MapPickerValue) => {
    setMapValue(val);

    if (val.displayName) {
      setValue("alamat", val.displayName);
    }

    const addr = val.address as any;
    if (addr) {
      // Kota/Kabupaten
      const kota =
        addr.city ||
        addr.state_district ||
        addr.municipality ||
        addr.county ||
        addr.town ||
        "";
      if (kota) setValue("kota", kota);

      // Kecamatan
      let kecamatan = addr.district || addr.city_district || "";
      if (!kecamatan && addr.county && addr.county !== kota)
        kecamatan = addr.county;
      if (!kecamatan) kecamatan = addr.suburb || "";
      if (kecamatan) setValue("kecamatan", kecamatan);

      // Kelurahan/Desa
      let kelurahan =
        addr.village ||
        addr.neighbourhood ||
        addr.hamlet ||
        addr.quarter ||
        addr.residential ||
        "";
      if (!kelurahan && addr.suburb && addr.suburb !== kecamatan)
        kelurahan = addr.suburb;
      if (kelurahan) setValue("kelurahan", kelurahan);

      // Provinsi
      const provinsi = addr.state || "";
      if (provinsi) setValue("provinsi", provinsi);

      // Kode Pos
      if (addr.postcode) {
        setValue("kodePos", addr.postcode.substring(0, 5));
      }
    }
  };

  const onFormSubmit = async (data: AlamatFormData) => {
    setActionLoading(true);
    setError("");

    if (!editId && !mapValue?.isPinMoved) {
      setError(
        "Silakan geser pin lokasi di peta atau gunakan fitur GPS/Pencarian untuk menentukan titik presisi alamat Anda terlebih dahulu.",
      );
      setActionLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      ...data,
      provinsi: data.provinsi || "",
      lat: mapValue?.lat,
      lng: mapValue?.lng,
    };

    try {
      // Validate city availability BEFORE saving
      const savedKota = payload.kota;
      if (savedKota) {
        try {
          const storesRes = await storesApi.getAll({ limit: 1000 });
          const storesRaw = storesRes?.data?.data || storesRes?.data;
          const stores: Store[] = Array.isArray(storesRaw) ? storesRaw : [];

          const normalizeString = (str: string) =>
            str
              .toLowerCase()
              .trim()
              .replace(/^kota\s+/i, "") // "Kota Bandung" → "bandung"
              .replace(/^kab\.?\s+/i, "") // "Kab. Bandung" → "bandung"
              .replace(/^kabupaten\s+/i, ""); // "Kabupaten Garut" → "garut"

          const savedKotaNorm = normalizeString(savedKota);

          const isKotaAvailable = stores.some((s: Store) => {
            // Cek kabupaten toko (normalize keduanya)
            if (normalizeString(s.kabupaten || "") === savedKotaNorm)
              return true;

            // Cek areaCakupanKota dengan substring matching
            if (s.areaCakupanKota && Array.isArray(s.areaCakupanKota)) {
              return s.areaCakupanKota.some((c) => {
                const cn = normalizeString(c);
                return (
                  cn === savedKotaNorm ||
                  cn.includes(savedKotaNorm) ||
                  savedKotaNorm.includes(cn)
                );
              });
            }

            return false;
          });

          if (!isKotaAvailable) {
            // Hanya tampilkan peringatan — JANGAN blokir penyimpanan
            // Konsumen boleh menyimpan alamat, tapi diperingatkan
            setCityWarning(
              `Area "${savedKota}" mungkin belum dijangkau semua toko. Anda tetap bisa menyimpan alamat ini.`,
            );
          } else {
            setCity(savedKota);
          }
        } catch (err) {
          console.error("Failed to validate city", err);
        }
      }

      if (editId) {
        await addressesApi.update(editId, payload);
      } else {
        await addressesApi.create(payload);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });

      const targetUrl = redirectTo
        ? decodeURIComponent(redirectTo)
        : "/profil/alamat";
      Modal.success({
        title: "Alamat Berhasil Disimpan",
        content: "Data alamat Anda telah berhasil disimpan.",
        centered: true,
        okText: "Oke",
        onOk: () => router.push(targetUrl),
      });
    } catch (err: any) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError?.response?.data?.message || "Gagal menyimpan alamat.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return {
    router,
    editId,
    loading,
    actionLoading,
    error,
    addressesLength,
    formData,
    setFormData: (fn: (prev: AlamatFormData) => AlamatFormData) => {
      // Compatibility wrapper for old setFormData usage if any
      const next = fn(formData);
      reset(next);
    },
    mapValue,
    handleMapChange,
    handleSubmit: handleSubmit(onFormSubmit),
    register,
    errors,
    setValue,
    cityWarning,
    clearCityWarning: () => setCityWarning(""),
    defaultCity,
  };
}
