import React from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddressPromptModalProps {
  isOpen: boolean;
  city: string;
  onClose: () => void;
}

const AddressPromptModal: React.FC<AddressPromptModalProps> = ({
  isOpen,
  city,
  onClose,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm relative animate-slide-up bg-white rounded-[2rem] p-6 shadow-2xl">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <MapPin size={32} />
        </div>

        <h2 className="font-display text-xl font-bold text-gray-900 text-center mb-1">
          Lengkapi Alamatmu Yuk!
        </h2>
        <p className="text-[13px] text-gray-500 text-center mb-6 leading-relaxed px-2">
          Biar belanjamu di <strong>{city}</strong> makin lancar, isi alamat
          pengiriman sekarang, yuk!
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all text-[13px]"
          >
            Nanti
          </button>
          <button
            onClick={() => {
              onClose();
              router.push(
                `/profil/alamat/form?city=${encodeURIComponent(city)}`,
              );
            }}
            className="flex-1 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 text-[13px]"
          >
            Isi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPromptModal;
