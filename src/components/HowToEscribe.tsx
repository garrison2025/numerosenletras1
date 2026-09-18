import { useState, useEffect } from "react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles,
  Award,
  HelpCircle,
  FileText,
  Copy,
  Check,
  CheckCircle,
  Hash,
  ListOrdered,
  AlertCircle,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  q: string;
  a: string;
  keyword: string;
}

interface CommonNumLink {
  num: number;
  label: string;
  text: string;
}

// Robust parser supporting Spanish dot/comma styles and American styles
function parseSpanishNumber(str: string): number {
  let cleaned = str.trim();
  if (!cleaned) return NaN;
  
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  
  if (lastComma > lastDot) {
    // Comma is the decimal separator. Remove dots, replace comma with dot.
    cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
  } else if (lastDot > lastComma) {
    // Dot is the decimal separator. Remove commas.
    cleaned = cleaned.replace(/,/g, "");
  } else {
    // Only one separator type or none.
    if (cleaned.includes(",") && !cleaned.includes(".")) {
      cleaned = cleaned.replace(/,/g, ".");
    }
  }
  return parseFloat(cleaned);
}

const CURRENCY_PRESETS = [
  { id: "pesos", label: "Pesos ($)", name: "pesos", cent: "centavos" },
  { id: "euros", label: "Euros (€)", name: "euros", cent: "céntimos" },
  { id: "dolares", label: "Dólares ($)", name: "dólares", cent: "centavos" },
  { id: "soles", label: "Soles (S/.)", name: "soles", cent: "céntimos" },
  { id: "custom", label: "Personalizado ✎", name: "", cent: "" }
];

// Helper to convert integer (1-3999) to Roman Numerals
function toRoman(num: number): string {
  if (num < 1 || num > 3999) return "Solo disponible para rango 1 a 3,999";
  const romanMap: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = "";
  let remaining = num;
  for (const [val, char] of romanMap) {
    while (remaining >= val) {
      result += char;
      remaining -= val;
    }
  }
  return result;
}

// Helper to convert integer (1-100) to Spanish Ordinal words
function toOrdinal(num: number): string {
  if (num < 1 || num > 100) return "Solo disponible para rango 1 a 100";
  const ordinals1_9 = ["", "primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno"];
  const ordinals10_90 = ["", "décimo", "vigésimo", "trigésimo", "cuadragésimo", "quincuagésimo", "sexagésimo", "septuagésimo", "octogésimo", "nonagésimo"];
  
  if (num === 100) return "centésimo";
  
  const t = Math.floor(num / 10);
  const u = num % 10;
  
  let result = "";
  if (t > 0) result += ordinals10_90[t];
  if (u > 0) result += (result ? " " : "") + ordinals1_9[u];
  
  return result;
}

