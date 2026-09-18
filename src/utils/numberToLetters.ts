/**
 * Spanish number to words converter.
 * Converts numbers into proper Spanish text with precise grammar rules conforming to RAE standards.
 */

import { type CurrencyConfig, CURRENCIES, CURRENCY_MAP } from "../data/currencies";

export type { CurrencyConfig };
export { CURRENCIES, CURRENCY_MAP };
export const CURRENCY_CONFIGS = CURRENCY_MAP;

const UNITS_MASCULINE = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const UNITS_FEMININE = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const UNITS_NEUTRAL = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];

const TENS_10_19 = [
  "diez", "once", "doce", "trece", "catorce", "quince", 
  "dieciséis", "diecisiete", "dieciocho", "diecinueve"
];

const TENS_20_29_MASCULINE = [
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
];

const TENS_20_29_FEMININE = [
  "veinte", "veintiuna", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
];

const TENS_20_29_NEUTRAL = [
  "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro", 
  "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
];

const TENS_30_90 = [
  "", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"
];

const HUNDREDS_MASCULINE = [
  "", "ciento", "doscientos", "trescientos", "cuatrocientos", 
  "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"
];

const HUNDREDS_FEMININE = [
  "", "ciento", "doscientas", "trescientas", "cuatrocientas", 
  "quinientas", "seiscientas", "setecientas", "ochocientas", "novecientas"
];

/**
 * Converts a 3-digit number (0-999) into Spanish words.
 */
function convertGroupOfThree(num: number, gender: 'M' | 'F' | 'N' = 'M'): string {
  if (num === 0) return "";
  if (num === 100) return "cien";

  let result = "";
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    const hundredsList = gender === 'F' ? HUNDREDS_FEMININE : HUNDREDS_MASCULINE;
    result += hundredsList[hundreds];
    if (remainder > 0) result += " ";
  }

  if (remainder > 0) {
    if (remainder < 10) {
      const unitsList = gender === 'F' ? UNITS_FEMININE : (gender === 'N' ? UNITS_NEUTRAL : UNITS_MASCULINE);
      result += unitsList[remainder];
    } else if (remainder >= 10 && remainder < 20) {
      result += TENS_10_19[remainder - 10];
    } else if (remainder >= 20 && remainder < 30) {
      const tens20List = gender === 'F' ? TENS_20_29_FEMININE : (gender === 'N' ? TENS_20_29_NEUTRAL : TENS_20_29_MASCULINE);
      result += tens20List[remainder - 20];
    } else {
      const tens = Math.floor(remainder / 10);
      const units = remainder % 10;
      result += TENS_30_90[tens];
      if (units > 0) {
        const unitsList = gender === 'F' ? UNITS_FEMININE : (gender === 'N' ? UNITS_NEUTRAL : UNITS_MASCULINE);
        result += " y " + unitsList[units];
      }
    }
  }

  return result.trim();
}

export interface ConvertOptions {
  gender?: 'M' | 'F' | 'N';
  currency?: CurrencyConfig;
  isCurrency?: boolean;
  currencyName?: string;
  currencyCentName?: string;
  formatFinancial?: boolean;
  decimalMode?: 'fraction' | 'words';
  capitalize?: boolean;
}

/**
 * Converts any number (integer or decimal, positive or negative) into Spanish words.
 */
