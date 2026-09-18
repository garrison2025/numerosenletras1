/**
 * Font generators for Letras Aesthetic and Letras Burbuja.
 * Converts standard text to unicode aesthetic characters.
 */

// Mapping helper: takes standard chars and returns mapped unicode chars
function mapString(text: string, mapObj: Record<string, string>): string {
  return text
    .split("")
    .map(char => mapObj[char] || mapObj[char.toLowerCase()] || mapObj[char.toUpperCase()] || char)
    .join("");
}

// 1. SUPERSCRIPT (Letras Pequeñas - Superior)
const superscriptMap: Record<string, string> = {
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
  'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ',
  'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
  'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': '𝘍', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ',
  'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': '𝘘', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ',
  'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
};

// 2. SUBSCRIPT (Letras Pequeñas - Inferior)
const subscriptMap: Record<string, string> = {
  'a': 'ₐ', 'b': '♭', 'c': '꜀', 'd': 'ᵈ', 'e': 'ₑ', 'f': '𝖿', 'g': 'ℊ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'q': '૧', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ',
  'u': 'ᵤ', 'v': 'ᵥ', 'w': '_', 'x': 'ₓ', 'y': 'ᵧ', 'z': '₂',
  'A': 'ₐ', 'B': '₈', 'C': '꜀', 'D': 'ᴰ', 'E': 'ₑ', 'F': '𝖿', 'G': 'ℊ', 'H': 'ₕ', 'I': 'ᵢ', 'J': 'ⱼ',
  'K': 'ₖ', 'L': 'ₗ', 'M': 'ₘ', 'N': 'ₙ', 'O': 'ₒ', 'P': 'ₚ', 'Q': '૧', 'R': 'ᵣ', 'S': 'ₛ', 'T': 'ₜ',
  'U': 'ᵤ', 'V': 'ᵥ', 'W': '_', 'X': 'ₓ', 'Y': 'ᵧ', 'Z': '₂',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};

// Helper for ranges
function generateUnicodeMap(
  chars: string,
  startCode: number,
  offsetFn?: (index: number) => number
): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < chars.length; i++) {
    const code = offsetFn ? offsetFn(i) : startCode + i;
    map[chars[i]] = String.fromCodePoint(code);
  }
  return map;
}

// 3. BUBBLE WHITE (①②③ / ⒶⒷⒸ / ⓐⓑⓒ)
const BUBBLE_WHITE_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BUBBLE_WHITE_LOWER = "abcdefghijklmnopqrstuvwxyz";
const BUBBLE_WHITE_DIGITS = "123456789";

const bubbleWhiteMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 9398), // Ⓐ to Ⓩ
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 9424), // ⓐ to ⓩ
  ...generateUnicodeMap(BUBBLE_WHITE_DIGITS, 9312), // ① to ⑨
  '0': '⓪',
  ' ': ' '
};

// 4. BUBBLE BLACK (❶❷❸ / 🅐🅑🅒)
// Filled circles upper: U+1F170 is 🅐 (127344) to 🅩 (127369)
const bubbleBlackMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 127344), // 🅐 to 🅩
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 127344), // Lowercase maps to uppercase filled circles for better visibility
  ...generateUnicodeMap(BUBBLE_WHITE_DIGITS, 10102), // ❶ to ❾
  '0': '⓿',
  ' ': '  '
};

// 5. DOUBLE STRUCK (𝔸𝔹ℂ / 𝕒𝕓𝕔)
const doubleStruckMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 120120), // 𝔸 to ℤ
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 120146), // 𝕒 to 𝕫
  '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
  ' ': ' '
};

// Custom exceptions for Double Struck where codes are non-sequential in standard math block
doubleStruckMap['C'] = 'ℂ';
doubleStruckMap['H'] = 'ℍ';
doubleStruckMap['N'] = 'ℕ';
doubleStruckMap['P'] = 'ℙ';
doubleStruckMap['Q'] = 'ℚ';
doubleStruckMap['R'] = 'ℝ';
doubleStruckMap['Z'] = 'ℤ';

// 6. SCRIPT BOLD (𝓠𝓾𝓲𝓬𝓴)
const scriptBoldMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 119964), // 𝓐 to 𝓩
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 119990), // 𝓪 to 𝓳
  ' ': ' '
};

// 7. SCRIPT NORMAL (𝒬𝓊𝒾𝒸𝓀)
const scriptNormalMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 119912), // 𝒜 to 𝒵
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 119938), // 𝒶 to 𝓏
  ' ': ' '
};
// Exceptions
scriptNormalMap['B'] = 'ℬ';
scriptNormalMap['E'] = 'ℰ';
scriptNormalMap['F'] = 'ℱ';
scriptNormalMap['H'] = 'ℋ';
scriptNormalMap['I'] = 'ℐ';
scriptNormalMap['L'] = 'ℒ';
scriptNormalMap['M'] = 'ℳ';
scriptNormalMap['R'] = 'ℛ';
scriptNormalMap['e'] = 'ℯ';
scriptNormalMap['g'] = 'ℊ';
scriptNormalMap['o'] = 'ℴ';

