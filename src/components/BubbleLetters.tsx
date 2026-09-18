import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AESTHETIC_FONTS } from "../utils/fontGenerators";
import { canUsePreferenceStorage } from "../utils/storageConsent";
import { 
  CircleDot, 
  Copy, 
  Check, 
  HelpCircle, 
  Smile, 
  Sparkles,
  Dices,
  Trash2,
  ChevronDown,
  ChevronUp,
  Instagram,
  Gamepad2,
  Quote,
  Flame,
  CheckSquare,
  Star,
  Heart,
  Edit3,
  Wand2,
  X
} from "lucide-react";

// Symbol injector categories specifically matching the bubble vibe
const SYMBOL_CATEGORIES = [
  {
    id: "stars",
    label: "★ Estrellas",
    symbols: ["★", "☆", "✦", "✧", "☾", "☽", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "☄", "🪐", "🌙", "☀", "⚡"]
  },
  {
    id: "hearts",
    label: "♥ Amor",
    symbols: ["♥", "♡", "𓆩♡𓆪", "𐙚", "❦", "❧", "❣", "💕", "💞", "🖤", "💜", "💙", "💚", "💛", "💌", "💋"]
  },
  {
    id: "nature",
    label: "🌸 Flores",
    symbols: ["✿", "❀", "❁", "💮", "🌺", "🌻", "🌼", "🌷", "🌱", "🌿", "🍀", "🍁", "🍒", "🍓", "🍉", "🍇"]
  },
  {
    id: "kaomoji",
    label: "٩(^‿^)۶ Kaomoji",
    symbols: [
      "(｡♥‿♥｡)", "(◡‿◡✿)", "(っ◔◡◔)っ", "≧◡≦", "(^_<)～☆", "(*^‿^*)", "o(≧▽≦)o", "(◕‿◕✿)", 
      "ʕ•ᴥ•ʔ", "(=^·^=)", "ଘ(੭*ˊᵕˋ)੭*", "(´• ω •`)"
    ]
  }
];

// Bubble Adjectives & Nouns for Random Nickname Generation
const RANDOM_BUBBLE_ADJECTIVES = [
  "Burbuja", "Redondo", "Esfera", "Globo", "Cosmic", "Dreamy", "Shadow", "Sweet", "Cherry", "Cyber",
  "Golden", "Midnight", "Mystic", "Vintage", "Pastel", "Soft", "Dark", "Angel", "Devil", "Fairy"
];

const RANDOM_BUBBLE_NOUNS = [
  "Nube", "Luna", "Estrella", "Gamer", "Sniper", "Lover", "Vibras", "Reina", "Rey", "Amigo",
  "Panda", "Ninja", "Soul", "Vibe", "Aura", "Cat", "Pez", "Mundo", "Babe", "Princess"
];

// Custom bubble text decoration frames
const BUBBLE_DECORATOR_TEMPLATES = [
  { id: "bdec1", template: (text: string) => `𓆩♡𓆪 ${text} 𓆩♡𓆪`, label: "Esferas de Amor" },
  { id: "bdec2", template: (text: string) => `★彡 ${text} 彡★`, label: "Estrellas de Burbuja" },
  { id: "bdec3", template: (text: string) => `✧*̥˚ ${text} *̥˚✧`, label: "Destello Redondo" },
  { id: "bdec4", template: (text: string) => "•´¯\`•. " + text + " .•´¯\`•.", label: "Onda Circular" },
  { id: "bdec5", template: (text: string) => `╰┈➤ ❝ ${text} ❞`, label: "Flecha de Burbuja" },
  { id: "bdec6", template: (text: string) => `°•. ✿ .•° ${text} °•. ✿ .•°`, label: "Borde de Pétalos" },
  { id: "bdec7", template: (text: string) => `🍒 ─── ${text} ─── 🍒`, label: "Cerezas Redondas" },
  { id: "bdec8", template: (text: string) => `░▒▓█ ${text} █▓▒░`, label: "Contenedor Pixel" }
];

