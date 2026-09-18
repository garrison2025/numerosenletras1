import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { 
  Copy, 
  Check, 
  Volume2, 
  RotateCcw, 
  DollarSign, 
  Coins, 
  Star, 
  History, 
  Trash2, 
  Share2, 
  Wand2, 
  Calculator, 
  FileCheck2, 
  Settings2,
  Calendar,
  Building2,
  User,
  Search,
  Sparkles
} from "lucide-react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { CURRENCIES, CURRENCY_MAP, DEFAULT_CURRENCY, type CurrencyConfig } from "../data/currencies";

interface HistoryItem {
  id: string;
  number: string;
  text: string;
  timestamp: string;
  isFavorite?: boolean;
}

interface NumberConverterProps {
  initialNumber?: string;
  onNavigate?: (path: string) => void;
}

export default function NumberConverter({ initialNumber = "", onNavigate }: NumberConverterProps) {
  const [inputVal, setInputVal] = useState(initialNumber);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Configuration options
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [letterCase, setLetterCase] = useState<'upper' | 'lower' | 'title'>('upper');
  const [isCurrencyMode, setIsCurrencyMode] = useState(false);
  const [currencyPreset, setCurrencyPreset] = useState<string>("MXN");
  const [isFinancialFormat, setIsFinancialFormat] = useState(true);
  const [numberFormatStyle, setNumberFormatStyle] = useState<'LA' | 'ES'>('LA'); // LA = 1,234.56, ES = 1.234,56

  // Local storage history and favorites
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyEnabled, setHistoryEnabled] = useState<boolean>(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'favorites'>('all');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");

  // Cheque Preview Simulator state
  const [showChequePreview, setShowChequePreview] = useState(true);
  const [chequeDate, setChequeDate] = useState(() => {
    return new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  });
  const [chequeBeneficiary, setChequeBeneficiary] = useState("AL PORTADOR O BENEFICIARIO");
  const [chequeBank, setChequeBank] = useState("BANCO INTERNACIONAL DE MÉXICO");

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  // Load URL query params or stored preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paramNum = urlParams.get("n") || urlParams.get("numero") || urlParams.get("cantidad");
      if (paramNum) {
        setInputVal(paramNum);
      }

      // Load history enabled setting
      const storedHistoryEnabled = localStorage.getItem("history_enabled");
      if (storedHistoryEnabled !== null) {
        setHistoryEnabled(storedHistoryEnabled === "true");
      }

      // Load conversion history
      try {
        const stored = localStorage.getItem("conversion_history");
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Sync cheque bank based on selected currency preset
  useEffect(() => {
    const config = CURRENCY_MAP[currencyPreset];
    if (config?.defaultBank) {
      setChequeBank(config.defaultBank);
    }
  }, [currencyPreset]);

  // Clean and parse input based on numberFormatStyle
  const parseInputValue = (val: string): string => {
    let cleaned = val.trim();
    if (!cleaned) return "";

    if (numberFormatStyle === 'LA') {
      // Latin America / USA: commas are thousands separators, dot is decimal
      cleaned = cleaned.replace(/,/g, '');
    } else {
      // Spain / Europe: dots are thousands separators, comma is decimal
      cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
    }
    return cleaned;
  };

  // Convert on input or config change
  useEffect(() => {
    const cleanInput = parseInputValue(inputVal);

    if (!cleanInput) {
      setResult("");
      return;
    }

    if (isNaN(Number(cleanInput)) && cleanInput !== "-") {
      setResult("Entrada no válida (solo números y un punto decimal)");
      return;
    }

    try {
      const isNegative = cleanInput.startsWith("-");
      const positiveVal = isNegative ? cleanInput.substring(1) : cleanInput;
      
      let convertedText = "";
      if (isCurrencyMode) {
        const currencyCfg: CurrencyConfig = CURRENCY_MAP[currencyPreset] || DEFAULT_CURRENCY;
        convertedText = convertNumberToLetters(positiveVal, {
          currency: currencyCfg,
          formatFinancial: isFinancialFormat,
          decimalMode: isFinancialFormat ? 'fraction' : 'words'
        });
      } else {
        convertedText = convertNumberToLetters(positiveVal, { gender });
      }
      
      if (isNegative && convertedText !== "cero") {
        convertedText = `menos ${convertedText}`;
      }

      // Case conversion
      if (letterCase === 'upper') {
        convertedText = convertedText.toUpperCase();
      } else if (letterCase === 'lower') {
        convertedText = convertedText.toLowerCase();
      } else if (letterCase === 'title') {
        convertedText = convertedText
          .toLowerCase()
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      setResult(convertedText);

      // Save to history debounce
      if (!isFirstMount.current && cleanInput && !isNaN(Number(cleanInput))) {
        saveToHistory(cleanInput, convertedText);
      } else {
        isFirstMount.current = false;
      }
    } catch {
      setResult("Error en la conversión");
    }
  }, [inputVal, gender, letterCase, isCurrencyMode, currencyPreset, isFinancialFormat, numberFormatStyle]);

  const saveToHistory = (num: string, textStr: string) => {
    if (!historyEnabled || !num || num === "-" || isNaN(Number(num)) || textStr.startsWith("Entrada no")) return;
    
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].number === num && prev[0].text === textStr) {
        return prev;
      }
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        number: num,
        text: textStr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updated = [newItem, ...prev].slice(0, 15);
      try {
        localStorage.setItem("conversion_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleHistoryEnabled = () => {
    const next = !historyEnabled;
    setHistoryEnabled(next);
    localStorage.setItem("history_enabled", String(next));
    showToast(next ? "Guardado de historial activado" : "Guardado de historial desactivado");
  };

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleCopy = () => {
    if (!result || result.startsWith("Entrada no") || result.startsWith("Error")) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const rawVal = inputVal.trim();
    if (!rawVal || isNaN(Number(rawVal.replace(/[^0-9.-]/g, "")))) return;
    
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("n", rawVal);
    
    navigator.clipboard.writeText(url.toString());
    showToast("Enlace de conversión copiado al portapapeles");
  };

  const handleSpeech = () => {
    if (!result || result.startsWith("Entrada no")) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(result);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      showToast("La síntesis de voz no está soportada en su navegador.");
    }
  };

  const handleClearHistory = () => {
    const hasFavorites = history.some(item => item.isFavorite);
    if (hasFavorites) {
      setHistory((prev) => {
        const filtered = prev.filter(item => item.isFavorite);
        localStorage.setItem("conversion_history", JSON.stringify(filtered));
        showToast("Historial borrado, conservando favoritos");
        return filtered;
      });
    } else {
      setHistory([]);
      localStorage.removeItem("conversion_history");
      showToast("Historial borrado");
    }
  };

  const handleRemoveHistoryItem = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      let isFavNow = false;
      const updated = prev.map(item => {
        if (item.id === id) {
          isFavNow = !item.isFavorite;
          showToast(isFavNow ? "Guardado en favoritos" : "Quitado de favoritos");
          return { ...item, isFavorite: isFavNow };
        }
        return item;
      });
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRandomNumber = () => {
    const scales = [100, 1000, 25000, 500000, 2000000];
    const chosenScale = scales[Math.floor(Math.random() * scales.length)];
    const randomVal = (Math.random() * chosenScale).toFixed(Math.random() > 0.4 ? 2 : 0);
    setInputVal(randomVal);
    showToast(`Número aleatorio generado: ${randomVal}`);
  };

  const handleMultiply = (factor: number) => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const multiplied = (parsed * factor).toFixed(parsed % 1 !== 0 ? 2 : 0);
      setInputVal(multiplied);
      showToast(`Multiplicado por ${factor}: ${multiplied}`);
    }
  };

  const handleAddValue = (delta: number) => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const summed = (parsed + delta).toFixed(parsed % 1 !== 0 ? 2 : 0);
      setInputVal(summed);
    } else {
      setInputVal(String(delta));
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        const inputElem = document.getElementById("num-input");
        if (document.activeElement !== inputElem && result && !result.startsWith("Entrada no")) {
          e.preventDefault();
          handleCopy();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [result]);

  const activeCurrency = CURRENCY_MAP[currencyPreset] || DEFAULT_CURRENCY;

  return (
    <div className="relative font-sans text-left">
      {/* Toast popup */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-xl shadow-black/10 flex items-center gap-2 animate-fade-in border border-gray-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Interactive Converter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 mb-10 relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />

        <div className="space-y-6">
          {/* Input field and format selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="num-input" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ingresa el número o cantidad decimal
              </label>
              
              <div className="flex items-center space-x-1.5 bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => {
                    setNumberFormatStyle('LA');
                    showToast("Formato decimal: 1,234.56 (América)");
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    numberFormatStyle === 'LA' 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con comas y decimales con punto (América / MX / US)"
                >
                  1,234.56
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNumberFormatStyle('ES');
                    showToast("Formato decimal: 1.234,56 (España / UE)");
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    numberFormatStyle === 'ES' 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Formato miles con puntos y decimales con coma (España / Europa)"
                >
                  1.234,56
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                id="num-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={numberFormatStyle === 'LA' ? "Ej: 1,250.50 o 1000000" : "Ej: 1.250,50 o 1000000"}
                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-gray-900 text-xl sm:text-2xl font-mono font-bold tracking-tight rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all px-4 py-4 pr-32 outline-hidden placeholder:text-gray-350"
                autoFocus
                autoComplete="off"
              />

              <div className="absolute right-3 flex items-center space-x-1.5">
                {inputVal && (
                  <button
                    type="button"
                    onClick={() => { setInputVal(""); setResult(""); }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
                    title="Borrar entrada"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleRandomNumber}
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                  title="Generar número aleatorio"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action helper buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono mr-1">Ajustar:</span>
              {[
                { label: "+1", act: () => handleAddValue(1) },
                { label: "+10", act: () => handleAddValue(10) },
                { label: "+100", act: () => handleAddValue(100) },
                { label: "+1000", act: () => handleAddValue(1000) },
                { label: "×2", act: () => handleMultiply(2) },
                { label: "÷2", act: () => handleMultiply(0.5) },
                { label: "100", act: () => setInputVal("100") },
                { label: "1,000", act: () => setInputVal("1000") },
                { label: "1,000,000", act: () => setInputVal("1000000") },
              ].map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={btn.act}
                  className="text-[10.5px] font-mono font-semibold bg-gray-100/70 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-2 py-0.5 rounded-md transition-all cursor-pointer border border-transparent hover:border-blue-200"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs: General vs Divisas / Cheque */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/70 rounded-2xl border border-gray-200/60">
            <button
              type="button"
              onClick={() => setIsCurrencyMode(false)}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                !isCurrencyMode
                  ? "bg-white text-blue-600 shadow-sm shadow-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Número Cardinal RAE</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCurrencyMode(true)}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                isCurrencyMode
                  ? "bg-white text-blue-600 shadow-sm shadow-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Moneda y Cheque Bancario</span>
            </button>
          </div>

          {/* Options panel */}
          <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Opciones de Formato y Personalización</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {/* Currency Selector (when in currency mode) */}
              {isCurrencyMode ? (
                <div>
                  <label htmlFor="currency-select" className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Divisa Oficial ({CURRENCIES.length} países)
                  </label>
                  <select
                    id="currency-select"
                    value={currencyPreset}
                    onChange={(e) => setCurrencyPreset(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name} ({curr.financialSuffix ? `${curr.symbol} / ${curr.financialSuffix}` : curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Gender selection for general cardinal mode */
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Género Gramatical
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setGender('M')}
                      className={`py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        gender === 'M' ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Masculino (uno)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('F')}
                      className={`py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        gender === 'F' ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Femenino (una)
                    </button>
                  </div>
                </div>
              )}

              {/* Capitalization */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Capitalización
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-gray-200 text-center">
                  <button
                    type="button"
                    onClick={() => setLetterCase('upper')}
                    className={`py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      letterCase === 'upper' ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    MAYÚS
                  </button>
                  <button
                    type="button"
                    onClick={() => setLetterCase('lower')}
                    className={`py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      letterCase === 'lower' ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    minús
                  </button>
                  <button
                    type="button"
                    onClick={() => setLetterCase('title')}
                    className={`py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      letterCase === 'title' ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Título
                  </button>
                </div>
              </div>

              {/* Cent format (in currency mode) */}
              {isCurrencyMode ? (
                <div>
                  <label htmlFor="financial-format" className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Expresión de Centavos
                  </label>
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="financial-format"
                      checked={isFinancialFormat}
                      onChange={(e) => setIsFinancialFormat(e.target.checked)}
                      className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="financial-format" className="text-xs text-gray-700 cursor-pointer select-none">
                      {isFinancialFormat ? "Fraccionario (00/100 M.N.)" : "En palabras (con centavos)"}
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Modo Rápido
                  </label>
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-500">
                    <span>Estándar RAE</span>
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Output Card */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                Resultado en Letras Oficial
              </span>
              
              <div className="flex items-center gap-1">
                {result && !result.startsWith("Entrada no") && (
                  <>
                    <button
                      type="button"
                      onClick={handleSpeech}
                      disabled={isPlayingAudio}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isPlayingAudio 
                          ? "bg-blue-100 border-blue-300 text-blue-700 animate-pulse" 
                          : "bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                      }`}
                      title="Escuchar pronunciación del número en español"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-all cursor-pointer"
                      title="Copiar enlace directo a esta conversión"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={`w-full min-h-[110px] rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              result && !result.startsWith("Entrada no")
                ? "bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/20 border-blue-300 shadow-sm"
                : "bg-gray-50/60 border-dashed border-gray-200"
            }`}>
              <div className="text-left font-sans text-lg sm:text-xl font-bold leading-relaxed text-gray-900 break-words select-all">
                {result || (
                  <span className="text-gray-400 font-normal italic text-sm sm:text-base">
                    Escribe una cantidad arriba para ver la transcripción ortográfica inmediata...
                  </span>
                )}
              </div>

              {result && !result.startsWith("Entrada no") && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-blue-100/60">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Validado RAE</span>
                    {isCurrencyMode && (
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded text-[10px] font-bold">
                        {activeCurrency.flag} {activeCurrency.code}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      copied
                        ? "bg-emerald-600 text-white shadow-emerald-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
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
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Cheque Simulation Preview (When in Currency Mode) */}
          {isCurrencyMode && showChequePreview && (
            <div className="bg-gradient-to-r from-amber-50/60 via-yellow-50/40 to-amber-50/60 rounded-3xl p-5 sm:p-7 border border-amber-200/80 text-left shadow-md shadow-amber-900/5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span className="font-mono text-xs font-bold tracking-widest text-amber-900 uppercase">
                    {chequeBank}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-amber-800/80 bg-amber-100/60 px-2 py-0.5 rounded">
                    CHEQUE NO. 0048291
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChequePreview(false)}
                    className="text-[10px] text-amber-700 hover:underline cursor-pointer"
                  >
                    Ocultar simulación
                  </button>
                </div>
              </div>

              {/* Cheque Body Grid */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-900">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span className="font-semibold">Fecha de expedición:</span>
                    <input
                      type="text"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      className="bg-transparent border-b border-amber-300 font-serif italic text-xs text-amber-950 px-1 py-0.5 outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-amber-100/80 border border-amber-300 rounded-xl px-3 py-1.5 self-start sm:self-auto">
                    <span className="font-mono font-bold text-xs text-amber-800">{activeCurrency.symbol}</span>
                    <span className="font-mono font-black text-base text-amber-950">
                      {inputVal ? `${inputVal} ${activeCurrency.financialSuffix || ''}` : "0.00"}
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
                      value={chequeBeneficiary}
                      onChange={(e) => setChequeBeneficiary(e.target.value)}
                      className="w-full bg-transparent font-serif font-bold text-xs sm:text-sm text-amber-950 uppercase outline-hidden border-b border-dashed border-amber-300 focus:border-amber-600 px-1"
                    />
                  </div>
                </div>

                <div className="border-b-2 border-amber-300 pb-2">
                  <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 font-sans">
                    La cantidad de (con letra):
                  </span>
                  <div className="font-serif italic font-bold text-xs sm:text-sm text-amber-950 leading-snug tracking-wide break-words py-1 bg-amber-100/30 px-2 rounded-md">
                    {result ? `*** ${result} ***` : "*** Cero pesos 00/100 M.N. ***"}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div className="font-mono text-[9px] text-amber-800/70 tracking-widest">
                    ⑈01234567⑈ 890123456789⑈ 0048291
                  </div>
                  <div className="text-center">
                    <div className="font-signature text-xl text-amber-900 leading-none">
                      Firma del librador
                    </div>
                    <div className="w-32 border-t border-amber-400 mt-1">
                      <span className="text-[8px] font-sans text-amber-800 block">Firma autorizada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History and Favorites Drawer */}
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

            {history.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setInputVal(item.number);
                      showToast(`Cargado del historial: ${item.number}`);
                    }}
                    className="group bg-gray-50/80 hover:bg-blue-50/40 p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5 overflow-hidden text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-800">{item.number}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate max-w-sm sm:max-w-md">{item.text}</p>
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
                  ? "Las conversiones que realices se guardarán aquí de forma local." 
                  : "El guardado de historial se encuentra desactivado."}
              </p>
            )}

            <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
              Los números introducidos no se envían a nuestros servidores. El historial de conversiones se almacena exclusivamente en la memoria local de tu navegador y puedes desactivarlo o limpiarlo en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
