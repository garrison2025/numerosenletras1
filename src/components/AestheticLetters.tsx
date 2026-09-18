import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AESTHETIC_FONTS } from "../utils/fontGenerators";
import { canUsePreferenceStorage } from "../utils/storageConsent";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Flame, 
  Heart, 
  Search,
  Instagram,
  CheckSquare,
  Smile,
  Dices,
  Trash2,
  Plus,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Quote,
  Share2,
  Star,
  Edit3,
  Wand2
} from "lucide-react";

// Symbol injector categories
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
  },
  {
    id: "arrows",
    label: "➔ Flechas / Bordes",
    symbols: ["➔", "➘", "➙", "➚", "➛", "➜", "➞", "➟", "༺", "༻", "〖", "〗", "〘", "〙", "〔", "〕", "【", "】", "«", "»"]
  },
  {
    id: "music",
    label: "♫ Música / Notas",
    symbols: ["♫", "♬", "♪", "♩", "♭", "♮", "♯", "✉", "✍", "✎", "✏", "✐", "⚔", "🛡", "⚙", "⛓", "⚓", "👑"]
  },
  {
    id: "sparkles_shapes",
    label: "✧ Brillos / Figuras",
    symbols: ["✧", "✦", "❈", "❉", "❊", "❃", "❂", "❄", "❅", "❆", "♠", "♥", "♦", "♣", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅", "♾", "☯", "☮"]
  }
];

// Aesthetic Adjectives & Nouns for Random Nickname Generation
const RANDOM_AESTHETIC_ADJECTIVES = [
  "Cosmic", "Dreamy", "Shadow", "Sweet", "Cherry", "Cyber", "Kawaii", "Luna", "Baby", "Savage",
  "Toxic", "Golden", "Midnight", "Mystic", "Spooky", "Fluffy", "Silent", "Neon", "Vintage",
  "Pastel", "Soft", "Dark", "Angel", "Devil", "Fairy", "Wild", "Glitch", "Retro", "Magic"
];

const RANDOM_AESTHETIC_NOUNS = [
  "Girl", "Boy", "Queen", "King", "Sniper", "Lover", "Gamer", "Ghost", "Moon", "Star",
  "Cloud", "Butterfly", "Sakura", "Cat", "Puppy", "Neko", "Angel", "Demon", "Babe", "Princess",
  "Heart", "Soul", "Vibe", "Aura", "Doll", "Fairy", "Witch", "Panda", "Ninja", "Wolf"
];

const RANDOM_AESTHETIC_DECOS = [
  { prefix: "⚡ ", suffix: " ⚡" },
  { prefix: "✿ ", suffix: " ✿" },
  { prefix: "𓆩♡𓆪 ", suffix: " 𓆩♡𓆪" },
  { prefix: "★彡 ", suffix: " 彡★" },
  { prefix: "✧ ", suffix: " ✧" },
  { prefix: "☾ ", suffix: " ☽" },
  { prefix: "𐙚 ", suffix: " 𐙚" },
  { prefix: "•´¯`•. ", suffix: " .•´¯`•" }
];

// Custom text decoration frames
const DECORATOR_TEMPLATES = [
  { id: "dec1", template: (text: string) => `𓆩♡𓆪 ${text} 𓆩♡𓆪`, label: "Corazón Elegante" },
  { id: "dec2", template: (text: string) => `★彡 ${text} 彡★`, label: "Estrellas Fugaces" },
  { id: "dec3", template: (text: string) => `✧*̥˚ ${text} *̥˚✧`, label: "Brillo de Estrellas" },
  { id: "dec4", template: (text: string) => "•´¯\`•. " + text + " .•´¯\`•.", label: "Onda Clásica" },
  { id: "dec5", template: (text: string) => `╰┈➤ ❝ ${text} ❞`, label: "Flecha Indicadora" },
  { id: "dec6", template: (text: string) => `°•. ✿ .•° ${text} °•. ✿ .•°`, label: "Borde de Flor" },
  { id: "dec7", template: (text: string) => `🍒 ─── ${text} ─── 🍒`, label: "Líneas de Cereza" },
  { id: "dec8", template: (text: string) => `░▒▓█ ${text} █▓▒░`, label: "Caja Retro" }
];

