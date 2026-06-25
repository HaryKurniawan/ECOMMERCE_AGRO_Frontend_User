import {
  Landmark,
  Building2,
  Building,
  SmartphoneNfc,
  Wallet,
  Coins,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  label: string;
  icon: LucideIcon;
  sublabel: string;
  iconColor?: string;
}

// ID method TIDAK harus sesuai dengan Xendit — Xendit Invoice akan menampilkan
// semua metode yang tersedia dalam satu link. ID ini hanya untuk keperluan
// pelacakan preferensi pengguna di sistem backend kita.
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "BCA_VA",
    label: "BCA Virtual Account",
    icon: Landmark,
    sublabel: "Transfer Bank",
    iconColor: "text-blue-600",
  },
  {
    id: "BRI_VA",
    label: "BRI Virtual Account",
    icon: Building2,
    sublabel: "Transfer Bank",
    iconColor: "text-blue-800",
  },
  {
    id: "MANDIRI_VA",
    label: "Mandiri Virtual Account",
    icon: Building,
    sublabel: "Transfer Bank",
    iconColor: "text-yellow-600",
  },
  {
    id: "QRIS",
    label: "QRIS",
    icon: SmartphoneNfc,
    sublabel: "E-Wallet / QR Code",
    iconColor: "text-primary-600",
  },
  {
    id: "OVO",
    label: "OVO",
    icon: Wallet,
    sublabel: "E-Wallet",
    iconColor: "text-purple-600",
  },
  {
    id: "DANA",
    label: "DANA",
    icon: Coins,
    sublabel: "E-Wallet",
    iconColor: "text-blue-400",
  },
  {
    id: "GOPAY",
    label: "GoPay",
    icon: ShoppingBag,
    sublabel: "E-Wallet",
    iconColor: "text-green-500",
  },
  {
    id: "SHOPEEPAY",
    label: "ShopeePay",
    icon: ShoppingBag,
    sublabel: "E-Wallet",
    iconColor: "text-orange-500",
  },
];
