import React, { useState, useEffect, useRef } from "react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { formatCountryFinancialAmount } from "../utils/countryFinancialFormats";
import { 
  CURRENCIES, 
  CURRENCY_MAP, 
  DEFAULT_CURRENCY, 
  type CurrencyConfig 
} from "../data/currencies";
import { canUsePreferenceStorage } from "../utils/storageConsent";
import { 
  Copy, 
  Check, 
  Receipt, 
  Calendar, 
  User, 
  DollarSign, 
  FileSpreadsheet, 
  Signature, 
  Volume2, 
  Trash2, 
  Star, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Landmark, 
  ListRestart, 
  Share2,
  History
} from "lucide-react";

interface QuantityHistoryItem {
  id: string;
  amount: string;
  result: string;
  currencyCode: string;
  timestamp: string;
  isFavorite?: boolean;
}

export default function QuantityConverter({ 
  initialAmount,
  initialCurrency,
  initialNumberFormatStyle,
  initialCity
}: { 
  initialAmount?: string;
  initialCurrency?: string;
  initialNumberFormatStyle?: 'LA' | 'ES';
  initialCity?: string;
}) {
  const [amount, setAmount] = useState(initialAmount || "1540.50");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(() => {
    if (initialCurrency && CURRENCY_MAP[initialCurrency]) {
      return CURRENCY_MAP[initialCurrency];
    }
    try {
      if (canUsePreferenceStorage()) {
        const savedCode = localStorage.getItem("saved_currency_code");
        if (savedCode && CURRENCY_MAP[savedCode]) {
          return CURRENCY_MAP[savedCode];
        }
      }
    } catch {}
    return DEFAULT_CURRENCY;
  });

  // Sync with incoming prop or query parameter
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    } else {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const n = urlParams.get("n") || urlParams.get("amount") || urlParams.get("numero");
        if (n) {
          setAmount(n);
        }
      } catch {}
    }
  }, [initialAmount]);

  const hasUserEdited = useRef(false);

  // Sync amount state with title and URL
  useEffect(() => {
    if (!hasUserEdited.current) {
      return;
    }
    const rawVal = amount.trim();
    if (typeof document !== "undefined" && !initialCurrency) {
      if (rawVal && !isNaN(Number(rawVal.replace(/[^0-9.-]/g, '')))) {
        document.title = `¿Cómo se escribe ${rawVal} en letras? | Cantidad con Letra`;
      } else {
        document.title = "Conversor de Cantidad con Letra | Escribir Números en Palabras";
      }
    }

    const timer = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (rawVal && rawVal !== "-") {
          url.searchParams.set("n", rawVal);
        } else {
          url.searchParams.delete("n");
        }
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch {}
    }, 400);
    return () => clearTimeout(timer);
  }, [amount, initialCurrency]);

  const [isFinancialFormat, setIsFinancialFormat] = useState(true);
  const [recipient, setRecipient] = useState("Juan Pérez Maldonado");
  const [city, setCity] = useState(initialCity || "Ciudad");
  const [chequeNumber, setChequeNumber] = useState("10024921");
  const [chequeBank, setChequeBank] = useState(selectedCurrency.defaultBank || "NOMBRE DEL BANCO");
  const [signatureStyle, setSignatureStyle] = useState<'elegant' | 'modern' | 'none'>('elegant');
  
  // Sync cheque bank based on selected currency preset
  useEffect(() => {
    if (selectedCurrency.defaultBank) {
      setChequeBank(selectedCurrency.defaultBank);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (initialCity) {
      setCity(initialCity);
    }
  }, [initialCity]);
  
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  
  // Advanced controls
  const [numberFormatStyle, setNumberFormatStyle] = useState<'LA' | 'ES'>(initialNumberFormatStyle || 'LA');

  useEffect(() => {
    if (initialNumberFormatStyle) {
      setNumberFormatStyle(initialNumberFormatStyle);
    }
  }, [initialNumberFormatStyle]);
  const [currencyRegion, setCurrencyRegion] = useState<"all" | "north-central" | "south" | "europe">("all");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // History and privacy consent settings
  const [historyEnabled, setHistoryEnabled] = useState<boolean>(true);
  const [preferenceStorageAllowed, setPreferenceStorageAllowed] = useState<boolean>(() => canUsePreferenceStorage());
  const [history, setHistory] = useState<QuantityHistoryItem[]>(() => {
    try {
      if (canUsePreferenceStorage()) {
        const saved = localStorage.getItem("quantity_history");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Set current date in Spanish format on mount
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('es-ES', options));
    
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
      const allowed = canUsePreferenceStorage();
      setPreferenceStorageAllowed(allowed);
      if (allowed) {
        const storedHistoryEnabled = localStorage.getItem("history_enabled");
        if (storedHistoryEnabled !== null) {
          setHistoryEnabled(storedHistoryEnabled === "true");
        }
        try {
          const saved = localStorage.getItem("quantity_history");
          if (saved) {
            setHistory(JSON.parse(saved));
          }
        } catch {}
      } else {
        setHistory([]);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Listen to cookie consent updates
  useEffect(() => {
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const allowed = customEvent.detail?.preferences === true;
      setPreferenceStorageAllowed(allowed);

      if (!allowed) {
        setHistory([]);
      } else {
        try {
          const saved = localStorage.getItem("quantity_history");
          if (saved) {
            setHistory(JSON.parse(saved));
          }
          const storedHistoryEnabled = localStorage.getItem("history_enabled");
          if (storedHistoryEnabled !== null) {
            setHistoryEnabled(storedHistoryEnabled === "true");
          }
          const savedCode = localStorage.getItem("saved_currency_code");
          if (savedCode && CURRENCY_MAP[savedCode]) {
            setSelectedCurrency(CURRENCY_MAP[savedCode]);
          }
        } catch {}
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (canUsePreferenceStorage() && historyEnabled) {
      try {
        localStorage.setItem("quantity_history", JSON.stringify(history));
      } catch {}
    }
  }, [history, historyEnabled]);

  const toggleHistoryEnabled = () => {
    if (!canUsePreferenceStorage()) {
      showToast("Activa las preferencias de privacidad para guardar historial");
      window.dispatchEvent(new Event("open-cookie-settings"));
      return;
    }
    const next = !historyEnabled;
    setHistoryEnabled(next);
    try {
      localStorage.setItem("history_enabled", String(next));
    } catch {}
    showToast(next ? "Guardado de historial activado" : "Guardado de historial desactivado");
  };

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Filter currencies by region
  const filteredCurrencies = CURRENCIES.filter(curr => {
    if (currencyRegion === "all") return true;
    return curr.region === currencyRegion;
  });

  // Parse input according to numberFormatStyle
  const parseAmountValue = (val: string): string => {
    let clean = val.trim();
    if (!clean) return "";
    if (numberFormatStyle === 'LA') {
      clean = clean.replace(/,/g, '');
    } else {
      clean = clean.replace(/\./g, '').replace(/,/g, '.');
    }
    return clean;
  };

  // Live conversion
  useEffect(() => {
    const cleanVal = parseAmountValue(amount);

    if (!cleanVal) {
      setResult("");
      return;
    }

    if (isNaN(Number(cleanVal)) && cleanVal !== "-") {
      setResult("Entrada numérica no válida");
      return;
    }

    try {
      const isNeg = cleanVal.startsWith("-");
      const posVal = isNeg ? cleanVal.substring(1) : cleanVal;

      let conv = "";
      if (isFinancialFormat && ['MXN', 'COP', 'PEN', 'ARS', 'EUR'].includes(selectedCurrency.code)) {
        conv = formatCountryFinancialAmount(posVal, selectedCurrency.code, {
          uppercase: true,
          formatStyle: numberFormatStyle
        });
        if (isNeg && conv !== "CERO") {
          conv = `MENOS ${conv}`;
        }
      } else {
        conv = convertNumberToLetters(posVal, {
          currency: selectedCurrency,
          formatFinancial: isFinancialFormat,
          decimalMode: isFinancialFormat ? 'fraction' : 'words'
        });

        if (isNeg && conv !== "cero") {
          conv = `MENOS ${conv}`;
        }
        conv = conv.toUpperCase();
      }

      setResult(conv);

      // Save to history debounce if valid
      if (canUsePreferenceStorage() && historyEnabled && cleanVal && !isNaN(Number(cleanVal)) && cleanVal !== "0") {
        const timer = setTimeout(() => {
          setHistory(prev => {
            if (prev.length > 0 && prev[0].amount === cleanVal && prev[0].currencyCode === selectedCurrency.code) {
              return prev;
            }
            const newItem: QuantityHistoryItem = {
              id: Math.random().toString(36).substring(2, 9),
              amount: cleanVal,
              result: conv.toUpperCase(),
              currencyCode: selectedCurrency.code,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            return [newItem, ...prev].slice(0, 15);
          });
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setResult("Error en el formato del número");
    }
  }, [amount, selectedCurrency, isFinancialFormat, numberFormatStyle, historyEnabled]);

  const handleCopy = () => {
    if (!result || result.startsWith("Entrada no") || result.startsWith("Error")) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const rawVal = amount.trim();
    if (!rawVal) return;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("n", rawVal);
    navigator.clipboard.writeText(url.toString());
    showToast("Enlace de cantidad con letra copiado");
  };

  const handleSpeech = () => {
    if (!result || result.startsWith("Entrada no")) return;
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(result.toLowerCase());
      utterance.lang = 'es-ES';
      utterance.rate = 0.92;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } else {
      showToast("La síntesis de voz no está disponible.");
    }
  };

  const handleClearHistory = () => {
    const hasFavorites = history.some(item => item.isFavorite);
    if (hasFavorites) {
      setHistory(prev => {
        const remaining = prev.filter(item => item.isFavorite);
        if (canUsePreferenceStorage()) {
          try {
            localStorage.setItem("quantity_history", JSON.stringify(remaining));
          } catch {}
        }
        showToast("Historial borrado, favoritos conservados");
        return remaining;
      });
    } else {
      setHistory([]);
      try {
        localStorage.removeItem("quantity_history");
      } catch {}
      showToast("Historial borrado");
    }
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const remaining = prev.filter(item => item.id !== id);
      if (canUsePreferenceStorage()) {
        try {
          localStorage.setItem("quantity_history", JSON.stringify(remaining));
        } catch {}
      }
      return remaining;
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canUsePreferenceStorage()) {
      showToast("Activa las preferencias para guardar favoritos");
      window.dispatchEvent(new Event("open-cookie-settings"));
      return;
    }
    setHistory(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const nextFav = !item.isFavorite;
          showToast(nextFav ? "Guardado en favoritos" : "Quitado de favoritos");
          return { ...item, isFavorite: nextFav };
        }
        return item;
      });
      if (canUsePreferenceStorage()) {
        try {
          localStorage.setItem("quantity_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleCurrencyChange = (curr: CurrencyConfig) => {
    setSelectedCurrency(curr);
    if (canUsePreferenceStorage()) {
      try {
        localStorage.setItem("saved_currency_code", curr.code);
      } catch {}
    }
    showToast(`Moneda seleccionada: ${curr.name}`);
  };

  return (
    <div className="font-sans text-left space-y-8">
      {/* Toast popup */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-gray-800 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main interactive panel */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-3xl" />

        <div className="space-y-6">
          {/* Amount input & regional currency selectors */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="amount-input" className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Monto o Importe a Convertir
              </label>

              <div className="flex items-center space-x-1.5 bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setNumberFormatStyle('LA')}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    numberFormatStyle === 'LA' 
                      ? "bg-white text-emerald-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con coma y decimales con punto (1,540.50)"
                >
                  1,540.50
                </button>
                <button
                  type="button"
                  onClick={() => setNumberFormatStyle('ES')}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    numberFormatStyle === 'ES' 
                      ? "bg-white text-emerald-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con punto y decimales con coma (1.540,50)"
                >
                  1.540,50
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono font-bold text-xl text-gray-400">
                {selectedCurrency.symbol}
              </span>
              <input
                ref={inputRef}
                type="text"
                id="amount-input"
                value={amount}
                onChange={(e) => {
                  hasUserEdited.current = true;
                  setAmount(e.target.value);
                }}
                placeholder={numberFormatStyle === 'LA' ? "Ej: 1,540.50" : "Ej: 1.540,50"}
                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-gray-900 text-xl sm:text-2xl font-mono font-bold tracking-tight rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all pl-12 pr-28 py-4 outline-hidden placeholder:text-gray-350"
                autoComplete="off"
              />
              <div className="absolute right-3 flex items-center space-x-1">
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount("")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                    title="Borrar entrada"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const sample = (Math.random() * 85000 + 100).toFixed(2);
                    setAmount(sample);
                    showToast(`Ejemplo generado: $${sample}`);
                  }}
                  className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                  title="Generar monto de ejemplo"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick amount pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono mr-1">Rápidos:</span>
              {[
                { label: "$100", val: "100.00" },
                { label: "$500", val: "500.00" },
                { label: "$1,000", val: "1000.00" },
                { label: "$2,500.50", val: "2500.50" },
                { label: "$10,000", val: "10000.00" },
                { label: "$50,000", val: "50000.00" },
                { label: "$1,000,000", val: "1000000.00" },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAmount(pill.val)}
                  className="text-[10.5px] font-mono font-semibold bg-gray-100/70 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 px-2 py-0.5 rounded-md transition-all cursor-pointer border border-transparent hover:border-emerald-200"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Currency Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                Selecciona la Moneda Oficial
              </span>
              <div className="flex items-center gap-1 bg-gray-100/80 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setCurrencyRegion("all")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currencyRegion === "all" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500"}`}
                >
                  Todas ({CURRENCIES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyRegion("north-central")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currencyRegion === "north-central" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500"}`}
                >
                  Norte / Centroamérica
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyRegion("south")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currencyRegion === "south" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500"}`}
                >
                  Sudamérica
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyRegion("europe")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currencyRegion === "europe" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500"}`}
                >
                  Europa
                </button>
              </div>
            </div>

            {/* Currency Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2">
              {filteredCurrencies.map((curr) => {
                const isSelected = selectedCurrency.code === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleCurrencyChange(curr)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20"
                        : "bg-white border-gray-200/80 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-base leading-none">{curr.flag}</span>
                      <div className="truncate">
                        <span className={`block font-mono text-xs font-bold ${isSelected ? "text-emerald-900" : "text-gray-800"}`}>
                          {curr.code}
                        </span>
                        <span className="text-[10px] text-gray-500 block truncate font-sans">
                          {curr.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cent format option */}
          <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-700 block">Formato Oficial de Centavos</span>
              <p className="text-[11px] text-gray-500 leading-tight">
                {isFinancialFormat 
                  ? "Estándar bancario y mercantil: '... pesos 50/100 M.N.' (Recomendado para cheques y facturas)" 
                  : "Estándar en palabras continuas: '... pesos con cincuenta centavos'"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFinancialFormat(true)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  isFinancialFormat ? "bg-white text-emerald-700 shadow-xs border border-emerald-200" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Fraccionario (XX/100)
              </button>
              <button
                type="button"
                onClick={() => setIsFinancialFormat(false)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  !isFinancialFormat ? "bg-white text-emerald-700 shadow-xs border border-emerald-200" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                En Letras
              </button>
            </div>
          </div>

          {/* Main Converted Output Box */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Cantidad con Letra Formal Generada
              </span>
              <div className="flex items-center gap-1">
                {result && (
                  <>
                    <button
                      type="button"
                      onClick={handleSpeech}
                      disabled={speaking}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        speaking 
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700 animate-pulse" 
                          : "bg-white border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300"
                      }`}
                      title="Escuchar locución"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 rounded-lg transition-all cursor-pointer"
                      title="Copiar enlace"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={`w-full min-h-[110px] rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              result
                ? "bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border-emerald-300 shadow-sm"
                : "bg-gray-50/60 border-dashed border-gray-200"
            }`}>
              <div className="font-sans text-base sm:text-lg font-bold text-gray-900 break-words leading-relaxed select-all">
                {result ? `( ${result} )` : (
                  <span className="text-gray-400 font-normal italic text-sm">
                    Ingresa una cifra arriba para obtener la cantidad con letra certificada...
                  </span>
                )}
              </div>

              {result && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-emerald-100/60">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Validado para Documentos y Cheques</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      copied
                        ? "bg-emerald-700 text-white shadow-emerald-200"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Cantidad</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Cheque Template Simulation */}
          <div className="bg-gradient-to-r from-amber-50/60 via-yellow-50/40 to-amber-50/60 rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-md shadow-amber-900/5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-700" />
                <span className="font-mono text-xs font-bold tracking-widest text-amber-900 uppercase">
                  {chequeBank}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-800/80 bg-amber-100/60 px-2 py-0.5 rounded">
                CHEQUE NO. {chequeNumber}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-900">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-semibold">{city}, a</span>
                  <span className="font-serif italic font-bold">{currentDate}</span>
                </div>

                <div className="flex items-center gap-2 bg-amber-100/80 border border-amber-300 rounded-xl px-3 py-1.5 self-start sm:self-auto">
                  <span className="font-mono font-bold text-xs text-amber-800">{selectedCurrency.symbol}</span>
                  <span className="font-mono font-black text-base text-amber-950">
                    {amount ? `${amount} ${selectedCurrency.financialSuffix || ''}` : "0.00"}
                  </span>
                </div>
              </div>

              <div className="border-b border-amber-200 pb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase font-sans shrink-0 flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-700" />
                    Páguese a la orden de:
                  </span>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-transparent font-serif font-bold text-xs sm:text-sm text-amber-950 uppercase outline-hidden border-b border-dashed border-amber-300 focus:border-amber-600 px-1"
                  />
                </div>
              </div>

              <div className="border-b-2 border-amber-300 pb-2">
                <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 font-sans">
                  La cantidad de (con letra):
                </span>
                <div className="font-serif italic font-bold text-xs sm:text-sm text-amber-950 leading-snug tracking-wide break-words py-1 bg-amber-100/30 px-2 rounded-md">
                  {result ? `*** ${result} ***` : "*** CERO PESOS 00/100 M.N. ***"}
                </div>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div className="font-mono text-[9px] text-amber-800/70 tracking-widest">
                  ⑈01234567⑈ 890123456789⑈ {chequeNumber}
                </div>
                <div className="text-center">
                  <div className="font-serif italic text-lg text-amber-900 leading-none">
                    Firma del librador
                  </div>
                  <div className="w-32 border-t border-amber-400 mt-1">
                    <span className="text-[8px] font-sans text-amber-800 block">Firma autorizada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History drawer */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" />
                <h3 className="font-sans font-semibold text-sm tracking-tight text-gray-800">
                  Historial de Conversiones
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleHistoryEnabled}
                  className="text-[11px] text-gray-500 hover:text-gray-700 font-sans cursor-pointer underline"
                  title={historyEnabled ? "Desactivar guardado de historial local" : "Activar guardado de historial local"}
                >
                  {historyEnabled ? "Desactivar" : "Activar"}
                </button>
                {history.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleClearHistory}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-sans cursor-pointer"
                    title="Borrar historial"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {!preferenceStorageAllowed ? (
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-dashed border-gray-200 text-center space-y-2">
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  El almacenamiento de preferencias está desactivado. Para guardar tu historial de conversiones en este dispositivo, activa el almacenamiento de preferencias en la configuración de privacidad.
                </p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer inline-block"
                >
                  Configuración de privacidad
                </button>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setAmount(item.amount);
                      if (CURRENCY_MAP[item.currencyCode]) {
                        setSelectedCurrency(CURRENCY_MAP[item.currencyCode]);
                      }
                      showToast(`Cargado del historial: ${item.amount}`);
                    }}
                    className="group bg-gray-50/80 hover:bg-emerald-50/40 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5 overflow-hidden text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-800">${item.amount}</span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                          {item.currencyCode}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate max-w-sm sm:max-w-md">{item.result}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          item.isFavorite 
                            ? "text-amber-500 hover:bg-amber-50" 
                            : "text-gray-300 hover:text-amber-500 hover:bg-gray-100"
                        }`}
                        title={item.isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-400" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Eliminar del historial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                {historyEnabled 
                  ? "Las cantidades que conviertas se guardarán aquí de forma local." 
                  : "El guardado de historial se encuentra desactivado."}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
              <p className="leading-relaxed">
                Los montos se procesan de forma privada en el navegador.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                className="text-gray-500 hover:text-emerald-600 underline shrink-0 cursor-pointer"
              >
                Configuración de privacidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
