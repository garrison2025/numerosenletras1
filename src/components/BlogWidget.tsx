import React, { useState, useEffect } from "react";
import { convertNumberToLetters } from "../utils/numberToLetters";
import { AESTHETIC_FONTS } from "../utils/fontGenerators";
import { Copy, Check, Sparkles } from "lucide-react";

interface BlogWidgetProps {
  slug: string;
}

export default function BlogWidget({ slug }: BlogWidgetProps) {
  const [numInput, setNumInput] = useState("1250.50");
  const [numGender, setNumGender] = useState<'M' | 'F' | 'N'>('M');
  const [numCurrency, setNumCurrency] = useState(true);
  const [numWords, setNumWords] = useState("");
  const [widgetCopied, setWidgetCopied] = useState(false);

  const [bubbleText, setBubbleText] = useState("Hola Mundo");
  const [bubbleStyle, setBubbleStyle] = useState<'white' | 'black'>('white');
  const [bubbleResult, setBubbleResult] = useState("");

  const [aestheticText, setAestheticText] = useState("Aesthetic");
  const [aestheticStyle, setAestheticStyle] = useState("super");
  const [aestheticResult, setAestheticResult] = useState("");

  useEffect(() => {
    if (slug === "guia-convertir-numeros-a-letras-rae-finanzas") {
      try {
        const letters = convertNumberToLetters(numInput, {
          gender: numGender,
          isCurrency: numCurrency,
          currencyName: "pesos",
          currencyCentName: "centavos",
          formatFinancial: true
        });
        setNumWords(letters);
      } catch {
        setNumWords("");
      }
    }
  }, [numInput, numGender, numCurrency, slug]);

  useEffect(() => {
    if (slug === "arte-letras-burbuja-tipografia-circular-copiar-pegar") {
      const font = AESTHETIC_FONTS.find(f => f.id === (bubbleStyle === 'white' ? 'bubble_white' : 'bubble_black'));
      if (font) {
        setBubbleResult(font.generate(bubbleText));
      }
    }
  }, [bubbleText, bubbleStyle, slug]);

  useEffect(() => {
    if (slug === "letras-aesthetic-fuentes-pequenas-instagram-tiktok") {
      const font = AESTHETIC_FONTS.find(f => f.id === aestheticStyle);
      if (font) {
        setAestheticResult(font.generate(aestheticText));
      }
    }
  }, [aestheticText, aestheticStyle, slug]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setWidgetCopied(true);
    setTimeout(() => setWidgetCopied(false), 2000);
  };

  if (slug === "guia-convertir-numeros-a-letras-rae-finanzas") {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-5 shadow-xs space-y-4 text-left my-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-blue-900 uppercase tracking-wide">Mini Conversor RAE Interactivo</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Escribe un importe numérico para ver la transcripción exacta en letras al instante.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Cifra Numérica:</label>
            <input 
              type="text" 
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono"
              placeholder="Ej: 1500.50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Género:</label>
              <select 
                value={numGender} 
                onChange={(e) => setNumGender(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs focus:outline-hidden"
              >
                <option value="M">Masculino (pesos)</option>
                <option value="F">Femenino (pesetas)</option>
                <option value="N">Neutro (dólares)</option>
              </select>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 select-none">
                <input 
                  type="checkbox" 
                  checked={numCurrency} 
                  onChange={(e) => setNumCurrency(e.target.checked)}
                  className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Formato Cheque
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Resultado Escrito:</span>
            <p className="text-xs font-semibold text-gray-800 leading-normal min-h-[36px]">
              {numWords || "Ingrese una cifra válida..."}
            </p>
            {numWords && (
              <button
                type="button"
                onClick={() => copyToClipboard(numWords)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Resultado
                  </>
                )}
              </button>
            )}
          </div>
          <a 
            href="/"
            className="block w-full text-center text-[10px] font-bold text-blue-600 hover:underline pt-1"
          >
            Ir al conversor principal completo →
          </a>
        </div>
      </div>
    );
  }

  if (slug === "arte-letras-burbuja-tipografia-circular-copiar-pegar") {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-4 text-left my-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-indigo-900 uppercase tracking-wide">Prueba Rápida: Letras Burbuja</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Escribe tu texto:</label>
            <input 
              type="text" 
              value={bubbleText}
              onChange={(e) => setBubbleText(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-500"
              placeholder="Escribe algo aquí..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBubbleStyle('white')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition ${
                bubbleStyle === 'white' 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              Ⓑⓛⓐⓝⓒⓐⓢ
            </button>
            <button
              type="button"
              onClick={() => setBubbleStyle('black')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition ${
                bubbleStyle === 'black' 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              🅝🅔🅖🅡🅐🅢
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Previsualización:</span>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed min-h-[32px] break-all">
              {bubbleResult || "..."}
            </p>
            {bubbleResult && (
              <button
                type="button"
                onClick={() => copyToClipboard(bubbleResult)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Letras Burbuja
                  </>
                )}
              </button>
            )}
          </div>
          <a 
            href="/letras-burbuja"
            className="block w-full text-center text-[10px] font-bold text-indigo-600 hover:underline pt-1"
          >
            Ir al conversor completo de letras burbuja →
          </a>
        </div>
      </div>
    );
  }

  if (slug === "letras-aesthetic-fuentes-pequenas-instagram-tiktok") {
    const quickAestheticStyles = [
      { id: "super", name: "Letra Pequeña" },
      { id: "script_bold", name: "Cursiva" },
      { id: "double_struck", name: "Letra Hueca" },
      { id: "monospace", name: "Monospace" }
    ];

    return (
      <div className="bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-2xl border border-pink-100 p-5 shadow-xs space-y-4 text-left my-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
          <h4 className="font-display font-bold text-sm text-pink-900 uppercase tracking-wide">Prueba Rápida: Estilos Aesthetic</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Escribe tu texto:</label>
            <input 
              type="text" 
              value={aestheticText}
              onChange={(e) => setAestheticText(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-pink-500"
              placeholder="Escribe tu bio..."
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {quickAestheticStyles.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setAestheticStyle(s.id)}
                className={`py-1 px-2 text-[11px] font-bold rounded-lg border cursor-pointer transition text-left truncate ${
                  aestheticStyle === s.id 
                    ? "bg-pink-600 text-white border-pink-600 shadow-xs" 
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase">Previsualización:</span>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed min-h-[32px] break-all">
              {aestheticResult || "..."}
            </p>
            {aestheticResult && (
              <button
                type="button"
                onClick={() => copyToClipboard(aestheticResult)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg py-1.5 text-xs font-bold transition cursor-pointer"
              >
                {widgetCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Texto Aesthetic
                  </>
                )}
              </button>
            )}
          </div>
          <a 
            href="/letras-aesthetic"
            className="block w-full text-center text-[10px] font-bold text-pink-600 hover:underline pt-1"
          >
            Ir al conversor avanzado de letras aesthetic →
          </a>
        </div>
      </div>
    );
  }

  return null;
}