// Advanced tabbed bio templates
const DETAILED_BIO_PRESETS = {
  social: [
    {
      name: "Cosmic Soul",
      preview: "✨ 𝒲𝑒𝓁𝒸𝑜𝓂𝑒 𝓉𝑜 𝓂𝓎 𝓌𝑜𝓇𝓁 d ✨\n🌙 ᶜᵒˢᵐⁱᶜ ˢᵒᵘˡ • 2026\n🌿 𝒩𝒶𝓉𝓊𝓇𝑒 𝓁𝑜𝓋𝑒𝓇\n💌 DM para Colaboraciones",
      raw: "✨ 𝒲𝑒𝓁𝒸𝑜𝓂𝑒 𝓉𝑜 𝓂𝓎 𝓌𝑜𝓇𝓁 d ✨\n🌙 ᶜᵒˢᵐⁱᶜ ˢᵒᵘˡ • 2026\n🌿 𝒩𝒶𝓉𝓊𝓇𝑒 𝓁𝑜𝓋𝑒𝓇\n💌 DM para Colaboraciones"
    },
    {
      name: "Soft & Pastel",
      preview: "🧸 𝓂𝓎 𝓁𝒾𝒻𝑒, 𝓂𝓎 𝓇𝓊𝓁𝑒𝓈 🌸\n🍡 𝓴𝓪𝔀𝓪𝓲𝓲_𝓿𝓲𝓫𝓮𝓼\n🏹 ꜱɪᴍᴘʟᴇ ɢɪʀʟ\n✨ Sigue tu propio camino",
      raw: "🧸 𝓂𝓎 𝓁𝒾𝒻𝑒, 𝓂𝓎 𝓇𝓊𝓁𝑒𝓈 🌸\n🍡 𝓴𝓪𝔀𝓪𝓲𝓲_𝓿𝓲𝓫𝓮𝓼\n🏹 ꜱɪᴍᴘʟᴇ ɢɪʀʟ\n✨ Sigue tu propio camino"
    },
    {
      name: "Minimalist Dark",
      preview: "⚡︎ 𝙆𝙚𝙚𝙥 𝙞𝙩 𝙨𝙞𝙢𝙥𝙡𝙚.\n🖤 ᵈᵃʳᵏ ᵐᵒᵒᵈ ᵒⁿ\n☕︎ Coffee addict\n✈︎ Viajando por el mundo",
      raw: "⚡︎ 𝙆𝙚𝙚𝙥 𝙞𝙩 𝙨𝙞𝙢𝙥𝙡𝙚.\n🖤 ᵈᵃʳᵏ ᵐᵒᵒᵈ ᵒⁿ\n☕︎ Coffee addict\n✈︎ Viajando por el mundo"
    }
  ],
  gaming: [
    {
      name: "Sniper King",
      preview: "⚔️ 𓆩 𝕾𝖓𝖎𝖕𝖊𝖗 𓆪 ⚔️\n🔥 [ K I L L E R ]\n🏆 Ranked: Heroic\n🎮 No pain, no gain",
      raw: "⚔️ 𓆩 𝕾𝖓𝖎𝖕𝖊𝖗 𓆪 ⚔️\n🔥 [ K I L L E R ]\n🏆 Ranked: Heroic\n🎮 No pain, no gain"
    },
    {
      name: "Pro Gamer Girl",
      preview: "✿ 𝒫𝓇𝒾𝓃𝒸𝑒𝓈𝓈_𝒢𝒶𝓂𝑒𝓇 ✿\n🔫 Headshot Queen\n👑 Clan Leader\n✨ 𝒩𝑒𝓋𝑒𝓇 𝑔𝒾𝓋𝑒 𝓊𝓅!",
      raw: "✿ 𝒫𝓇𝒾𝓃𝒸𝑒𝓈𝓈_𝒢𝒶𝓂𝑒𝓇 ✿\n🔫 Headshot Queen\n👑 Clan Leader\n✨ 𝒩𝑒𝓋𝑒𝓇 𝑔𝒾𝓋𝑒 𝓊𝓅!"
    },
    {
      name: "Clásico Clan",
      preview: "⚡️ 𝕿𝖔𝖝𝖎𝖈_𝕭𝖔𝖞 ⚡️\n🔥 Level 99\n🎮 Roblox & FF\n💀 Te veo en el lobby",
      raw: "⚡️ 𝕿𝖔𝖝𝖎𝖈_𝕭𝖔𝖞 ⚡️\n🔥 Level 99\n🎮 Roblox & FF\n💀 Te veo en el lobby"
    }
  ],
  quotes: [
    {
      name: "Sueño Cósmico",
      preview: "☾ s⃟u⃟e⃟ñ⃟o⃟s⃟ s⃟i⃟n⃟ f⃟i⃟n⃟ ✩\n✨ La luna sabe de nosotros.\n🪐 Hecho de polvo de estrellas\n💫 Vive el presente",
      raw: "☾ s⃟u⃟e⃟ñ⃟o⃟s⃟ s⃟i⃟n⃟ f⃟i⃟n⃟ ✩\n✨ La luna sabe de nosotros.\n🪐 Hecho de polvo de estrellas\n💫 Vive el presente"
    },
    {
      name: "Pensamientos Libres",
      preview: "☕︎ 𝔓𝔢𝔫𝔰𝔞𝖒𝔦𝔢𝔫𝔱𝔬𝔰 𝔳𝔲𝔢𝔩𝔞𝔫... 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 Sé tu propio sol.",
      raw: "☕︎ 𝔓𝔢𝔫𝔰𝔞𝖒𝔦𝔢𝔫𝔱𝔬𝔰 𝔳𝔲𝔢𝔩𝔞𝔫... 🍃\n❀ Menos es más.\n⌛︎ El tiempo cura todo.\n🌸 Sé tu propio sol."
    },
    {
      name: "Vibras Positivas",
      preview: "🦋 𝒱𝒾𝒷𝓇𝒶𝓈 𝓅𝑜𝓈𝒾𝓉𝒾𝓋𝒶𝓈 𝓈𝒾𝑒𝓂𝓅𝓇𝑒 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ Abundancia y paz",
      raw: "🦋 𝒱𝒾𝒷𝓇𝒶𝓈 𝓅𝑜𝓈𝒾𝓉𝒾𝓋𝒶𝓈 𝓈𝒾𝑒𝓂𝓅𝓇𝑒 🦋\n🌈 Sonríe hoy.\n🧸 Todo pasa por algo.\n✨ Abundancia y paz"
    }
  ]
};

