"use client";

import React, { useState, useEffect } from "react";
import { Phone, Check, AlertCircle } from "lucide-react";
import {
  parseEthiopianPhone,
  formatEthiopianPhoneLive,
} from "@/lib/validation/phone";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  allowShortCode?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  allowShortCode = false,
  label,
  helperText,
  error: externalError,
  required = false,
  className,
  disabled,
  placeholder = "+251 91 123 4567 or 0911234567",
  ...props
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // Validate on value changes
  useEffect(() => {
    if (!value && !required) {
      setInternalError(null);
      return;
    }

    if (!value && required && touched) {
      setInternalError("Phone number is required.");
      return;
    }

    if (value) {
      const parsed = parseEthiopianPhone(value, { allowShortCode });
      if (!parsed.isValid && touched) {
        setInternalError(
          parsed.error ||
            "Please enter a valid Ethiopian phone number (e.g. +251 91 123 4567 or 0911 234 567)."
        );
      } else {
        setInternalError(null);
      }
    }
  }, [value, required, touched, allowShortCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatEthiopianPhoneLive(rawVal);
    const parsed = parseEthiopianPhone(formatted, { allowShortCode });
    onChange(formatted, parsed.isValid);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (props.onBlur) props.onBlur(e);
  };

  const displayError = externalError || internalError;
  const isCurrentlyValid = value ? parseEthiopianPhone(value, { allowShortCode }).isValid : false;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-text flex items-center justify-between">
          <span>
            {label} {required && <span className="text-emergency">*</span>}
          </span>
          {isCurrentlyValid && (
            <span className="text-[11px] font-normal text-emerald-600 flex items-center gap-0.5">
              <Check className="h-3 w-3" /> Valid Ethiopian Number
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Country Badge */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-surface border border-border/80 text-[11px] font-semibold text-text-muted select-none pointer-events-none">
          <span className="text-xs">🇪🇹</span>
          <span className="text-[10px] text-text-light font-mono">+251</span>
        </div>

        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={Boolean(displayError)}
          className={cn(
            "w-full rounded-md border bg-background pl-20 pr-8 py-2 text-xs font-mono text-text transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            displayError
              ? "border-emergency text-emergency focus:ring-emergency/30"
              : isCurrentlyValid
              ? "border-emerald-500/60 focus:ring-emerald-500/30"
              : "border-border",
            disabled && "cursor-not-allowed opacity-50 bg-background/50",
            className
          )}
          {...props}
        />

        {/* Status Indicator Icon */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {displayError ? (
            <AlertCircle className="h-4 w-4 text-emergency" />
          ) : isCurrentlyValid ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Phone className="h-3.5 w-3.5 text-text-light" />
          )}
        </div>
      </div>

      {/* Error or Helper Message */}
      {displayError ? (
        <p className="text-[11px] text-emergency font-medium flex items-center gap-1 mt-1">
          {displayError}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-text-light mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
