export interface CookieConsent {
  essential: boolean;
  preferences: boolean;
}

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") {
    return {
      essential: true,
      preferences: false
    };
  }

  try {
    const raw = localStorage.getItem("cookie-consent");

    if (!raw) {
      return {
        essential: true,
        preferences: false
      };
    }

    const parsed = JSON.parse(raw);

    return {
      essential: true,
      preferences: parsed.preferences === true
    };
  } catch {
    return {
      essential: true,
      preferences: false
    };
  }
}

export function canUsePreferenceStorage(): boolean {
  return getCookieConsent().preferences === true;
}

export function canSaveHistory(historyEnabled: boolean): boolean {
  return canUsePreferenceStorage() && historyEnabled;
}

export function clearPreferenceStorage(): void {
  if (typeof window === "undefined") return;

  const preferenceKeys = [
    "conversion_history",
    "quantity_history",
    "saved_currency_code",
    "history_enabled",
    "aesthetic_favorites",
    "bubble_favorites",
    "saved_number_format",
    "saved_cheque_prefs"
  ];

  preferenceKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch {
      // safe fallback if storage is restricted
    }
  });
}