// RAE Golden Rules Generator
function getSpellingRule(num: number): string {
  if (num === 0) {
    return "Se escribe como 'cero'. Gramaticalmente es un sustantivo masculino cuyo plural es 'ceros'. No tiene valor cardinal de cantidad sino de ausencia.";
  }
  if (num >= 1 && num <= 15) {
    return "Los números del 1 al 15 se escriben siempre con una sola palabra propia y única heredada del latín ('uno', 'once', 'quince'...).";
  }
  if (num >= 16 && num <= 19) {
    return "Se escriben refundidos en una sola palabra: fusión de la decena 'diez' con la unidad mediante la letra 'i' ('dieciséis', 'dieciocho'). Lleva tilde obligatoria en la última vocal si es palabra aguda terminada en s o vocal (como 'dieciséis').";
  }
  if (num === 20) {
    return "Se escribe como 'veinte'. Al formar combinaciones decimales, pierde su última vocal 'e' y se une como el prefijo 'veinti-' (ej. 'veintitrés').";
  }
  if (num >= 21 && num <= 29) {
    return "¡Regla especial! Los números del 21 al 29 se escriben SIEMPRE unidos en una sola palabra (ej: 'veintidós', 'veintiocho'). Además, recuerda acentuar ortográficamente 'veintidós', 'veintitrés' y 'veintiséis' por ser palabras agudas.";
  }
  if (num === 30) {
    return "Se escribe como 'treinta' de forma individual.";
  }
  if (num >= 31 && num <= 99) {
    const u = num % 10;
    if (u === 0) {
      return "Las decenas puras (30, 40, 50, 60, 70, 80, 90) se escriben con una sola palabra de forma compacta (ej: 'cuarenta', 'ochenta').";
    }
    return "¡Aviso de separación! A partir del 31, todas las decenas unidas a unidades se deben escribir por separado utilizando la conjunción 'y' (ej: 'treinta y uno', 'ochenta y siete'). No intentes unirlos en una sola palabra.";
  }
  if (num === 100) {
    return "Se escribe exactamente como 'cien' cuando es exacto. Cambia a 'ciento' si va seguido de cualquier cifra menor (ej. 'ciento uno', 'ciento cincuenta').";
  }
  if (num > 100 && num < 1000) {
    return "En los centenares (101-999) hay concordancia de género con el sustantivo que acompañan (ej: 'trescientos libros' masculino / 'trescientas libretas' femenino). Nota: 'quinientos', 'setecientos' y 'novecientos' tienen raíces irregulares.";
  }
  if (num === 1000) {
    return "Se escribe como 'mil'. La RAE aconseja no anteponer el determinante 'un' ('un mil' se considera redundante en el habla ordinaria, aunque se acepta en cheques financieros para evitar fraudes).";
  }
  if (num > 1000 && num < 1000000) {
    return "El millar funciona como un modificador invariable. Se escribe el número de millares seguido de la palabra 'mil' por separado (ej: 'cinco mil', 'veintiún mil').";
  }
  if (num >= 1000000) {
    return "¡Millones son sustantivos! La palabra 'millón' es un sustantivo masculino. Lleva tilde en singular ('un millón') pero pierde la tilde en plural ('dos millones'). Recuerda insertar la preposición 'de' si acompaña a un sustantivo sin más cifras menores (ej: 'un millón de euros').";
  }
  return "Consulte las reglas generales de concordancia de género y números según la Real Academia Española (RAE).";
}

interface QuizQuestion {
  num: number;
  answer: string;
  tip: string;
}

