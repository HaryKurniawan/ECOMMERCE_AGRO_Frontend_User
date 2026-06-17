"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface BulkOrderProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const BulkOrderProgressIndicator: React.FC<
  BulkOrderProgressIndicatorProps
> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((stepLabel, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isPast = currentStep > stepNum;
        return (
          <React.Fragment key={stepLabel}>
            <div className="flex items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${isActive || isPast ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {isPast ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : (
                  stepNum
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px transition-all duration-300 ${isPast ? "bg-primary-600" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