export default function AestheticLetters({ initialText }: { initialText?: string }) {
  const [inputText, setInputText] = useState(initialText || "Letras Bonitas 2026");

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

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pequenas' | 'aesthetic'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbolTab, setSelectedSymbolTab] = useState("stars");
  const [activeBioTab, setActiveBioTab] = useState<'social' | 'gaming' | 'quotes'>('social');
  
  // Custom user experience optimizations
  const [textCase, setTextCase] = useState<'normal' | 'upper' | 'lower'>('normal');
  const [normalizeAccents, setNormalizeAccents] = useState(true);
  const [fontSize, setFontSize] = useState<number>(20);

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

  // Favorites system state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      if (!canUsePreferenceStorage()) {
        return [];
      }
      const stored = localStorage.getItem("aesthetic_favorites");
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
        const stored = localStorage.getItem("aesthetic_favorites");
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

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!canUsePreferenceStorage()) {
      showToast("Activa las preferencias de privacidad para guardar favoritos");
      window.dispatchEvent(new Event("open-cookie-settings"));
      return;
    }

    const isFav = favorites.includes(id);
    const newFavs = isFav ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    try {
      localStorage.setItem("aesthetic_favorites", JSON.stringify(newFavs));
    } catch (err) {
      // Ignore
    }
    showToast(isFav ? "Estilo eliminado de favoritos 🤍" : "Estilo guardado en tus favoritos 💖");
  };

  // Custom decorator builder state
  const [customPrefix, setCustomPrefix] = useState("༺★");
  const [customSuffix, setCustomSuffix] = useState("★༻");
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  // Editing Bio preset
  const [editingBio, setEditingBio] = useState<{ name: string; raw: string } | null>(null);

  // Helper to pre-process and optimize input text for maximum font mapping compatibility
  const getTransformedText = (text: string) => {
    let result = text;
    
    if (textCase === "upper") {
      result = result.toUpperCase();
    } else if (textCase === "lower") {
      result = result.toLowerCase();
    }
    
    if (normalizeAccents) {
      result = result
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Normalizes á -> a, é -> e, etc.
        .replace(/ñ/g, "n")              // Maps ñ to n
        .replace(/Ñ/g, "N");
    }
    
    return result;
  };

  const processedText = getTransformedText(inputText);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`¡Copiado!: "${text.length > 25 ? text.substring(0, 25) + '...' : text}" 📋✨`);
  };

  const handleInjectSymbol = (symbol: string) => {
    if (inputText.length + symbol.length > 100) return;
    
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
    const adj = RANDOM_AESTHETIC_ADJECTIVES[Math.floor(Math.random() * RANDOM_AESTHETIC_ADJECTIVES.length)];
    const noun = RANDOM_AESTHETIC_NOUNS[Math.floor(Math.random() * RANDOM_AESTHETIC_NOUNS.length)];
    const deco = RANDOM_AESTHETIC_DECOS[Math.floor(Math.random() * RANDOM_AESTHETIC_DECOS.length)];
    
    const formats = [
      `${adj}${noun}`,
      `${adj}_${noun}`,
      `${adj.toLowerCase()}.${noun.toLowerCase()}`,
      `${adj}${noun}777`
    ];
    const baseName = formats[Math.floor(Math.random() * formats.length)];
    const finalNick = `${deco.prefix}${baseName}${deco.suffix}`;
    setInputText(finalNick);
  };

  const handleClear = () => {
    setInputText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Filter fonts
  const filteredFonts = AESTHETIC_FONTS.filter(font => {
    // Exclude bubble category from this page since bubble has its own dedicated page
    if (font.category === 'burbuja') return false;
    
    // Category tabs
    if (categoryFilter === 'pequenas' && font.category !== 'pequenas') return false;
    if (categoryFilter === 'aesthetic' && font.category !== 'aesthetic') return false;

    // Search input
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return font.name.toLowerCase().includes(query) || font.description.toLowerCase().includes(query);
    }
    
    return true;
  });

  return (
    <div className="relative max-w-4xl mx-auto text-left">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-20 -right-4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Converter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 sm:p-9 mb-10 relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-3xl" />
        
        {/* Decorative circle patterns */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-50/50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-50/50 rounded-full opacity-60 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Input text box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="aesthetic-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Escribe tu texto para tus letras aesthetic copiar y pegar o letras pequeñas:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateRandomNick}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 border border-purple-100 hover:border-purple-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Generar apodo o nick aleatorio aesthetic"
                >
                  <Dices className="w-3 h-3" />
                  <span>Nick Aleatorio</span>
                </button>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="text-[11px] font-bold text-gray-400 hover:text-rose-600 bg-gray-50 border border-gray-100 hover:border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                id="aesthetic-input"
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={100}
                placeholder="Ej. letras aesthetic copiar y pegar / letras pequeñas"
                className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-purple-500 focus:bg-white text-gray-950 placeholder-gray-400 font-sans font-bold text-lg sm:text-2xl rounded-2xl pl-5 pr-28 py-4.5 outline-hidden transition-all duration-300 shadow-sm focus:shadow-md focus:ring-4 focus:ring-purple-500/5"
              />
              <span className="absolute right-4 bottom-4.5 font-mono text-[10px] text-gray-400 font-bold">
                {inputText.length}/100
              </span>
            </div>

            {/* Quick formatting toolbar */}
            <div className="mt-3.5 bg-purple-50/45 border border-purple-100/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Left Side: Case & Accents */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ajustes:</span>
                
                {/* Text Case Selector */}
                <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200 text-[11px] font-bold">
                  {[
                    { key: 'normal', label: 'Normal' },
                    { key: 'upper', label: 'MAYÚS' },
                    { key: 'lower', label: 'minús' }
                  ].map((tc) => (
                    <button
                      key={tc.key}
                      type="button"
                      onClick={() => setTextCase(tc.key as any)}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        textCase === tc.key 
                          ? "bg-white text-purple-700 shadow-xs" 
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {tc.label}
                    </button>
                  ))}
                </div>

                {/* Normalize Accents Switch */}
                <button
                  type="button"
                  onClick={() => setNormalizeAccents(!normalizeAccents)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    normalizeAccents
                      ? "bg-purple-100/80 border-purple-200 text-purple-800"
                      : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
                  }`}
                  title="Convierte caracteres especiales (á, é, í, ó, ú, ñ) para que funcionen perfectamente en todas las fuentes artísticas."
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${normalizeAccents ? "bg-purple-600 animate-pulse" : "bg-gray-400"}`} />
                  Quitar Acentos / Ñ
                </button>
              </div>

              {/* Right Side: Font Size Slider */}
              <div className="flex items-center gap-3 bg-white/80 px-3 py-1.5 rounded-xl border border-gray-200/80">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Pre-visualización:</span>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-purple-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-purple-700 shrink-0 min-w-[32px] text-right">{fontSize}px</span>
              </div>
            </div>
          </div>

          {/* Symbols Inserter Box (Aesthetic Symbols Panel) */}
          <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-purple-500" />
                Decora tus textos con símbolos:
              </span>
            </div>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-gray-200/60 pb-2.5 mb-3">
              {SYMBOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSymbolTab(cat.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedSymbolTab === cat.id
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Symbols grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {SYMBOL_CATEGORIES.find(c => c.id === selectedSymbolTab)?.symbols.map((sym, i) => (
                <button
                  key={i}
                  onClick={() => handleInjectSymbol(sym)}
                  className="h-9 rounded-lg bg-white hover:bg-gray-50 border border-gray-200/60 hover:border-purple-400/50 flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-gray-950 transition-all cursor-pointer hover:scale-105 active:scale-90"
                  title={`Insertar ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Decorator Wizard Panel */}
          <div className="bg-purple-50/20 border border-purple-150 rounded-2xl p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setIsCustomExpanded(!isCustomExpanded)}
              className="w-full flex items-center justify-between text-left cursor-pointer group focus:outline-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
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
              <div className="text-purple-600 group-hover:text-purple-800 transition-colors">
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
                  <div className="pt-4 border-t border-purple-100/60 mt-4 space-y-4">
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
                            placeholder="Ej. ༺★"
                            className="w-full bg-white border border-gray-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs font-sans font-bold shadow-2xs"
                          />
                        </div>
                        {/* Quick preset symbols for left */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {["༺", "★彡", "𓆩♡𓆪", "✧*̥˚", "•´¯`•.", "⚡", "°•. ✿ .•°", "╰-➤"].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setCustomPrefix(sym)}
                              className="text-[10px] bg-white hover:bg-purple-50 border border-gray-150 hover:border-purple-300 rounded px-1.5 py-0.5 font-bold cursor-pointer transition-all active:scale-95 text-gray-600"
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
                            placeholder="Ej. ★༻"
                            className="w-full bg-white border border-gray-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs font-sans font-bold shadow-2xs"
                          />
                        </div>
                        {/* Quick preset symbols for right */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {["༻", "彡★", "𓆩♡𓆪", "*̥˚✧", ".•´¯`•", "⚡", "°•. ✿ .•°", "❝"].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setCustomSuffix(sym)}
                              className="text-[10px] bg-white hover:bg-purple-50 border border-gray-150 hover:border-purple-300 rounded px-1.5 py-0.5 font-bold cursor-pointer transition-all active:scale-95 text-gray-600"
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Output display for custom decorators */}
                    <div className="bg-purple-100/35 border border-purple-200/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="text-left w-full sm:w-auto">
                        <span className="block text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-0.5">
                          Resultado de tu Diseño
                        </span>
                        <span className="font-sans font-extrabold text-base text-gray-900 break-all select-all block">
                          {customPrefix} {processedText || "Ejemplo"} {customSuffix}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("custom_dec", `${customPrefix} ${processedText || "Ejemplo"} ${customSuffix}`)}
                        className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-purple-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-103"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Decoración</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter controls and Search inside generator */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-gray-150">
            <div className="flex bg-gray-100/85 p-1.5 rounded-2xl border border-gray-200/50 w-full sm:w-auto">
              {[
                { key: 'all', label: 'Todas las Letras' },
                { key: 'pequenas', label: 'Letras Pequeñas' },
                { key: 'aesthetic', label: 'Letras Aesthetic' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCategoryFilter(tab.key as any)}
                  className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-300 cursor-pointer ${
                    categoryFilter === tab.key 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar letras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-hidden transition-all duration-300 shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Dynamic Text Decorators Grid - Marcos y Bordes con tu texto */}
      {processedText.trim() && (
        <div className="mb-10 text-left">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Bordes y adornos para tus letras aesthetic copiar y pegar y letras pequeñas
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DECORATOR_TEMPLATES.map((item) => {
              const decoratedVal = item.template(processedText.trim());
              const isCopied = copiedId === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-between hover:border-purple-200 hover:shadow-md transition-all duration-200"
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
                    className={`ml-3 shrink-0 p-2.5 rounded-xl transition-all cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200"
                    }`}
                    title="Copiar texto con este adorno"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1.5 Pinned Favorite Styles Section */}
      {favorites.length > 0 && (
        <div className="mb-10 text-left border-t border-purple-100/50 pt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-sans font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Mis Fuentes Favoritas ({favorites.length})</span>
            </h3>
            <button
              onClick={() => {
                setFavorites([]);
                try {
                  localStorage.removeItem("aesthetic_favorites");
                } catch (e) {}
                showToast("Todos los favoritos han sido eliminados 🗑️");
              }}
              className="text-[10px] font-bold text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Eliminar todos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AESTHETIC_FONTS.filter(font => favorites.includes(font.id)).map((font) => {
              const generatedVal = processedText.trim() ? font.generate(processedText) : font.generate("Ejemplo");
              const isCopied = copiedId === `fav_${font.id}`;

              return (
                <div
                  key={`fav_${font.id}`}
                  className="bg-radial from-amber-50/20 to-white hover:to-amber-50/10 rounded-2xl p-5 text-left border border-amber-200/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans font-bold text-xs text-amber-800 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {font.name}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(font.id, e)}
                        className="p-1 rounded-lg hover:bg-amber-100/50 text-amber-500 hover:text-gray-400 transition-colors cursor-pointer"
                        title="Quitar de favoritos"
                      >
                        <Heart className="w-4 h-4 fill-amber-500 text-amber-500 stroke-none" />
                      </button>
                    </div>

                    <p
                      className="font-sans font-bold text-gray-900 py-2 select-all break-all tracking-wide min-h-[48px]"
                      style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
                    >
                      {generatedVal}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-amber-100/50">
                    <span className="text-[10px] text-gray-400 font-sans truncate pr-2 font-medium">
                      {font.description}
                    </span>

                    <button
                      onClick={() => handleCopy(`fav_${font.id}`, generatedVal)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-500/10`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Main Fonts List Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold">Catálogo de Letras Aesthetic Copiar y Pegar y Letras Pequeñas</span>
          <span className="text-[11px] text-purple-600 font-sans flex items-center gap-1 font-semibold">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Letras aesthetic copiar y pegar y letras pequeñas al instante
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFonts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-150 shadow-xs">
              <p className="text-gray-400 text-sm font-sans">No se encontraron estilos para "{searchQuery}"</p>
            </div>
          ) : (
            filteredFonts.map((font) => {
              const generatedVal = processedText.trim() ? font.generate(processedText) : font.generate("Ejemplo");
              const isCopied = copiedId === font.id;
              const isPequena = font.category === 'pequenas';

              return (
                <div
                  key={font.id}
                  className={`bg-white hover:bg-white rounded-2xl p-5 text-left border transition-all duration-300 flex flex-col justify-between ${
                    isPequena 
                      ? "border-purple-300 shadow-md shadow-purple-500/5 hover:border-purple-400 hover:shadow-lg" 
                      : "border-gray-150 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans font-bold text-xs text-gray-400 flex items-center gap-1.5">
                        {isPequena && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
                        {font.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isPequena && (
                          <span className="text-[9px] bg-purple-50 border border-purple-150 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">
                            Letras Pequeñas (Popular)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(font.id, e)}
                          className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title={favorites.includes(font.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(font.id) ? "fill-rose-500 text-rose-500 stroke-none" : "text-gray-400"}`} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Generated Text Row */}
                    <p 
                      className="font-sans font-bold text-gray-900 py-2 select-all break-all tracking-wide min-h-[48px]"
                      style={{ fontSize: `${fontSize}px`, lineHeight: "1.3" }}
                    >
                      {generatedVal}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-sans truncate pr-2 font-medium">
                      {font.description}
                    </span>
                    
                    <button
                      onClick={() => handleCopy(font.id, generatedVal)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 ${
                        isCopied 
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                          : isPequena
                            ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/15"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-750"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Bio Preset Templates with Tabs */}
      <div className="mt-14 space-y-6 text-left border-t border-gray-150 pt-10">
        
        {/* Bio Presets Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-7 shadow-xl shadow-gray-100/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
            <h3 className="font-sans font-bold text-gray-900 text-lg flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500 animate-pulse" />
              <span>Plantillas de Letras Aesthetic y Letras Pequeñas para Bios</span>
            </h3>
            
            {/* Tabs */}
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/60 w-full sm:w-auto">
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
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/25" 
                        : "text-gray-500 hover:text-gray-850"
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
            {DETAILED_BIO_PRESETS[activeBioTab].map((preset, idx) => {
              const isCopied = copiedId === preset.name;
              return (
                <div key={idx} className="bg-gray-50/50 rounded-2xl p-4.5 border border-gray-200/60 hover:border-purple-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <pre className="text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed min-h-[90px] text-left">
                    {preset.preview}
                  </pre>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingBio({ name: preset.name, raw: preset.raw })}
                      className="py-2 bg-purple-50 hover:bg-purple-100 border border-purple-150 text-purple-700 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1 hover:scale-102 active:scale-95"
                      title="Editar y personalizar la biografía"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(preset.name, preset.raw)}
                      className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 hover:scale-102 active:scale-95 ${
                        isCopied 
                          ? "bg-emerald-600 text-white" 
                          : "bg-white border border-gray-200 hover:border-purple-200 text-gray-500 hover:text-purple-700"
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "¡Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Bio Customizer Modal Overlay */}
        <AnimatePresence>
          {editingBio && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col relative"
              >
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <h4 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-purple-600" />
                    <span>Personalizar Biografía: {editingBio.name}</span>
                  </h4>
                  <button
                    onClick={() => setEditingBio(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-gray-500 font-medium">
                    Modifica las líneas de abajo para adaptar la biografía a tu gusto. Puedes escribir tu nombre, redes o usar el botón para inyectar tu texto actual.
                  </p>

                  <textarea
                    value={editingBio.raw}
                    onChange={(e) => setEditingBio({ ...editingBio, raw: e.target.value })}
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-purple-500 rounded-2xl p-4 text-xs font-sans text-gray-800 leading-relaxed outline-hidden focus:ring-4 focus:ring-purple-500/5 shadow-inner"
                    placeholder="Escribe tu biografía aquí..."
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentTxt = processedText.trim() || "Letras Lindas";
                        let newRaw = editingBio.raw;
                        if (newRaw.includes("Cosmic Soul")) {
                          newRaw = newRaw.replace("Cosmic Soul", currentTxt);
                        } else if (newRaw.includes("🧸 my life, my rules 🌸")) {
                          newRaw = newRaw.replace("🧸 my life, my rules 🌸", `🧸 ${currentTxt} 🌸`);
                        } else {
                          newRaw = newRaw + `\n✨ ${currentTxt}`;
                        }
                        setEditingBio({ ...editingBio, raw: newRaw });
                        showToast("¡Texto inyectado en tu plantilla! 🪄");
                      }}
                      className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Inyectar mi texto: "{processedText.trim() || "Letras Lindas"}"</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 border-t border-gray-100 pt-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingBio(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopy("custom_bio", editingBio.raw);
                      setEditingBio(null);
                    }}
                    className="px-4.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-purple-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Biografía</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Premium Floating Toast Notifications */}
        <AnimatePresence>
          {toastVisible && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-2xl px-5 py-3.5 flex items-center space-x-3 shadow-2xl border border-gray-800/80 max-w-sm w-11/12 md:w-auto"
            >
              <div className="flex items-center justify-center bg-emerald-500/20 text-emerald-400 p-1 rounded-full shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-gray-100 select-none block truncate">
                {toastMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
