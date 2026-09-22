/**
 * Ethiopian Phone Number Validation and Formatting Utility
 * Medhen Beza Hospital Web Platform
 *
 * Supported formats:
 * - Mobile: Ethio Telecom (9...) and Safaricom Ethiopia (7...)
 *   e.g. +251 91 123 4567, 0911234567, +251 71 234 5678, 0711234567
 * - Landline / Regional: Addis Ababa (11), Adama/Oromia (22), Dire Dawa (25), etc.
 *   e.g. +251 11 654 3210, 0116543210, +251 22 123 4567, 0221234567
 * - Emergency Shortcodes: 911, 907, 991, 997, 939 (allowed when allowShortCode is true)
 */

export interface ParsedEthiopianPhone {
  isValid: boolean;
  raw: string;
  e164: string;           // e.g. "+251911234567" or "911"
  formatted: string;      // e.g. "+251 91 123 4567" or "+251 11 654 3210" or "911"
  nationalFormat: string; // e.g. "0911 234 567" or "011 654 3210"
  type: "mobile" | "landline" | "shortcode" | "unknown";
  operator?: "Ethio Telecom" | "Safaricom" | "Landline" | "Emergency Service";
  error?: string;
}

/**
 * Clean all non-digit characters except an initial '+'
 */
export function sanitizePhoneDigits(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Validates and parses an Ethiopian phone number.
 */
export function parseEthiopianPhone(
  input: string,
  options: { allowShortCode?: boolean } = {}
): ParsedEthiopianPhone {
  const raw = (input || "").trim();

  if (!raw) {
    return {
      isValid: false,
      raw: "",
      e164: "",
      formatted: "",
      nationalFormat: "",
      type: "unknown",
      error: "Phone number is required.",
    };
  }

  // Check for emergency short codes (e.g. 911, 907, 991, 997, 939, 3-4 digits)
  const isShortCode = /^\d{3,4}$/.test(raw);
  if (isShortCode) {
    if (options.allowShortCode) {
      return {
        isValid: true,
        raw,
        e164: raw,
        formatted: raw,
        nationalFormat: raw,
        type: "shortcode",
        operator: "Emergency Service",
      };
    } else {
      return {
        isValid: false,
        raw,
        e164: "",
        formatted: "",
        nationalFormat: "",
        type: "shortcode",
        error: "Short codes are not allowed for this field. Please provide a full telephone number.",
      };
    }
  }

  // Strip non-digits
  const digitsOnly = raw.replace(/\D/g, "");

  let nationalDigits = "";

  if (raw.startsWith("+251")) {
    nationalDigits = digitsOnly.slice(3); // after 251
  } else if (raw.startsWith("00251")) {
    nationalDigits = digitsOnly.slice(5);
  } else if (digitsOnly.startsWith("251") && digitsOnly.length >= 11) {
    nationalDigits = digitsOnly.slice(3);
  } else if (digitsOnly.startsWith("0") && digitsOnly.length >= 10) {
    nationalDigits = digitsOnly.slice(1);
  } else if (digitsOnly.length === 9) {
    // User typed 9-digit national number directly (e.g. 911234567 or 116543210)
    nationalDigits = digitsOnly;
  } else {
    return {
      isValid: false,
      raw,
      e164: "",
      formatted: "",
      nationalFormat: "",
      type: "unknown",
      error: "Please enter a valid Ethiopian phone number (e.g. +251 91 123 4567 or 0911 234 567).",
    };
  }

  // If there's an extra leading zero inside national digits, strip it
  if (nationalDigits.startsWith("0")) {
    nationalDigits = nationalDigits.slice(1);
  }

  // An Ethiopian national phone number must have exactly 9 digits
  if (nationalDigits.length !== 9) {
    return {
      isValid: false,
      raw,
      e164: "",
      formatted: "",
      nationalFormat: "",
      type: "unknown",
      error: `Invalid number of digits (${nationalDigits.length} digits found). Ethiopian numbers require 9 digits.`,
    };
  }

  const firstDigit = nationalDigits.charAt(0);
  const prefix2 = nationalDigits.slice(0, 2);

  // Mobile numbers:
  // Starts with '9' (Ethio Telecom) or '7' (Safaricom)
  if (firstDigit === "9" || firstDigit === "7") {
    const operator = firstDigit === "9" ? "Ethio Telecom" : "Safaricom";
    // Format: +251 XX XXX XXXX
    const formatted = `+251 ${nationalDigits.slice(0, 2)} ${nationalDigits.slice(2, 5)} ${nationalDigits.slice(5)}`;
    const nationalFormat = `0${nationalDigits.slice(0, 3)} ${nationalDigits.slice(3, 6)} ${nationalDigits.slice(6)}`;
    const e164 = `+251${nationalDigits}`;

    return {
      isValid: true,
      raw,
      e164,
      formatted,
      nationalFormat,
      type: "mobile",
      operator,
    };
  }

  // Landline / Regional numbers:
  // Area codes: 11 (Addis Ababa), 22 (Adama/Oromia), 25 (Dire Dawa), 33 (Dessie), 34 (Mekelle), 46 (Hawassa), 47 (Jimma), 58 (Bahir Dar)
  // Generally starts with 1, 2, 3, 4, 5
  if (/^[1-5]/.test(firstDigit)) {
    // Format: +251 XX XXX XXXX
    const formatted = `+251 ${nationalDigits.slice(0, 2)} ${nationalDigits.slice(2, 5)} ${nationalDigits.slice(5)}`;
    const nationalFormat = `0${nationalDigits.slice(0, 2)} ${nationalDigits.slice(2, 5)} ${nationalDigits.slice(5)}`;
    const e164 = `+251${nationalDigits}`;

    return {
      isValid: true,
      raw,
      e164,
      formatted,
      nationalFormat,
      type: "landline",
      operator: "Landline",
    };
  }

  return {
    isValid: false,
    raw,
    e164: "",
    formatted: "",
    nationalFormat: "",
    type: "unknown",
    error: `Invalid operator or area code '${prefix2}'. Ethiopian numbers must start with 9, 7, or valid landline codes (e.g. 11, 22).`,
  };
}

/**
 * Returns true if the phone string is a valid Ethiopian phone number.
 */
export function isValidEthiopianPhone(
  input: string,
  allowShortCode = false
): boolean {
  if (!input) return false;
  return parseEthiopianPhone(input, { allowShortCode }).isValid;
}

/**
 * Normalizes input to standard +251 XX XXX XXXX format for storage or display.
 * Returns the original input if it cannot be parsed.
 */
export function normalizeEthiopianPhone(
  input: string,
  allowShortCode = false
): string {
  if (!input) return "";
  const parsed = parseEthiopianPhone(input, { allowShortCode });
  return parsed.isValid ? parsed.formatted : input.trim();
}

/**
 * Formats a phone number dynamically as the user types in an input field.
 * Handles:
 * - "+251 ..." -> "+251 XX XXX XXXX"
 * - "09..." / "07..." -> "09XX XXX XXX"
 * - Shortcodes -> "911"
 */
export function formatEthiopianPhoneLive(input: string): string {
  if (!input) return "";

  const trimmed = input.trim();

  // If short code, don't format with spaces
  if (/^\d{1,4}$/.test(trimmed)) {
    return trimmed;
  }

  const isPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (isPlus || digits.startsWith("251")) {
    // International format
    let national = digits;
    if (national.startsWith("251")) {
      national = national.slice(3);
    }

    if (national.length === 0) return "+251 ";
    if (national.length <= 2) return `+251 ${national}`;
    if (national.length <= 5) return `+251 ${national.slice(0, 2)} ${national.slice(2)}`;
    return `+251 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5, 9)}`;
  } else if (digits.startsWith("0")) {
    // Local national format
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  } else if (digits.length > 0) {
    // User started with 9... or 7... or 11...
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }

  return input;
}
