import { useEffect, useState } from "react";
import { DEFAULT_CURRENCY } from "@/lib/app-session";
import {
  CURRENCY_CHANGE_EVENT,
  currencySymbol,
  formatMoney,
  getPreferredCurrency,
} from "@/lib/currency";

export function usePreferredCurrency() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    setCurrency(getPreferredCurrency());
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ currency?: string }>).detail;
      setCurrency(detail?.currency || getPreferredCurrency());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "vp_currency") setCurrency(getPreferredCurrency());
    };
    window.addEventListener(CURRENCY_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CURRENCY_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    currency,
    symbol: currencySymbol(currency),
    format: (amount: number, opts?: { fromUsd?: boolean; compact?: boolean }) =>
      formatMoney(amount, { currency, ...opts }),
  };
}