// Tabbed bio presets specifically using circular and bubble styles
const DETAILED_BUBBLE_BIO_PRESETS = {
  social: [
    {
      name: "Bio Círculos",
      preview: "✨ Ⓦⓔⓛⓒⓞⓜⓔ ⓣⓞ ⓜⓨ ⓟⓔⓡⓕⓘⓛ ✨\n🌙 🅜🅘🅓🅝🅘🅖🅗🅣 • 🅥🅘🅑🅔🅢\n🌿 🅢🅞🅕🅣 ⓁⒾⒻⒺ\n💌 DM para negocios",
      raw: "✨ Ⓦⓔⓛⓒⓞⓜⓔ ⓣⓞ ⓜⓨ ⓟⓔⓡⓕⓘⓛ ✨\n🌙 🅜🅘🅓🅝🅘🅖🅗🅣 • 🅥🅘🅑🅔🅢\n🌿 🅢🅞🅕🅣 ⓁⒾⒻⒺ\n💌 DM para negocios"
    },
    {
      name: "Aura Redonda",
      preview: "🧸 ⓜⓨ ⓛⓘⓕⓔ, ⓜⓨ ⓡⓤⓛⓔⓢ 🌸\n🍡 🅚🅐🅦🅐🅘🅘_🅖🅘🅡🅛\n🏹 ⓈⒾⓂⓅⓁⒺ ⓈⓄⓊⓁ\n✨ Fluyendo con el viento",
      raw: "🧸 ⓜⓨ ⓛⓘⓕⓔ, ⓜⓨ ⓡⓤⓛⓔⓢ 🌸\n🍡 🅚🅐🅦🅐🅘🅘_🅖🅘🅡🅛\n🏹 ⓈⒾⓂⓅⓁⒺ ⓈⓄⓊⓁ\n✨ Fluyendo con el viento"
    },
    {
      name: "Estilo Relleno",
      preview: "⚡︎ 🅚🅔🅔🅟 🅘🅣 🅢🅘🅜🅟🅛🅔.\n🖤 ⓑⓤⓡⓑⓤⓙⓐ ⓐⓒⓣⓘⓥⓐ\n☕︎ Cafeína y código\n✈︎ ⓉⓇⒶⓋⒺⓁⒺⓇ",
      raw: "⚡︎ 🅚🅔🅔🅟 🅘🅣 🅢🅘🅜🅟🅛🅔.\n🖤 ⓑⓤⓡⓑⓤⓙⓐ ⓐⓒⓣⓘⓥⓐ\n☕︎ Cafeína y código\n✈︎ ⓉⓇⒶⓋⒺⓁⒺⓇ"
    }
  ],
  gaming: [
    {
      name: "Clan Redondo",
      preview: "⚔️ 𓆩 🅢🅝🅘🅟🅔🅡 𓆪 ⚔️\n🔥 [ ⓀⒾⓁⓁⒺⓇ ]\n🏆 🅡🅐🅝🅚: 🅗🅔🅡🅞🅘🅒\n🎮 No pain, no gain",
      raw: "⚔️ 𓆩 🅢🅝🅘🅟🅔🅡 𓆪 ⚔️\n🔥 [ ⓀⒾⓁⓁⒺⓇ ]\n🏆 🅡🅐🅝🅚: 🅗🅔🅡🅞🅘🅒\n🎮 No pain, no gain"
    },
    {
      name: "Burbuja Gamer",
      preview: "✿ 🅖🅐🅜🅔🅡_🅠🅤🅔🅔🅝 ✿\n🔫 🅗🅔🅐🅓🅢🅗🅞🅣\n👑 Clan Leader\n✨ ⓃⒺⓋⒺⓇ ⒼⒾⓋⒺ ⓊⓅ!",
      raw: "✿ 🅖🅐🅜🅔🅡_🅠🅤🅔🅔🅝 ✿\n🔫 🅗🅔🅐🅓🅢🅗🅞🅣\n👑 Clan Leader\n✨ ⓃⒺⓋⒺⓇ ⒼⒾⓋⒺ ⓊⓅ!"
    },
    {
      name: "Pro Roblox",
      preview: "⚡️ ⓉⓄⓍⒾⒸ_ⒷⓄⓎ ⚡️\n🔥 🅛🅔🅥🅔🅛 🅜🅐🅧\n🎮 Roblox & FF\n💀 Nos vemos en el lobby",
      raw: "⚡️ ⓉⓄⓍⒾⒸ_ⒷⓄⓎ ⚡️\n🔥 🅛🅔🅥🅔🅛 🅜🅐🅧\n🎮 Roblox & FF\n💀 Nos vemos en el lobby"
    }
  ],
  quotes: [
    {
      name: "Sueños Esféricos",
      preview: "☾ ⓢⓤⓔñⓞⓢ ⓢⓘⓝ ⓕⓘⓝ ✩\n✨ La luna brilla en círculos.\n🪐 Polvo de estrellas\n💫 🅛🅘🅥🅔 🅣🅗🅔 🅜🅞🅜🅔🅝🅣",
      raw: "☾ ⓢⓤⓔñⓞⓢ ⓢⓘⓝ ⓕⓘⓝ ✩\n✨ La luna brilla en círculos.\n🪐 Polvo de estrellas\n💫 🅛🅘🅥🅔 🅣🅗🅔 🅜🅞🅜🅔🅝🅣"
    },
    {
      name: "Frases de Burbuja",
      preview: "☕︎ 🅟🅔🅝🅢🅐🅜🅘🅔🅝🅣🅞🅢 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 ⓈⒺ ⓉⓊ ⓅⓇⓄⓅⒾⓄ ⓈⓄⓁ",
      raw: "☕︎ 🅟🅔🅝🅢🅐🅜🅘🅔🅝🅣🅞🅢 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 ⓈⒺ ⓉⓊ ⓅⓇⓄⓅⒾⓄ ⓈⓄⓁ"
    },
    {
      name: "Energía Redonda",
      preview: "🦋 Ⓥⓘⓑⓡⓐⓢ ⓟⓞⓢⓘⓣⓘⓥⓐⓢ 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ 🅟🅐🅩 🅨 🅐🅜🅞🅡",
      raw: "🦋 Ⓥⓘⓑⓡⓐⓢ ⓟⓞⓢⓘⓣⓘⓥⓐⓢ 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ 🅟🅐🅩 🅨 🅐🅜🅞🅡"
    }
  ]
};

