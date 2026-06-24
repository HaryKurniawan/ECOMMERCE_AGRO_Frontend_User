import {
  Landmark,
  Building2,
  Building,
  SmartphoneNfc,
  Wallet,
  Coins,
  type LucideIcon,
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  label: string;
  icon: LucideIcon;
  sublabel: string;
  iconColor?: string;
}

// ID method harus sesuai dengan yang diterima backend (metodeBayar)
// Midtrans Snap akan menangani routing ke virtual account/e-wallet/QRIS yang sesuai.
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
];
