// =============================================================
// EMPTY STATE COMPONENT — Ecommerce App
// =============================================================
// Usage:
//   <EmptyState
//     illustration="/empty-cart.svg"
//     title="Keranjang masih kosong"
//     description="Deskripsi singkat"
//     actionLabel="Mulai Belanja"
//     onAction={() => router.push('/katalog')}
//   />
// =============================================================

import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  /** Path to SVG/image in /public, e.g. '/empty-cart.svg' */
  illustration?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-2 px-6 ${className}`}
    >
      {/* Icon or Illustration */}
      {icon ? (
        <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-500">
          {icon}
        </div>
      ) : illustration ? (
        <div className="relative w-80 h-80 -mt-12 -mb-4 select-none">
          <Image
            src={illustration}
            alt={title}
            fill
            className="object-contain drop-shadow-sm"
            priority
          />
        </div>
      ) : null}

      {/* Text */}
      <h2 className="font-display font-semibold text-gray-900 text-xl mb-2 leading-tight">
        {title}
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col gap-3 w-full max-w-xs mt-12">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="w-full border border-emerald-600 text-emerald-600 font-semibold py-3.5 rounded-2xl hover:bg-emerald-50 active:scale-[0.98] transition-all"
            >
              {actionLabel}
            </button>
          )}
          {secondaryLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all text-sm"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