function generateDynamicQuestions(): QuizQuestion[] {
  const categories = [
    // Cat 1: 16-19 (Agudas con/sin tilde)
    () => {
      const nums = [16, 17, 18, 19];
      const num = nums[Math.floor(Math.random() * nums.length)];
      return {
        num,
        answer: convertNumberToLetters(num, { gender: 'M' }).toLowerCase(),
        tip: num === 16 
          ? "Se escribe en una sola palabra ('dieci-') y lleva tilde en la última 'e' ('dieciséis') por ser palabra aguda terminada en 's'." 
          : `Se escribe refundido en una sola palabra: fusión de diez y la unidad ('dieciocho', 'diecisiete', 'diecinueve').`
      };
    },
    // Cat 2: 21-29 (Agudas con tilde: 22, 23, 26; o sin tilde: 21, 24, 25, 27, 28, 29)
    () => {
      const nums = [21, 22, 23, 24, 25, 26, 28, 29];
      const num = nums[Math.floor(Math.random() * nums.length)];
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "Los números de la década del 20 se escriben en una sola palabra unificada ('veinti-').";
      if (num === 22) tip += " Lleva tilde en la 'o' ('veintidós') por ser palabra aguda terminada en 's'.";
      else if (num === 23) tip += " Lleva tilde en la 'e' ('veintitrés') por ser palabra aguda terminada en 's'.";
      else if (num === 26) tip += " Lleva tilde en la 'e' ('veintiséis') por ser palabra aguda terminada en 's'.";
      else if (num === 21) tip += " Se escribe 'veintiuno' cuando se cuenta de forma aislada, o 'veintiún' antes de un sustantivo masculino.";
      else tip += " No lleva tilde porque es una palabra llana terminada en vocal ('veinticuatro', 'veintiocho').";
      return { num, answer, tip };
    },
    // Cat 3: Decenas y unidades separadas (31-99)
    () => {
      const tens = [30, 40, 50, 60, 70, 80, 90];
      const units = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const t = tens[Math.floor(Math.random() * tens.length)];
      const u = units[Math.floor(Math.random() * units.length)];
      const num = t + u;
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      return {
        num,
        answer,
        tip: `A partir del número 31, las decenas y unidades se escriben obligatoriamente por separado unidas con la conjunción 'y' (ej. '${answer}'). Escribirlo todo junto es un error común.`
      };
    },
    // Cat 4: Irregularidades de centenas (500, 700, 900)
    () => {
      const num = [500, 700, 900][Math.floor(Math.random() * 3)];
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "";
      if (num === 500) tip = "¡Forma irregular absoluta! No se escribe 'cincocientos', sino 'quinientos'.";
      else if (num === 700) tip = "Irregularidad ortográfica: se escribe con 'e', no con 'ie' (setecientos, no 'sietecientos').";
      else if (num === 900) tip = "Irregularidad ortográfica: se escribe con 'o', no con 'ue' (novecientos, no 'nuevecientos').";
      return { num, answer, tip };
    },
    // Cat 5: Centenas normales (100, 200, 300, 400, 600, 800)
    () => {
      const nums = [100, 200, 300, 400, 600, 800];
      const num = nums[Math.floor(Math.random() * nums.length)];
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "";
      if (num === 100) tip = "Se escribe estrictamente 'cien' para la cantidad exacta. Se transforma en 'ciento' si va seguido de otras cifras menores (ej. ciento uno).";
      else tip = `Se escribe en una sola palabra uniendo la unidad con 'cientos' ('${answer}'). Recuerda la concordancia de género si acompaña a un sustantivo femenino (ej: doscientas).`;
      return { num, answer, tip };
    },
    // Cat 6: Centenas con decenas (e.g. 101, 105, 125, 116)
    () => {
      const remainders = [1, 5, 16, 22, 23, 35, 42];
      const rem = remainders[Math.floor(Math.random() * remainders.length)];
      const num = 100 + rem;
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      return {
        num,
        answer,
        tip: `Para cantidades superiores a 100, se usa la forma 'ciento' seguida de la escritura de la cifra restante ('${answer}').`
      };
    },
    // Cat 7: Millares (1000 o múltiplos)
    () => {
      const factors = [1, 2, 5, 10, 21, 30];
      const f = factors[Math.floor(Math.random() * factors.length)];
      const num = f * 1000;
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "El millar ('mil') es un adjetivo invariable en español.";
      if (f === 1) tip += " La RAE aconseja escribir simplemente 'mil', no 'un mil', ya que este último es redundante en la lengua general.";
      else if (f === 21) tip += " Se escribe 'veintiún mil' (con tilde) antes de mil, perdiendo la vocal final de veintiuno por apócope.";
      return { num, answer, tip };
    },
    // Cat 8: Millones (1,000,000 o múltiplos)
    () => {
      const factors = [1, 2, 3, 5, 10];
      const f = factors[Math.floor(Math.random() * factors.length)];
      const num = f * 1000000;
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "La palabra 'millón' o 'millones' es un sustantivo masculino, por lo que exige concordancia (un millón, dos millones).";
      if (f === 1) tip += " Se escribe con tilde en singular ('un millón') pero se escribe sin tilde en plural ('millones').";
      return { num, answer, tip };
    },
    // Cat 9: Números compuestos complejos (ej: 1525, 2315, 3450)
    () => {
      const pool = [1525, 2315, 3450, 5035, 10700, 21000];
      const num = pool[Math.floor(Math.random() * pool.length)];
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = `Para números compuestos, se van aplicando sucesivamente las reglas de cada orden de magnitud: millares, centenas, decenas y unidades ('${answer}').`;
      if (num === 21000) tip += " Note el uso de 'veintiún mil' con tilde en la 'u'.";
      return { num, answer, tip };
    },
    // Cat 10: Tricky cases (zero, or very specific numbers like 11, 12, 15)
    () => {
      const tricky = [0, 11, 12, 13, 14, 15];
      const num = tricky[Math.floor(Math.random() * tricky.length)];
      const answer = convertNumberToLetters(num, { gender: 'M' }).toLowerCase();
      let tip = "";
      if (num === 0) tip = "El cero es el nombre del número de valor nulo. Se escribe con 'c'.";
      else tip = `Los números del 11 al 15 tienen nombres propios independientes heredados directamente del latín ('${answer}').`;
      return { num, answer, tip };
    }
  ];

  const questions: QuizQuestion[] = categories.map(catFn => catFn());
  
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}

