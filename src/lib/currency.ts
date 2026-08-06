import { DEFAULT_CURRENCY } from "@/lib/app-session";

/** Approximate mid-market rates vs USD for display conversion. */
const RATES_FROM_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  INR: 83,
  AED: 3.67,
  CNY: 7.25,
  BRL: 5.1,
  AUD: 1.53,
  CAD: 1.36,
};

const SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  AED: "د.إ",
  CNY: "¥",
  BRL: "R$",
  AUD: "A$",
  CAD: "C$",
};

export const CURRENCY_CHANGE_EVENT = "asvior:currency-change";

export function getPreferredCurrency(): string {
  if (typeof localStorage === "undefined") return DEFAULT_CURRENCY;
  try {
    return localStorage.getItem("vp_currency") || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function currencySymbol(code = getPreferredCurrency()): string {
  return SYMBOLS[code] ?? `${code} `;
}

export function convertFromUsd(amountUsd: number, currency = getPreferredCurrency()): number {
  const rate = RATES_FROM_USD[currency] ?? 1;
  return amountUsd * rate;
}

export function formatMoney(
  amount: number,
  options?: { currency?: string; fromUsd?: boolean; compact?: boolean },
): string {
  const currency = options?.currency ?? getPreferredCurrency();
  const value = options?.fromUsd ? convertFromUsd(amount, currency) : amount;
  const fractionDigits = currency === "JPY" ? 0 : options?.compact ? 0 : 2;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return `${currencySymbol(currency)}${value.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  }
}

export function notifyCurrencyChanged(currency: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: { currency } }));
}