// 8. GOTHIC BOLD (𝕼𝖚𝖎𝖈𝖐)
const gothicBoldMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 120172), // 𝕬 to 𝕵
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 120198), // 𝖇 to 𝖟
  ' ': ' '
};

// 9. GOTHIC NORMAL (𝔔𝔲𝔦𝔠𝔨)
const gothicNormalMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 120068), // 𝔄 to 𝔖
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 120094), // 𝔞 to 𝔷
  ' ': ' '
};
gothicNormalMap['C'] = 'ℭ';
gothicNormalMap['H'] = 'ℌ';
gothicNormalMap['I'] = 'ℑ';
gothicNormalMap['R'] = 'ℜ';
gothicNormalMap['Z'] = 'ℨ';

// 10. MONOSPACE (𝚀𝚞𝚒𝚌𝚔)
const monospaceMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 120432), // 𝙰 to 𝚉
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 120458), // 𝚊 to 𝚣
  ...generateUnicodeMap("0123456789", 120822),       // 𝟶 to 𝟿
  ' ': ' '
};

// 11. SQUARES UNFILLED (🄰🄱🄲)
const squareWhiteMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 127280), // 🄰 to 🅏
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 127280),
  ' ': ' '
};

// 12. SQUARES FILLED (🅰🅱🅲)
const squareBlackMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 127312), // 🅰 to 🆏
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 127312),
  ' ': ' '
};

// 13. PARENTHESIZED (⒜⒝⒞)
const parenthesizedMap: Record<string, string> = {
  ...generateUnicodeMap(BUBBLE_WHITE_LOWER, 9372), // ⒜ to ⒵
  ...generateUnicodeMap(BUBBLE_WHITE_UPPER, 9372),
  ...generateUnicodeMap("123456789", 9332), // ⑴ to ⑼
  ' ': ' '
};

// 14. INVERTED (UPSIDE DOWN)
const invertedMap: Record<string, string> = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
  'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
  'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
  'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ',
  'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '┴',
  'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
};

// For inverted, it's customary to reverse the string order too!
function generateInverted(text: string): string {
  return text
    .split("")
    .reverse()
    .map(char => invertedMap[char] || char)
    .join("");
}

// 15. MIRROR
const mirrorMap: Record<string, string> = {
  'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ʇ', 'g': 'ϱ', 'h': 'ʜ', 'i': 'i', 'j': 'į',
  'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ', 'o': 'o', 'p': 'q', 'q': 'p', 'r': 'я', 's': 'ꙅ', 't': 'ƚ',
  'u': 'υ', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'γ', 'z': 'ƹ',
  'A': 'A', 'B': 'ʚ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ߝ', 'G': 'Ꭾ', 'H': 'H', 'I': 'I', 'J': 'ᓀ',
  'K': 'K', 'L': '⅃', 'M': 'M', 'N': 'ᴎ', 'O': 'O', 'P': 'Գ', 'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T',
  'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'S'
};

function generateMirror(text: string): string {
  return text
    .split("")
    .reverse()
    .map(char => mirrorMap[char] || char)
    .join("");
}

// Custom decoration fonts
function applyDecoration(text: string, decorator: (char: string) => string): string {
  return text.split("").map(decorator).join("");
}

export interface AestheticFont {
  id: string;
  name: string;
  description: string;
  category: 'aesthetic' | 'burbuja' | 'pequenas';
  generate: (text: string) => string;
}