const QUIZ_QUESTIONS = [
  { num: 16, answer: "dieciséis", tip: "Se escribe en una sola palabra con 'c' (dieci-) y lleva tilde en la última 'e' por ser palabra aguda terminada en 's'." },
  { num: 22, answer: "veintidós", tip: "Se escribe en una sola palabra y lleva tilde en la 'o' por ser palabra aguda terminada en 's'." },
  { num: 23, answer: "veintitrés", tip: "Se escribe junto y lleva tilde en la 'e' por ser palabra aguda terminada en 's'." },
  { num: 26, answer: "veintiséis", tip: "Se escribe todo junto y lleva tilde en la 'e' por ser palabra aguda." },
  { num: 31, answer: "treinta y uno", tip: "A partir de 31, todas las decenas y unidades se separan con la conjunción 'y'." },
  { num: 45, answer: "cuarenta y cinco", tip: "Se escribe separado con la conjunción 'y'. Recuerda no unirlo como 'cuarentaycinco'." },
  { num: 500, answer: "quinientos", tip: "¡Forma irregular! No se escribe 'cincocientos', sino 'quinientos'." },
  { num: 700, answer: "setecientos", tip: "Se escribe con 'e', no con 'ie' (setecientos, no 'sietecientos')." },
  { num: 900, answer: "novecientos", tip: "Se escribe con 'o', no con 'ue' (novecientos, no 'nuevecientos')." },
  { num: 1000, answer: "mil", tip: "La RAE aconseja usar solo 'mil' en el lenguaje ordinario, el prefijo 'un' es redundante." }
];