export default function BubbleLetters({ initialText }: { initialText?: string }) {
  const [inputText, setInputText] = useState(initialText || "Mensaje Secreto");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSymbolTab, setSelectedSymbolTab] = useState("stars");
  const [activeBioTab, setActiveBioTab] = useState<'social' | 'gaming' | 'quotes'>('social');
  
  // Custom functional optimizations for letters bubble conversion
  const [normalizeAccents, setNormalizeAccents] = useState(true);
  const [spaceToDot, setSpaceToDot] = useState(false);
  const [textCase, setTextCase] = useState<"original" | "upper" | "lower">("original");
  const [fontSize, setFontSize] = useState<number>(24);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Clean up toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Favorites system state for custom nicknames
  const [favorites, setFavorites] = useState<{ id: string; text: string; label: string }[]>(() => {
    try {
      if (!canUsePreferenceStorage()) {
        return [];
      }
      const stored = localStorage.getItem("bubble_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Listen to cookie consent updates
  useEffect(() => {
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const allowed = customEvent.detail?.preferences === true;

      if (!allowed) {
        setFavorites([]);
        return;
      }

      try {
        const stored = localStorage.getItem("bubble_favorites");
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {
        setFavorites([]);
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  const saveFavorite = (text: string, label: string) => {
    if (!text.trim()) return;

    if (!canUsePreferenceStorage()) {
      showToast("Activa las preferencias de privacidad para guardar favoritos");
      window.dispatchEvent(new Event("open-cookie-settings"));
      return;
    }

    const exists = favorites.some(fav => fav.text === text);
    if (exists) {
      showToast("Este nick de burbuja ya está en tus favoritos ❤️");
      return;
    }
    const newFav = { id: Date.now().toString(), text, label };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    try {
      localStorage.setItem("bubble_favorites", JSON.stringify(updated));
    } catch (e) {}
    showToast("¡Agregado a tus favoritos de burbuja! 💖");
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(fav => fav.id !== id);
    setFavorites(updated);
    try {
      if (canUsePreferenceStorage()) {
        localStorage.setItem("bubble_favorites", JSON.stringify(updated));
      } else {
        localStorage.removeItem("bubble_favorites");
      }
    } catch (e) {}
    showToast("Eliminado de tus favoritos 🗑️");
  };

  // Custom decorator builder state
  const [customPrefix, setCustomPrefix] = useState("𓆩♡𓆪");
  const [customSuffix, setCustomSuffix] = useState("𓆩♡𓆪");
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  // Editing Bio preset
  const [editingBio, setEditingBio] = useState<{ title: string; content: string } | null>(null);

  // Sync with incoming prop for deep links or query parameters on mount
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    } else {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("text") || urlParams.get("q");
        if (q) {
          setInputText(q);
        }
      } catch (e) {
        // Ignore fallback
      }
    }
  }, [initialText]);

  // Sync inputText state with browser URL search parameters in real time (debounced)
  useEffect(() => {
    const rawVal = inputText.trim();
    const timer = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        if (rawVal) {
          url.searchParams.set("text", rawVal);
        } else {
          url.searchParams.delete("text");
        }
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) {
        // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputText]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Retrieve specifically bubble white and bubble black from the fonts mapping
  const bubbleWhiteFont = AESTHETIC_FONTS.find(f => f.id === "bubble_white");
  const bubbleBlackFont = AESTHETIC_FONTS.find(f => f.id === "bubble_black");

  // Helper to pre-process and optimize input text for maximum bubble conversion compatibility
  const getTransformedText = (text: string) => {
    let result = text;
    
    // 1. Text Case Conversion
    if (textCase === "upper") {
      result = result.toUpperCase();
    } else if (textCase === "lower") {
      result = result.toLowerCase();
    }
    
    // 2. Normalizing Accents (essential for full bubble coverage since diacritics are unsupported in Unicode bubble blocks)
    if (normalizeAccents) {
      result = result
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Normalizes á -> a, é -> e, etc.
        .replace(/ñ/g, "n")              // Maps ñ to n for clean bubble conversion
        .replace(/Ñ/g, "N");
    }
    
    // 3. Replacing Spaces with Aesthetic Bubble Dots
    if (spaceToDot) {
      result = result.replace(/\s+/g, " • "); // Adds a lovely aesthetic dot bubble-separator
    }
    
    return result;
  };

  const processedText = getTransformedText(inputText);

  const generatedWhite = bubbleWhiteFont ? bubbleWhiteFont.generate(processedText) : "";
  const generatedBlack = bubbleBlackFont ? bubbleBlackFont.generate(processedText) : "";

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`¡Copiado!: "${text.length > 25 ? text.substring(0, 25) + '...' : text}" 📋✨`);
  };

  const handleInjectSymbol = (symbol: string) => {
    if (inputText.length + symbol.length > 80) return;
    
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? inputText.length;
      const end = input.selectionEnd ?? inputText.length;
      const newText = inputText.substring(0, start) + symbol + inputText.substring(end);
      setInputText(newText);
      
      // Keep input focused and reset cursor position
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 50);
    } else {
      setInputText(prev => prev + symbol);
    }
  };

  const handleGenerateRandomNick = () => {
    const adj = RANDOM_BUBBLE_ADJECTIVES[Math.floor(Math.random() * RANDOM_BUBBLE_ADJECTIVES.length)];
    const noun = RANDOM_BUBBLE_NOUNS[Math.floor(Math.random() * RANDOM_BUBBLE_NOUNS.length)];
    const formats = [
      `${adj}${noun}`,
      `${adj} ${noun}`,
      `${adj}_${noun}`,
      `${adj}-${noun}`
    ];
    const baseName = formats[Math.floor(Math.random() * formats.length)];
    setInputText(baseName);
  };

  const handleClear = () => {
    setInputText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Pre-made bubble presets for copy-pasting
  const POPULAR_BUBBLES = [
    { label: "Nombres", text: "ⓐⓛⓔⓧⓘⓢ" },
    { label: "Números", text: "①②③④⑤" },
    { label: "Black", text: "🅙🅤🅐🅝" },
    { label: "Llamada a la Acción", text: "🅢🅘🅖🅤🅢" }
  ];

  return (
    <div className="relative max-w-4xl mx-auto text-left">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-20 -right-4 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Converter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 mb-10 relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />
        
        {/* Decorative circle patterns */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-50/50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-50/50 rounded-full opacity-60 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Input text box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="bubble-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Escribe tu texto para tus letras burbuja copiar y pegar o letras en círculos:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateRandomNick}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-100 hover:border-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Generar apodo o nick aleatorio con letras burbuja"
                >
                  <Dices className="w-3 h-3" />
                  <span>Nick Aleatorio</span>
                </button>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="text-[11px] font-bold text-gray-500 hover:text-rose-600 bg-gray-50 border border-gray-200 hover:border-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>
            <div className="relative group">
              <input
                id="bubble-input"
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={80}
                placeholder="Ej. letras burbuja copiar y pegar"
                className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-blue-500 focus:bg-white text-gray-950 placeholder-gray-400 font-sans font-semibold text-xl sm:text-2xl rounded-2xl px-5 py-4.5 outline-hidden transition-all duration-300 shadow-sm focus:shadow-md focus:ring-4 focus:ring-blue-500/5"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">
                {inputText.length}/80
              </span>
            </div>
          </div>

          {/* Optimized Customizer Toolbar for Letras Burbuja */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4.5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fijar Formato:
                </span>
                <div className="flex bg-white p-0.5 rounded-xl border border-gray-200/50 shadow-xs">
                  {(["original", "upper", "lower"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTextCase(mode)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        textCase === mode
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/60"
                      }`}
                    >
                      {mode === "original" ? "Aa" : mode === "upper" ? "🅜🅐🅨🅤🅢" : "ⓜⓘⓝⓤⓢ"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={normalizeAccents}
                    onChange={(e) => setNormalizeAccents(e.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-600">Autocorregir acentos (á→a, ñ→n)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={spaceToDot}
                    onChange={(e) => setSpaceToDot(e.target.checked)}
                    className="w-4 h-4 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-600">Puntos estéticos (•)</span>
                </label>
              </div>
            </div>

            {/* Preview Font Size slider */}
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-200/80">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Pre-visualización:</span>
              <input
                type="range"
                min="16"
                max="36"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-24 sm:w-28 accent-blue-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-blue-700 shrink-0 min-w-[32px] text-right">{fontSize}px</span>
            </div>
          </div>

          {/* Custom Decorator Wizard Panel */}
          <div className="bg-blue-50/20 border border-blue-150 rounded-2xl p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setIsCustomExpanded(!isCustomExpanded)}
              className="w-full flex items-center justify-between text-left cursor-pointer group focus:outline-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Diseñador de Decorados Personalizados
                  </span>
                  <span className="block text-[10px] text-gray-500 font-medium">
                    Crea tu propio marco o borde personalizado para tu apodo o frase
                  </span>
                </div>
              </div>
              <div className="text-blue-600 group-hover:text-blue-800 transition-colors">
                {isCustomExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {isCustomExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-blue-100/60 mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left decorator column */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Prefijo (Izquierda):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customPrefix}
                            onChange={(e) => setCustomPrefix(e.target.value)}
                            maxLength={15}
                            placeholder="Ej. 𓆩♡𓆪"
                            className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-sans font-bold shadow-2xs"
                          />
                        </div>
                        {/* Quick preset symbols for left */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {["𓆩♡𓆪", "༺", "★彡", "✧*̥˚", "•´¯`•.", "⚡", "°•. ✿ .•°", "╰┈➤"].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setCustomPrefix(sym)}
                              className="text-[10px] bg-white hover:bg-blue-50 border border-gray-150 hover:border-blue-300 rounded px-1.5 py-0.5 font-bold cursor-pointer transition-all active:scale-95 text-gray-650"
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right decorator column */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Sufijo (Derecha):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customSuffix}
                            onChange={(e) => setCustomSuffix(e.target.value)}
                            maxLength={15}
                            placeholder="Ej. 𓆩♡𓆪"
                            className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-sans font-bold shadow-2xs"
                          />
                        </div>
                        {/* Quick preset symbols for right */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {["𓆩♡𓆪", "༻", "彡★", "*̥˚✧", ".•´¯`•", "⚡", "°•. ✿ .•°", "❝"].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setCustomSuffix(sym)}
                              className="text-[10px] bg-white hover:bg-blue-50 border border-gray-150 hover:border-blue-300 rounded px-1.5 py-0.5 font-bold cursor-pointer transition-all active:scale-95 text-gray-650"
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Output display for custom decorators */}
                    <div className="bg-blue-100/35 border border-blue-200/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="text-left w-full sm:w-auto">
                        <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
                          Resultado de tu Diseño Blanco
                        </span>
                        <span className="font-sans font-extrabold text-base text-gray-900 break-all select-all block">
                          {customPrefix} {generatedWhite || "ⓔⓙⓔⓜⓟⓛⓞ"} {customSuffix}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => saveFavorite(`${customPrefix} ${generatedWhite || "ⓔⓙⓔⓜⓟⓛⓞ"} ${customSuffix}`, "Diseño Blanco")}
                          className="px-3 py-2 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 text-rose-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                          title="Guardar en favoritos"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy("custom_white", `${customPrefix} ${generatedWhite || "ⓔⓙⓔⓜⓟⓛⓞ"} ${customSuffix}`)}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-blue-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-103"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Blanco</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-100/35 border border-blue-200/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="text-left w-full sm:w-auto">
                        <span className="block text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">
                          Resultado de tu Diseño Negro
                        </span>
                        <span className="font-sans font-extrabold text-base text-gray-900 break-all select-all block">
                          {customPrefix} {generatedBlack || "🅔🅙🅔🅜🅟🅛🅞"} {customSuffix}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => saveFavorite(`${customPrefix} ${generatedBlack || "🅔🅙🅔🅜🅟🅛🅞"} ${customSuffix}`, "Diseño Negro")}
                          className="px-3 py-2 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 text-rose-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                          title="Guardar en favoritos"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy("custom_black", `${customPrefix} ${generatedBlack || "🅔🅙🅔🅜🅟🅛🅞"} ${customSuffix}`)}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-indigo-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-103"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Negro</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Comparison Grid */}
          <div className="space-y-5 pt-4">
            
            {/* White Bubble Card */}
            <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/10 border border-blue-100/50 rounded-2xl p-5 sm:p-6 relative group transition-all duration-300 hover:shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Letras Burbuja Blancas (Contorno) - ⓐⓛⓔⓧ / ①②③
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blue-50 border border-blue-100/50 text-blue-700 px-2.5 py-0.5 rounded-md font-sans font-semibold">
                    Estilo Limpio Circular
                  </span>
                  <button
                    type="button"
                    onClick={() => saveFavorite(generatedWhite || "①②③ ⒶⒷⒸ", "Burbuja Blanca")}
                    className="p-1.5 rounded-lg hover:bg-blue-100/50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                    title="Guardar en favoritos"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p 
                className="font-sans font-extrabold text-blue-950 py-2 select-all break-all pr-16 min-h-[44px]"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
              >
                {generatedWhite || "①②③  ⒶⒷⒸ"}
              </p>

              {generatedWhite && (
                <button
                  onClick={() => handleCopy("white", generatedWhite)}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    copiedId === "white" 
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                      : "bg-white text-blue-600 hover:text-blue-800 hover:bg-gray-50 border-gray-250 shadow-xs hover:scale-105 active:scale-95"
                  }`}
                  title="Copiar letras burbuja contorno"
                >
                  {copiedId === "white" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Black Bubble Card */}
            <div className="bg-gradient-to-br from-indigo-50/30 to-slate-50/10 border border-indigo-100/50 rounded-2xl p-5 sm:p-6 relative group transition-all duration-300 hover:shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Letras Burbuja Negras (Rellenas) - 🅐🅛🅔🅧 / ❶❷❸
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2.5 py-0.5 rounded-md font-sans font-semibold">
                    Diseño de Alto Contraste
                  </span>
                  <button
                    type="button"
                    onClick={() => saveFavorite(generatedBlack || "❶❷❸ 🅐🅑🅒", "Burbuja Negra")}
                    className="p-1.5 rounded-lg hover:bg-indigo-100/50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                    title="Guardar en favoritos"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p 
                className="font-sans font-extrabold text-indigo-950 py-2 select-all break-all pr-16 min-h-[44px]"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
              >
                {generatedBlack || "❶❷❸  🅐🅑🅒"}
              </p>

              {generatedBlack && (
                <button
                  onClick={() => handleCopy("black", generatedBlack)}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    copiedId === "black" 
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/15" 
                      : "bg-white text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 border-gray-255 shadow-xs hover:scale-105 active:scale-95"
                  }`}
                  title="Copiar letras burbuja rellenas"
                >
                  {copiedId === "black" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 1.5 Pinned Favorite Styles Section */}
      {favorites.length > 0 && (
        <div className="mb-10 text-left border-t border-blue-100/50 pt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-sans font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Mis Nicks y Letras Guardadas ({favorites.length})</span>
            </h3>
            <button
              onClick={() => {
                setFavorites([]);
                try {
                  localStorage.removeItem("bubble_favorites");
                } catch (e) {}
                showToast("Todos los favoritos han sido eliminados 🗑️");
              }}
              className="text-[10px] font-bold text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Eliminar todos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav) => {
              const isCopied = copiedId === `fav_${fav.id}`;

              return (
                <div
                  key={fav.id}
                  className="bg-radial from-amber-50/20 to-white hover:to-amber-50/10 rounded-2xl p-4.5 text-left border border-amber-200/50 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="font-sans font-bold text-[9px] text-amber-800 flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {fav.label}
                    </span>
                    <p className="font-sans font-bold text-gray-950 text-base select-all break-all tracking-wide">
                      {fav.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-100 transition-colors cursor-pointer"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(`fav_${fav.id}`, fav.text)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 border ${
                        isCopied 
                          ? "bg-emerald-600 text-white border-emerald-700" 
                          : "bg-amber-600 text-white border-amber-700 hover:bg-amber-500 shadow-md shadow-amber-500/10"
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Decorative Templates Row */}
      {inputText.trim() && (
        <div className="mb-10 text-left">
          <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Adornos y bordes listos para tus letras burbuja copiar y pegar
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUBBLE_DECORATOR_TEMPLATES.map((item) => {
              const decoratedVal = item.template(generatedWhite || inputText);
              const isCopied = copiedId === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider mb-1">
                      {item.label}
                    </span>
                    <p className="text-gray-900 text-base font-semibold truncate select-all font-sans">
                      {decoratedVal}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(item.id, decoratedVal)}
                    className={`ml-3 shrink-0 p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isCopied
                        ? "bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-500/10"
                        : "bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-950 border-gray-200"
                    }`}
                    title="Copiar diseño decorado"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabbed Bio Presets using Bubble/Circles */}
      <div className="mb-10 bg-white/80 border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-lg shadow-gray-100/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
          <h3 className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 text-lg flex items-center gap-2">
            <Instagram className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Plantillas con Letras en Círculos y Letras Burbuja</span>
          </h3>
          
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
            {[
              { key: 'social', label: 'Social Bios', icon: Instagram },
              { key: 'gaming', label: 'Gaming & Clan', icon: Gamepad2 },
              { key: 'quotes', label: 'Frases Lindas', icon: Quote }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveBioTab(tab.key as any)}
                  className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeBioTab === tab.key 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETAILED_BUBBLE_BIO_PRESETS[activeBioTab].map((preset, idx) => {
            const isCopied = copiedId === preset.name;
            return (
              <div key={idx} className="bg-gray-50/50 rounded-2xl p-4.5 border border-gray-100 hover:border-gray-200 flex flex-col justify-between transition-all duration-300">
                <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed min-h-[90px] text-left">
                  {preset.preview}
                </pre>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingBio({
                        title: preset.name,
                        content: preset.raw
                      });
                    }}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                    title="Editar plantilla en el creador"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(preset.name, preset.raw)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 hover:scale-103 active:scale-97 border ${
                      isCopied 
                        ? "bg-emerald-600 border-emerald-700 text-white" 
                        : "bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-850 border-gray-200 shadow-xs"
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "¡Copiado!" : "Copiar plantilla"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Presets Grid & Circle text info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Popular circles preset */}
        <div className="md:col-span-1 bg-gray-50/40 border border-gray-100/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5">
              <Smile className="w-4.5 h-4.5 text-amber-500" />
              <span>Ejemplos de Letras Burbuja</span>
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed mb-4">
              Copia directamente algunas combinaciones de letras en círculos de uso común.
            </p>
          </div>

          <div className="space-y-2">
            {POPULAR_BUBBLES.map((pb, idx) => {
              const isCopied = copiedId === `pb-${idx}`;
              return (
                <div key={idx} className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-gray-100 flex items-center justify-between hover:shadow-xs transition-all duration-200">
                  <div>
                    <span className="text-[9px] text-gray-400 font-mono font-bold block mb-0.5">{pb.label}</span>
                    <span className="font-sans font-bold text-gray-800 text-xs">{pb.text}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(`pb-${idx}`, pb.text)}
                    className={`p-2 rounded-lg transition-all cursor-pointer border ${
                      isCopied ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600 border-transparent"
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainers cards */}
        <div className="md:col-span-2 bg-white/90 border border-gray-100/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-4.5 h-4.5 text-blue-500" />
            <span>¿Por qué utilizar letras burbuja?</span>
          </h3>

          <div className="text-xs text-gray-650 font-sans space-y-3.5 leading-relaxed">
            <p>
              Las <strong className="text-blue-600 font-bold">letras burbuja</strong> (también conocidas como fuentes en círculo o letras redondas) son extremadamente efectivas para crear títulos y encabezados visuales en redes sociales y chats donde no hay herramientas nativas para poner negrita o cambiar la tipografía estándar.
            </p>
            <p>
              - <strong>Biografías de Instagram y TikTok:</strong> Al usar <strong className="text-blue-600 font-semibold">letras burbuja copiar y pegar</strong>, que son símbolos gráficos de alta visibilidad, guías la mirada de los usuarios directamente a tus enlaces o datos de contacto importantes.
            </p>
            <p>
              - <strong>Nombres de perfil en videojuegos (nicks):</strong> Juegos como Free Fire, PUBG, Roblox o Minecraft permiten el uso de símbolos unicode para destacar tus nombres en las tablas de clasificación de forma espectacular.
            </p>
            <p>
              - <strong>Notas y listas de tareas:</strong> Puedes usar las <strong className="text-blue-600 font-semibold">letras en círculos</strong> numéricos (①, ②, ③) para ordenar listas numeradas estilizadas en tu bloc de notas favorito o en Notion.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Alert Notifications */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-55 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-gray-800"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bio Editor Modal overlay */}
      <AnimatePresence>
        {editingBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  <div>
                    <h3 className="font-sans font-bold text-base leading-none">Creador & Editor de Bios</h3>
                    <p className="text-[10px] text-blue-100 mt-1">Personaliza tu plantilla en tiempo real</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingBio(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Plantilla seleccionada:
                  </label>
                  <p className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-block font-sans">
                    {editingBio.title}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Contenido editable de la Bio:
                  </label>
                  <textarea
                    value={editingBio.content}
                    onChange={(e) => setEditingBio({ ...editingBio, content: e.target.value })}
                    rows={6}
                    placeholder="Escribe tu bio o frase aquí..."
                    className="w-full bg-gray-50 border border-gray-250 focus:border-blue-500 rounded-2xl p-4 text-xs font-mono leading-relaxed resize-y focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                  <p className="text-[9px] text-gray-450 mt-1">
                    Puedes escribir texto normal y luego convertir palabras utilizando los botones rápidos de abajo.
                  </p>
                </div>

                {/* Helper tool to inject bubbles inside the active editor field */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Herramientas de conversión rápida en círculos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const selected = window.getSelection()?.toString();
                        if (selected) {
                          const converted = bubbleWhiteFont?.generate(selected) || selected;
                          setEditingBio({
                            ...editingBio,
                            content: editingBio.content.replace(selected, converted)
                          });
                          showToast("¡Texto seleccionado convertido a burbuja blanca! ⓐ");
                        } else {
                          // convert entire content
                          const converted = bubbleWhiteFont?.generate(editingBio.content) || editingBio.content;
                          setEditingBio({
                            ...editingBio,
                            content: converted
                          });
                          showToast("¡Toda tu bio convertida a burbuja blanca! ⓐ");
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-[10px] cursor-pointer transition-colors"
                      title="Convierte la palabra seleccionada o todo el texto"
                    >
                      Convertir a ⓐⓑⓒ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selected = window.getSelection()?.toString();
                        if (selected) {
                          const converted = bubbleBlackFont?.generate(selected) || selected;
                          setEditingBio({
                            ...editingBio,
                            content: editingBio.content.replace(selected, converted)
                          });
                          showToast("¡Texto seleccionado convertido a burbuja negra! ❶");
                        } else {
                          // convert entire content
                          const converted = bubbleBlackFont?.generate(editingBio.content) || editingBio.content;
                          setEditingBio({
                            ...editingBio,
                            content: converted
                          });
                          showToast("¡Toda tu bio convertida a burbuja negra! ❶");
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[10px] cursor-pointer transition-colors"
                      title="Convierte la palabra seleccionada o todo el texto"
                    >
                      Convertir a ❶❷❸
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4.5 border-t border-gray-150 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => saveFavorite(editingBio.content, `Bio: ${editingBio.title}`)}
                  className="px-4 py-2.5 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 text-rose-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                  title="Guardar diseño de bio"
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorito</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCopy("editing_bio", editingBio.content);
                    setEditingBio(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-blue-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-103"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar & Cerrar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