export const AESTHETIC_FONTS: AestheticFont[] = [
  // IMPORTANT: Letras Pequeñas MUST be first and second for SEO search mapping
  {
    id: 'super',
    name: 'Letras Pequeñas (Superiores)',
    description: 'Texto en formato superíndice para biografías y nombres',
    category: 'pequenas',
    generate: (text) => mapString(text, superscriptMap)
  },
  {
    id: 'sub',
    name: 'Letras Pequeñas (Inferiores)',
    description: 'Texto en formato subíndice estilizado',
    category: 'pequenas',
    generate: (text) => mapString(text, subscriptMap)
  },
  // Bubble Fonts (specifically for letras burbuja)
  {
    id: 'bubble_white',
    name: 'Letras Burbuja Blancas (Contorno)',
    description: 'Letras en círculos transparentes con contorno negro',
    category: 'burbuja',
    generate: (text) => mapString(text, bubbleWhiteMap)
  },
  {
    id: 'bubble_black',
    name: 'Letras Burbuja Negras (Rellenas)',
    description: 'Letras en círculos negros con texto blanco',
    category: 'burbuja',
    generate: (text) => mapString(text, bubbleBlackMap)
  },
  // Aesthetic Styles
  {
    id: 'script_bold',
    name: 'Cursiva Negrita (Script Bold)',
    description: 'Letras cursivas elegantes en negrita',
    category: 'aesthetic',
    generate: (text) => mapString(text, scriptBoldMap)
  },
  {
    id: 'script_normal',
    name: 'Cursiva Normal',
    description: 'Letras cursivas finas y clásicas',
    category: 'aesthetic',
    generate: (text) => mapString(text, scriptNormalMap)
  },
  {
    id: 'double_struck',
    name: 'Letras Huecas (Double Struck)',
    description: 'Estilo blackboard bold o contorno de doble línea',
    category: 'aesthetic',
    generate: (text) => mapString(text, doubleStruckMap)
  },
  {
    id: 'gothic_bold',
    name: 'Gótico Negrita (Fraktur)',
    description: 'Estilo gótico antiguo en formato negrita',
    category: 'aesthetic',
    generate: (text) => mapString(text, gothicBoldMap)
  },
  {
    id: 'gothic_normal',
    name: 'Gótico Normal',
    description: 'Estilo gótico medieval clásico',
    category: 'aesthetic',
    generate: (text) => mapString(text, gothicNormalMap)
  },
  {
    id: 'monospace',
    name: 'Máquina de Escribir (Monospace)',
    description: 'Letras de espaciado fijo tipo teletipo o consola',
    category: 'aesthetic',
    generate: (text) => mapString(text, monospaceMap)
  },
  {
    id: 'squares_white',
    name: 'Cuadrados Blancos',
    description: 'Letras enmarcadas en cajas cuadradas con fondo blanco',
    category: 'aesthetic',
    generate: (text) => mapString(text, squareWhiteMap)
  },
  {
    id: 'squares_black',
    name: 'Cuadrados Negros',
    description: 'Letras enmarcadas en cajas cuadradas con fondo negro',
    category: 'aesthetic',
    generate: (text) => mapString(text, squareBlackMap)
  },
  {
    id: 'parenthesized',
    name: 'Entre Paréntesis',
    description: 'Cada letra encerrada entre paréntesis automáticos',
    category: 'aesthetic',
    generate: (text) => mapString(text, parenthesizedMap)
  },
  // Decorations / transformations
  {
    id: 'strikethrough',
    name: 'Texto Tachado',
    description: 'Texto con una línea horizontal divisoria',
    category: 'aesthetic',
    generate: (text) => applyDecoration(text, (c) => c + '\u0336')
  },
  {
    id: 'underline',
    name: 'Texto Subrayado',
    description: 'Texto con línea inferior continua',
    category: 'aesthetic',
    generate: (text) => applyDecoration(text, (c) => c === ' ' ? ' ' : c + '\u0332')
  },
  {
    id: 'slashed',
    name: 'Letras con Barra Diagonal',
    description: 'Cada letra tachada con una barra inclinada',
    category: 'aesthetic',
    generate: (text) => applyDecoration(text, (c) => c === ' ' ? ' ' : c + '\u0337')
  },
  {
    id: 'inverted',
    name: 'Texto Al Revés (Invertido)',
    description: 'Texto volteado 180 grados e invertido',
    category: 'aesthetic',
    generate: (text) => generateInverted(text)
  },
  {
    id: 'mirror',
    name: 'Efecto Espejo',
    description: 'Texto reflejado horizontalmente',
    category: 'aesthetic',
    generate: (text) => generateMirror(text)
  },
  {
    id: 'vaporwave',
    name: 'Estilo Vaporwave / Ancho',
    description: 'Letras con espaciado amplio estético (Ｆｕｌｌｗｉｄｔｈ)',
    category: 'aesthetic',
    generate: (text) => text.split("").map(c => {
      const code = c.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(code + 65248);
      }
      return c;
    }).join("")
  },
  {
    id: 'zalgo',
    name: 'Efecto Glitch (Zalgo Suave)',
    description: 'Letras con distorsiones místicas superiores',
    category: 'aesthetic',
    generate: (text) => applyDecoration(text, (c) => {
      if (c === ' ') return ' ';
      const glitches = ['\u033d', '\u0313', '\u030a', '\u033d', '\u0315', '\u035c', '\u0310'];
      const randomGlitch = glitches[Math.floor(Math.random() * glitches.length)];
      return c + randomGlitch;
    })
  },
  {
    id: 'stars',
    name: 'Estrellas Cósmicas',
    description: 'Texto rodeado de estrellas decorativas',
    category: 'aesthetic',
    generate: (text) => `✧*̥˚ ${text} *̥˚✧`
  },
  {
    id: 'sparkles',
    name: 'Brillos Aesthetic',
    description: 'Decoración elegante con destellos y flores',
    category: 'aesthetic',
    generate: (text) => `✨ 💖 ${text} 💖 ✨`
  }
];