export default function HowToEscribe({ 
  onSelectNumber 
}: { 
  onSelectNumber?: (num: string) => void 
}) {
  const [selectedSeoNum, setSelectedSeoNum] = useState<CommonNumLink | null>(null);
  
  // Interactive Live Checker states
  const [liveNumber, setLiveNumber] = useState<string>("24");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'rules' | 'ordinals' | 'romans' | 'sitemap' | 'quiz'>('rules');

  // Dynamic currency states
  const [selectedCurrency, setSelectedCurrency] = useState<string>("pesos");
  const [customCurrencyName, setCustomCurrencyName] = useState<string>("pesos");
  const [customCurrencyCentName, setCustomCurrencyCentName] = useState<string>("centavos");

  // Floating Toast alert state
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Quiz states
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    setCurrentQuestions(generateDynamicQuestions());
  }, []);

  const commonNumbers: CommonNumLink[] = [
    { num: 100, label: "cómo se escribe con letra el 100", text: "Cien" },
    { num: 125, label: "cómo se escribe con letra el 125", text: "Ciento veinticinco" },
    { num: 500, label: "cómo se escribe con letra el 500", text: "Quinientos" },
    { num: 750, label: "cómo se escribe con letra el 750", text: "Setecientos cincuenta" },
    { num: 1000, label: "cómo se escribe con letra el 1,000", text: "Mil" },
    { num: 1500, label: "cómo se escribe con letra el 1,500", text: "Mil quinientos" },
    { num: 2000, label: "cómo se escribe con letra el 2,000", text: "Dos mil" },
    { num: 5000, label: "cómo se escribe con letra el 5,000", text: "Cinco mil" },
    { num: 10000, label: "cómo se escribe con letra el 10,000", text: "Diez mil" },
    { num: 50000, label: "cómo se escribe con letra el 50,000", text: "Cincuenta mil" },
    { num: 100000, label: "cómo se escribe con letra el 100,000", text: "Cien mil" },
    { num: 500000, label: "cómo se escribe con letra el 500,000", text: "Quinientos mil" },
    { num: 1000000, label: "cómo se escribe con letra el 1,000,000", text: "Un millón" },
    { num: 5000000, label: "cómo se escribe con letra el 5,000,000", text: "Cinco millones" },
    { num: 10000000, label: "cómo se escribe con letra el 10,000,000", text: "Diez millones" }
  ];

  const handleSeoNumClick = (item: CommonNumLink) => {
    setSelectedSeoNum(item);
  };

  const handleLoadInConverter = (numStr: string) => {
    if (onSelectNumber) {
      onSelectNumber(numStr);
    } else {
      window.location.href = `/?n=${numStr}`;
    }
    setSelectedSeoNum(null);
  };

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`¡Copiado!: "${text.length > 35 ? text.substring(0, 35) + '...' : text}" 📋✨`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Parse and calculate values for live checker using robust Spanish/English parser
  const parsedLiveNum = parseSpanishNumber(liveNumber);
  const isValidLiveNum = !isNaN(parsedLiveNum) && parsedLiveNum >= 0 && parsedLiveNum < 1000000000000;
  const cleanLiveNumStr = isValidLiveNum ? String(parsedLiveNum) : "";

  // Real-time generated values
  const liveMasc = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, { gender: 'M' }) : "";
  const liveFem = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, { gender: 'F' }) : "";
  const liveRoman = isValidLiveNum && Number.isInteger(parsedLiveNum) ? toRoman(parsedLiveNum) : "N/A (Requiere entero menor de 4,000)";
  const liveOrdinal = isValidLiveNum && Number.isInteger(parsedLiveNum) ? toOrdinal(parsedLiveNum) : "N/A (Requiere entero entre 1 y 100)";
  
  // Determine current active currency name and cent name
  const currentCurrencyName = selectedCurrency === "custom" 
    ? customCurrencyName 
    : (CURRENCY_PRESETS.find(c => c.id === selectedCurrency)?.name || "pesos");
    
  const currentCurrencyCentName = selectedCurrency === "custom"
    ? customCurrencyCentName
    : (CURRENCY_PRESETS.find(c => c.id === selectedCurrency)?.cent || "centavos");

  const liveFinancial = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, {
    gender: 'N',
    isCurrency: true,
    currencyName: currentCurrencyName,
    currencyCentName: currentCurrencyCentName,
    formatFinancial: true
  }) : "";

  const liveFinancialWithCents = isValidLiveNum ? convertNumberToLetters(parsedLiveNum, {
    gender: 'N',
    isCurrency: true,
    currencyName: currentCurrencyName,
    currencyCentName: currentCurrencyCentName,
    formatFinancial: false
  }) : "";

  const liveRuleText = isValidLiveNum && Number.isInteger(parsedLiveNum) ? getSpellingRule(parsedLiveNum) : "Introduce un número entero para ver las reglas ortográficas específicas recomendadas por la RAE.";

  return (
    <div className="max-w-5xl mx-auto animate-fade-in text-left space-y-10">
      
      {/* Real-time Number spelling Analyzer Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/20 border border-blue-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              Herramienta Interactiva
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-gray-900">
              Analizador Ortográfico de Números
            </h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 font-mono hidden sm:inline">NÚMERO:</span>
            <input
              type="text"
              className="w-full md:w-44 bg-white border-2 border-blue-100 focus:border-blue-500 text-gray-900 font-mono text-lg font-bold rounded-2xl px-4 py-2.5 outline-hidden shadow-xs transition-all text-center"
              placeholder="Ej: 125"
              value={liveNumber}
              onChange={(e) => setLiveNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Currency Customization block */}
        <div className="bg-white/45 border border-blue-100/50 rounded-2xl p-4.5 mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-700 font-sans">
                Ajustes de Divisa para Formato Financiero:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CURRENCY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedCurrency(preset.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedCurrency === preset.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* If Custom is selected, show input fields */}
          <AnimatePresence>
            {selectedCurrency === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
              >
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nombre de la Moneda (Plural)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: dólares, quetzales, pesos"
                    value={customCurrencyName}
                    onChange={(e) => setCustomCurrencyName(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nombre de la Fracción (Plural)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: centavos, céntimos"
                    value={customCurrencyCentName}
                    onChange={(e) => setCustomCurrencyCentName(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-hidden"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isValidLiveNum ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Core word conversions */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Masculine Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Escritura Masculina (Estándar)
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-800 break-all leading-tight">
                    {liveMasc}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("masc", liveMasc)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "masc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Feminine Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Escritura Femenina
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-800 break-all leading-tight">
                    {liveFem}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("fem", liveFem)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "fem" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Financial Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Formato Cheque y Facturas (Abreviado)
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 italic leading-tight">
                    {liveFinancial}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("financial", liveFinancial)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "financial" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Financial Cents Card */}
              <div className="bg-white/80 p-4.5 rounded-2xl border border-gray-100/80 hover:border-blue-100/60 shadow-xs group transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">
                    Formato Moneda Completo (Fracción Escrita)
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 italic leading-tight">
                    {liveFinancialWithCents}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("financialWithCents", liveFinancialWithCents)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "financialWithCents" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Right Col: Auxiliary Formats and Grammar Tip */}
            <div className="space-y-4">
              
              <div className="bg-white/80 p-4 rounded-2xl border border-gray-100/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
                  <span className="font-bold text-gray-500 font-mono">SÍMBOLO ROMANO:</span>
                  <button
                    onClick={() => triggerCopy("roman", liveRoman)}
                    className="text-gray-400 hover:text-blue-600 transition-all"
                    disabled={liveRoman.includes("Solo")}
                  >
                    {copiedId === "roman" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-mono font-black text-lg text-blue-800 text-center tracking-wider break-words py-1">
                  {liveRoman}
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-gray-100/80 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
                  <span className="font-bold text-gray-500 font-mono">NÚMERO ORDINAL:</span>
                  <button
                    onClick={() => triggerCopy("ordinal", liveOrdinal)}
                    className="text-gray-400 hover:text-blue-600 transition-all"
                    disabled={liveOrdinal.includes("Solo")}
                  >
                    {copiedId === "ordinal" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-sans font-bold text-xs sm:text-sm text-gray-700 text-center py-1 capitalize">
                  {liveOrdinal}
                </p>
              </div>

            </div>

            {/* Bottom Alert: Orthographic Tip & Load into main converter */}
            <div className="lg:col-span-3 bg-blue-50/60 rounded-2xl p-4.5 border border-blue-100/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-blue-800">Regla Ortográfica Aplicable (RAE):</span>
                  <p className="text-xs text-blue-700 leading-relaxed max-w-3xl">
                    {liveRuleText}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleLoadInConverter(cleanLiveNumStr)}
                className="w-full sm:w-auto whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Usar en Convertidor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">Por favor, escribe un número positivo válido para analizar.</p>
          </div>
        )}
      </div>

      {/* Structured Reference Tabs Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap border-b border-gray-200 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveGuideTab('rules')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'rules'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Reglas de Oro
          </button>
          <button
            onClick={() => setActiveGuideTab('ordinals')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'ordinals'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Números Ordinales
          </button>
          <button
            onClick={() => setActiveGuideTab('romans')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'romans'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Números Romanos
          </button>
          <button
            onClick={() => setActiveGuideTab('sitemap')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'sitemap'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Sitemap de Números
          </button>
          <button
            onClick={() => setActiveGuideTab('quiz')}
            className={`px-4 py-2.5 font-sans font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeGuideTab === 'quiz'
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            🎯 ¡Prueba tu Ortografía!
          </button>
        </div>

        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-xs min-h-[250px]">
          {activeGuideTab === 'rules' && (
            <div className="space-y-6">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Normas Fundamentales de Escritura Numérica en Español</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-gray-600">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">1. La regla unificada hasta el 29</h4>
                  <p>
                    Hasta el número 29, la escritura de unidades y decenas se agrupa en una única palabra de corrido. Es un error ortográfico muy habitual escribir "veinte y tres" en lugar de <strong className="text-blue-600">veintitrés</strong>. A partir de 30 se separan con la conjunción "y" ("treinta y uno").
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">2. Acentuación correcta de palabras unificadas</h4>
                  <p>
                    Los números de la década de los veinte que terminan en vocal o en 's' llevan tilde en la sílaba aguda: <strong className="text-blue-600">veintidós</strong>, <strong className="text-blue-600">veintitrés</strong> y <strong className="text-blue-600">veintiséis</strong>. Sin embargo, "veintiuno", "veinticuatro" y "veintiocho" se escriben sin tilde.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">3. Concordancia de género en centenares</h4>
                  <p>
                    Las centenas deben concordar siempre en género con el sustantivo al que modifican: <strong className="text-blue-600">quinientos pesos</strong> (masculino) o <strong className="text-blue-600">quinientas personas</strong> (femenino). Las palabras "doscientas", "trescientas", "cuatrocientas", "seiscientas", "setecientas", "ochocientas" y "novecientas" varían a femenino.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800">4. El sustantivo 'millón' y el enlace 'de'</h4>
                  <p>
                    A diferencia de "mil", la palabra <strong className="text-blue-600">millón</strong> es un sustantivo y no un adjetivo. Si la cifra es exacta (ej. 3,000,000), exige obligatoriamente añadir la preposición "de" antes de la entidad: "tres millones de dólares", nunca "tres millones dólares".
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeGuideTab === 'ordinals' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-500" />
                <span>Estructura de Números Ordinales Básicos</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                La siguiente tabla detalla cómo nombrar las posiciones o rangos de orden de forma correcta:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {[
                  { num: "1º", word: "Primero / Primer" },
                  { num: "2º", word: "Segundo" },
                  { num: "3º", word: "Tercero / Tercer" },
                  { num: "4º", word: "Cuarto" },
                  { num: "5º", word: "Quinto" },
                  { num: "10º", word: "Décimo" },
                  { num: "11º", word: "Undécimo" },
                  { num: "12º", word: "Duodécimo" },
                  { num: "20º", word: "Vigésimo" },
                  { num: "30º", word: "Trigésimo" },
                  { num: "40º", word: "Cuadragésimo" },
                  { num: "50º", word: "Quincuagésimo" },
                  { num: "60º", word: "Sexagésimo" },
                  { num: "70º", word: "Septuagésimo" },
                  { num: "100º", word: "Centésimo" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">{item.num}</span>
                    <span className="text-xs font-semibold text-gray-700 capitalize text-right">{item.word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'romans' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Hash className="w-5 h-5 text-teal-500" />
                <span>Diccionario y Guía Rápida de Símbolos Romanos</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Los números romanos usan letras latinas mayúsculas para indicar valores. Consulta las equivalencias básicas:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { key: "I", val: 1 },
                  { key: "IV", val: 4 },
                  { key: "V", val: 5 },
                  { key: "IX", val: 9 },
                  { key: "X", val: 10 },
                  { key: "XL", val: 40 },
                  { key: "L", val: 50 },
                  { key: "XC", val: 90 },
                  { key: "C", val: 100 },
                  { key: "CD", val: 400 },
                  { key: "D", val: 500 },
                  { key: "CM", val: 900 },
                  { key: "M", val: 1000 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <span className="font-mono font-black text-lg text-teal-700">{item.key}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">Valor: {item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'sitemap' && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Sitemap de Números Comunes</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Haz clic en cualquier cifra para ver su ortografía completa, concordancia de género y formatos financieros:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {commonNumbers.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeoNumClick(item)}
                    className="bg-gray-50 hover:bg-blue-50/30 border border-gray-150 hover:border-blue-200 rounded-xl px-3.5 py-3 text-left transition-all group shadow-xs cursor-pointer"
                  >
                    <span className="font-mono text-xs text-blue-600 font-bold block group-hover:scale-[1.02] transition-transform">
                      {item.num.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5 capitalize truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGuideTab === 'quiz' && (() => {
            const activeQuestions = currentQuestions.length > 0 ? currentQuestions : QUIZ_QUESTIONS;
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-2">
                  <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Cuestionario de Ortografía de Números RAE</span>
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
                    Pregunta {quizFinished ? activeQuestions.length : quizIndex + 1} de {activeQuestions.length}
                  </span>
                </div>

                {quizFinished ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-indigo-50 text-indigo-600 mb-2">
                      <Award className="w-12 h-12" />
                    </div>
                    <h4 className="font-sans font-black text-gray-900 text-2xl">¡Quiz Completado!</h4>
                    <p className="text-gray-600 text-sm max-w-md mx-auto font-sans">
                      Has obtenido una puntuación de <strong className="text-indigo-600">{quizScore} / {activeQuestions.length}</strong> aciertos.
                    </p>
                    
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-md mx-auto text-xs text-gray-500 font-sans">
                      {quizScore === activeQuestions.length ? (
                        <p className="text-indigo-700 font-bold">🎉 ¡Excelente! Eres un maestro absoluto de la ortografía de números según las normas de la Real Academia Española (RAE).</p>
                      ) : quizScore >= 7 ? (
                        <p className="text-emerald-700 font-bold">👍 ¡Muy bien hecho! Tienes un gran dominio ortográfico. Solo te faltaron algunos detalles menores.</p>
                      ) : (
                        <p className="text-blue-700 font-bold">💡 ¡Buen intento! Te recomendamos repasar nuestra sección de "Reglas de Oro" y volver a intentarlo para perfeccionar tu dominio.</p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setQuizIndex(0);
                        setQuizScore(0);
                        setUserAnswer("");
                        setShowQuizFeedback(false);
                        setQuizFinished(false);
                        setCurrentQuestions(generateDynamicQuestions());
                      }}
                      className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                    >
                      Reiniciar Cuestionario
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                      <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">Escribe con letras el siguiente número:</p>
                      <h5 className="font-mono font-black text-gray-900 text-4xl py-3">
                        {activeQuestions[quizIndex]?.num}
                      </h5>
                      <p className="text-xs text-gray-500 italic font-sans">Escribe tu respuesta en minúsculas y sin espacios innecesarios.</p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (showQuizFeedback) return;
                        const cleanedAnswer = userAnswer.trim().toLowerCase();
                        const isCorrect = cleanedAnswer === activeQuestions[quizIndex]?.answer;
                        if (isCorrect) {
                          setQuizScore((prev) => prev + 1);
                        }
                        setShowQuizFeedback(true);
                      }}
                      className="space-y-4"
                    >
                      <div className="text-left">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-sans">Tu Respuesta:</label>
                        <input
                          type="text"
                          disabled={showQuizFeedback}
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Ej: veintitrés"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans focus:outline-hidden focus:border-blue-500 transition disabled:opacity-75 font-semibold text-gray-900"
                          required
                          autoFocus
                        />
                      </div>

                      {showQuizFeedback && (
                        <div className={`p-4 rounded-2xl border ${
                          userAnswer.trim().toLowerCase() === activeQuestions[quizIndex]?.answer
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-rose-50 border-rose-100 text-rose-800"
                        } space-y-2 text-xs sm:text-sm text-left`}>
                          <p className="font-bold">
                            {userAnswer.trim().toLowerCase() === activeQuestions[quizIndex]?.answer
                              ? "✓ ¡Correcto!"
                              : `✗ Incorrecto. Se escribe: "${activeQuestions[quizIndex]?.answer}"`}
                          </p>
                          <p className="opacity-90 font-sans text-xs sm:text-xs leading-relaxed">
                            <strong>Explicación:</strong> {activeQuestions[quizIndex]?.tip}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {!showQuizFeedback ? (
                          <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs font-sans"
                          >
                            Verificar Respuesta
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setShowQuizFeedback(false);
                              setUserAnswer("");
                              if (quizIndex + 1 < activeQuestions.length) {
                                setQuizIndex((prev) => prev + 1);
                              } else {
                                setQuizFinished(true);
                              }
                            }}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs font-sans"
                          >
                            <span>{quizIndex + 1 < activeQuestions.length ? "Siguiente Pregunta" : "Ver Resultados"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Programmatic Details Modal/Overlay for Selected Number */}
      {selectedSeoNum && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-md w-full text-left space-y-6 relative animate-scale-up">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 font-mono text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enciclopedia Ortográfica</span>
              </div>
              <h4 className="font-sans font-black text-gray-900 text-2xl tracking-tight">
                Número {selectedSeoNum.num.toLocaleString()}
              </h4>
            </div>

            {/* Structured Details list */}
            <div className="space-y-4">
              {/* Masculine words */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Escritura Masculina (Estándar)
                  </span>
                  <p className="font-sans font-bold text-gray-800 text-sm sm:text-base">
                    {selectedSeoNum.text}
                  </p>
                  <span className="text-[10px] text-gray-400 font-sans block mt-1">
                    Ej: {selectedSeoNum.text.toLowerCase()} libros
                  </span>
                </div>
                <button
                  onClick={() => triggerCopy("seo_masc", selectedSeoNum.text)}
                  className="p-2 bg-white hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 border border-gray-200/60 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "seo_masc" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Feminine words */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Escritura Femenina
                  </span>
                  <p className="font-sans font-semibold text-gray-700 text-sm">
                    {convertNumberToLetters(selectedSeoNum.num, { gender: 'F' })}
                  </p>
                  <span className="text-[10px] text-gray-400 font-sans block mt-1">
                    Ej: {convertNumberToLetters(selectedSeoNum.num, { gender: 'F' }).toLowerCase()} personas
                  </span>
                </div>
                <button
                  onClick={() => triggerCopy("seo_fem", convertNumberToLetters(selectedSeoNum.num, { gender: 'F' }))}
                  className="p-2 bg-white hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 border border-gray-200/60 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "seo_fem" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Financial words */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Formato Factura / Moneda ({currentCurrencyName})
                  </span>
                  <p className="font-sans font-semibold text-gray-700 text-xs sm:text-sm italic">
                    {convertNumberToLetters(selectedSeoNum.num, {
                      gender: 'N',
                      isCurrency: true,
                      currencyName: currentCurrencyName,
                      currencyCentName: currentCurrencyCentName,
                      formatFinancial: true
                    })}
                  </p>
                </div>
                <button
                  onClick={() => triggerCopy("seo_fin", convertNumberToLetters(selectedSeoNum.num, {
                    gender: 'N',
                    isCurrency: true,
                    currencyName: currentCurrencyName,
                    currencyCentName: currentCurrencyCentName,
                    formatFinancial: true
                  }))}
                  className="p-2 bg-white hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 border border-gray-200/60 transition-all cursor-pointer flex-shrink-0"
                  title="Copiar"
                >
                  {copiedId === "seo_fin" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedSeoNum(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-sans font-semibold text-xs text-center cursor-pointer transition-all"
              >
                Cerrar Guía
              </button>
              
              <button
                onClick={() => handleLoadInConverter(String(selectedSeoNum.num))}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all"
              >
                <span>Usar en Convertidor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-800"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