export function convertNumberToLetters(
  num: number | string, 
  options?: ConvertOptions
): string {
  const gender = options?.gender || 'M';
  const isCapitalize = options?.capitalize === true;

  // Resolve currency config if provided
  let currencyCfg: CurrencyConfig | null = null;
  if (options?.currency) {
    currencyCfg = options.currency;
  } else if (options?.isCurrency) {
    currencyCfg = {
      code: "CUSTOM",
      name: options.currencyName || "Personalizado",
      singular: options.currencyName || "peso",
      plural: options.currencyName || "pesos",
      centSingular: options.currencyCentName || "centavo",
      centPlural: options.currencyCentName || "centavos",
      symbol: "$",
      financialSuffix: "M.N.",
      flag: "🌐",
      country: "Global",
      region: "north-central"
    };
  }

  const isFinancial = options?.formatFinancial !== false && (Boolean(currencyCfg) || options?.formatFinancial === true);
  const decimalMode = options?.decimalMode || (currencyCfg ? (options?.formatFinancial === false ? 'words' : 'fraction') : 'words');

  // String cleaning
  let numStr = String(num).trim();
  if (!numStr || numStr === "-") return "cero";

  // Check negative
  let isNegative = false;
  if (numStr.startsWith("-")) {
    isNegative = true;
    numStr = numStr.substring(1).trim();
  }

  // Handle standard decimal separator (dot or comma)
  // If format is 1.234,56 replace dots as thousand sep and comma as decimal sep
  if (numStr.includes(",") && !numStr.includes(".")) {
    numStr = numStr.replace(",", ".");
  } else if (numStr.includes(".") && numStr.includes(",")) {
    const lastDot = numStr.lastIndexOf(".");
    const lastComma = numStr.lastIndexOf(",");
    if (lastComma > lastDot) {
      // European 1.234,56
      numStr = numStr.replace(/\./g, "").replace(",", ".");
    } else {
      // US 1,234.56
      numStr = numStr.replace(/,/g, "");
    }
  }

  const parts = numStr.split(".");
  const rawIntegerStr = parts[0] ? parts[0].replace(/^0+(?=\d)/, "") : "0";
  const integerPart = parseInt(rawIntegerStr || "0", 10);
  
  const rawDecimalStr = parts[1] || "";
  const decimalPartString = rawDecimalStr.substring(0, 2).padEnd(2, '0');
  const decimalPart = parseInt(decimalPartString || "0", 10);

  if (isNaN(integerPart)) {
    return isCapitalize ? "Cero" : "cero";
  }

  let words = "";

  if (integerPart === 0) {
    words = "cero";
  } else {
    let tempNum = integerPart;
    const groups: number[] = [];

    while (tempNum > 0) {
      groups.push(tempNum % 1000);
      tempNum = Math.floor(tempNum / 1000);
    }

    // groups[0]: units, tens, hundreds
    // groups[1]: thousands (mil)
    // groups[2]: millions (millón/millones)
    // groups[3]: thousands of millions (mil millones)
    // groups[4]: billions (billón/billones)

    for (let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i];
      if (g === 0) continue;

      // In currency mode or when qualifying masculine nouns, final group of units uses 'N' (apocope: un)
      let groupGender: 'M' | 'F' | 'N' = 'N';
      if (i === 0) {
        groupGender = currencyCfg ? 'N' : gender;
      }

      const groupWords = convertGroupOfThree(g, groupGender);

      if (i === 1) {
        // Thousands: RAE standard is 'mil', never 'un mil'
        if (g === 1) {
          words += "mil ";
        } else {
          words += groupWords + " mil ";
        }
      } else if (i === 2) {
        // Millions: 'un millón' or 'X millones'
        if (g === 1) {
          words += "un millón ";
        } else {
          words += groupWords + " millones ";
        }
      } else if (i === 3) {
        // Thousands of millions
        if (g === 1) {
          words += "mil millones ";
        } else {
          words += groupWords + " mil millones ";
        }
      } else if (i === 4) {
        // Billions (10^12)
        if (g === 1) {
          words += "un billón ";
        } else {
          words += groupWords + " billones ";
        }
      } else {
        words += groupWords + " ";
      }
    }
  }

  words = words.trim();

  // If currency formatting
  if (currencyCfg) {
    // Connector " de " for exact millions / billions
    let connector = " ";
    const lowerWords = words.toLowerCase();
    if (
      integerPart > 0 &&
      (integerPart % 1000000 === 0 ||
       lowerWords.endsWith("millón") ||
       lowerWords.endsWith("millones") ||
       lowerWords.endsWith("billón") ||
       lowerWords.endsWith("billones"))
    ) {
      connector = " de ";
    }

    const currencyName = integerPart === 1 ? currencyCfg.singular : currencyCfg.plural;
    const suffix = currencyCfg.financialSuffix ? ` ${currencyCfg.financialSuffix}` : "";

    if (decimalMode === 'fraction') {
      words = `${words}${connector}${currencyName} ${decimalPartString}/100${suffix}`;
    } else {
      // decimalMode === 'words'
      if (decimalPart > 0) {
        const centName = decimalPart === 1 ? currencyCfg.centSingular : currencyCfg.centPlural;
        const centWords = convertGroupOfThree(decimalPart, 'N');
        words = `${words}${connector}${currencyName} con ${centWords} ${centName}${suffix}`;
      } else {
        words = `${words}${connector}${currencyName}${suffix}`;
      }
    }
  } else {
    // Non-currency decimal
    if (parts.length > 1 && rawDecimalStr.length > 0) {
      if (rawDecimalStr.startsWith("0")) {
        // E.g. 1.01 -> uno punto cero uno
        const decWords = rawDecimalStr
          .split("")
          .map(d => {
            const digit = parseInt(d, 10);
            return digit === 0 ? "cero" : UNITS_MASCULINE[digit];
          })
          .join(" ");
        words = `${words} punto ${decWords}`;
      } else {
        const decVal = parseInt(rawDecimalStr, 10);
        if (!isNaN(decVal) && decVal > 0) {
          const decWords = decVal < 1000 ? convertGroupOfThree(decVal, gender) : convertNumberToLetters(decVal, { gender });
          words = `${words} punto ${decWords}`;
        }
      }
    }
  }

  if (isNegative && words !== "cero") {
    words = `menos ${words}`;
  }

  words = words.trim();

  if (isCapitalize && words.length > 0) {
    words = words.charAt(0).toUpperCase() + words.slice(1);
  }

  return words;
}
