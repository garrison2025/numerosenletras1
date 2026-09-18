import { convertNumberToLetters } from './numberToLetters.js';
import { CURRENCY_MAP } from '../data/currencies.js';

export interface CountryExampleItem {
  num: string;
  text: string;
  variant?: string;
}

export interface FormatCountryOptions {
  uppercase?: boolean;
  capitalize?: boolean;
  formatStyle?: 'LA' | 'ES';
}

/**
 * Normalizes input amount into positive integer and 2-digit decimal fraction.
 */
function parseAmountParts(amount: number | string, formatStyle: 'LA' | 'ES' = 'LA') {
  let str = String(amount).trim();
  if (!str || str === '-') {
    return { integer: 0, decimal: 0, decimalStr: '00', hasDecimals: false, isNegative: false };
  }

  const isNegative = str.startsWith('-');
  if (isNegative) {
    str = str.substring(1).trim();
  }

  // Parse according to regional style
  if (formatStyle === 'ES') {
    if (str.includes(',') && str.includes('.')) {
      str = str.replace(/\./g, '').replace(/,/g, '.');
    } else if (str.includes(',')) {
      str = str.replace(/,/g, '.');
    } else if (str.includes('.')) {
      const dotIndex = str.lastIndexOf('.');
      const afterDot = str.substring(dotIndex + 1);
      if (afterDot.length === 3 && (str.length - 1 - dotIndex) === 3) {
        str = str.replace(/\./g, '');
      }
    }
  } else {
    // Latin America: comma is thousand separator, dot is decimal
    str = str.replace(/,/g, '');
  }

  const parts = str.split('.');
  const intStr = parts[0] ? parts[0].replace(/^0+(?=\d)/, '') : '0';
  const integer = parseInt(intStr || '0', 10);

  const hasDecimals = parts.length > 1;
  const rawDec = parts[1] || '';
  const decimalStr = rawDec.substring(0, 2).padEnd(2, '0');
  const decimal = parseInt(decimalStr || '0', 10);

  return {
    integer: isNaN(integer) ? 0 : integer,
    decimal: isNaN(decimal) ? 0 : decimal,
    decimalStr,
    hasDecimals,
    isNegative
  };
}

/**
 * Returns canonical financial expression in words for a given country/currency.
 * Matches local banking practice, legal requirements, and country page guides.
 */
export function formatCountryFinancialAmount(
  amount: number | string,
  currencyCode: 'MXN' | 'COP' | 'PEN' | 'ARS' | 'EUR' | string,
  options?: FormatCountryOptions
): string {
  const code = currencyCode.toUpperCase();
  const formatStyle = options?.formatStyle || (code === 'EUR' || code === 'ARS' ? 'ES' : 'LA');
  const isUppercase = options?.uppercase === true;
  const isCapitalize = options?.capitalize !== false; // default true unless explicitly false

  const { integer, decimal, decimalStr, hasDecimals, isNegative } = parseAmountParts(amount, formatStyle);

  // Convert integer part to Spanish words (using neutral apocope 'N')
  let intWords = convertNumberToLetters(integer, { gender: 'N' });

  // Determine " de " connection for exact millions/billions
  let millionConnector = ' ';
  const lowerIntWords = intWords.toLowerCase();
  if (
    integer > 0 &&
    (integer % 1000000 === 0 ||
      lowerIntWords.endsWith('millón') ||
      lowerIntWords.endsWith('millones') ||
      lowerIntWords.endsWith('billón') ||
      lowerIntWords.endsWith('billones'))
  ) {
    millionConnector = ' de ';
  }

  let result = '';

  switch (code) {
    case 'MXN': {
      // México: {integer} pesos XX/100 M.N. (or {integer} de pesos XX/100 M.N.)
      const unit = integer === 1 ? 'peso' : 'pesos';
      result = `${intWords}${millionConnector}${unit} ${decimalStr}/100 M.N.`;
      break;
    }

    case 'COP': {
      // Colombia: {integer} pesos M/CTE (if integer/no decimals) or {integer} pesos XX/100 M/CTE
      const unit = integer === 1 ? 'peso' : 'pesos';
      if (!hasDecimals || decimal === 0) {
        result = `${intWords}${millionConnector}${unit} M/CTE`;
      } else {
        result = `${intWords}${millionConnector}${unit} ${decimalStr}/100 M/CTE`;
      }
      break;
    }

    case 'PEN': {
      // Perú: {integer} y XX/100 soles (or {integer} y XX/100 sol if 1)
      const unit = integer === 1 ? 'sol' : 'soles';
      result = `${intWords} y ${decimalStr}/100 ${unit}`;
      break;
    }

    case 'ARS': {
      // Argentina: {integer} pesos (if no decimals) or {integer} pesos con {centsInWords} centavos
      const unit = integer === 1 ? 'peso' : 'pesos';
      if (!hasDecimals || decimal === 0) {
        result = `${intWords}${millionConnector}${unit}`;
      } else {
        const centWords = convertNumberToLetters(decimal, { gender: 'N' });
        const centUnit = decimal === 1 ? 'centavo' : 'centavos';
        result = `${intWords}${millionConnector}${unit} con ${centWords} ${centUnit}`;
      }
      break;
    }

    case 'EUR': {
      // España: {integer} euros (if no decimals) or {integer} euros con {centsInWords} céntimos
      const unit = integer === 1 ? 'euro' : 'euros';
      if (!hasDecimals || decimal === 0) {
        result = `${intWords}${millionConnector}${unit}`;
      } else {
        const centWords = convertNumberToLetters(decimal, { gender: 'N' });
        const centUnit = decimal === 1 ? 'céntimo' : 'céntimos';
        result = `${intWords}${millionConnector}${unit} con ${centWords} ${centUnit}`;
      }
      break;
    }

    default: {
      const curr = CURRENCY_MAP[code];
      if (curr) {
        result = convertNumberToLetters(amount, {
          currency: curr,
          formatFinancial: true,
          decimalMode: 'fraction'
        });
      } else {
        result = intWords;
      }
      break;
    }
  }

  if (isNegative && result !== 'cero') {
    result = `menos ${result}`;
  }

  result = result.trim();

  if (isUppercase) {
    return result.toUpperCase();
  }

  if (isCapitalize && result.length > 0) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}

/**
 * Returns canonical examples for each country page table.
 * All example strings are generated through the shared formatCountryFinancialAmount engine.
 */
export function getCountryExamples(countryCode: 'MX' | 'CO' | 'PE' | 'AR' | 'ES'): CountryExampleItem[] {
  switch (countryCode) {
    case 'MX':
      return [
        { num: "$100.00", text: formatCountryFinancialAmount("100.00", "MXN") },
        { num: "$500.00", text: formatCountryFinancialAmount("500.00", "MXN") },
        { num: "$1,000.00", text: formatCountryFinancialAmount("1000.00", "MXN"), variant: "o Un mil pesos 00/100 M.N." },
        { num: "$1,500.00", text: formatCountryFinancialAmount("1500.00", "MXN") },
        { num: "$1,540.50", text: formatCountryFinancialAmount("1540.50", "MXN") },
        { num: "$10,000.00", text: formatCountryFinancialAmount("10000.00", "MXN") },
        { num: "$50,000.00", text: formatCountryFinancialAmount("50000.00", "MXN") },
        { num: "$100,000.00", text: formatCountryFinancialAmount("100000.00", "MXN") },
        { num: "$1,000,000.00", text: formatCountryFinancialAmount("1000000.00", "MXN") },
        { num: "$2,345,678.90", text: formatCountryFinancialAmount("2345678.90", "MXN") }
      ];

    case 'CO':
      return [
        { num: "$100 COP", text: formatCountryFinancialAmount("100", "COP") },
        { num: "$1.000 COP", text: formatCountryFinancialAmount("1000", "COP"), variant: "o Un mil pesos M/CTE" },
        { num: "$50.000 COP", text: formatCountryFinancialAmount("50000", "COP") },
        { num: "$100.000 COP", text: formatCountryFinancialAmount("100000", "COP") },
        { num: "$500.000 COP", text: formatCountryFinancialAmount("500000", "COP") },
        { num: "$1.000.000 COP", text: formatCountryFinancialAmount("1000000", "COP") },
        { num: "$1.500.000 COP", text: formatCountryFinancialAmount("1500000", "COP") },
        { num: "$5.000.000 COP", text: formatCountryFinancialAmount("5000000", "COP") },
        { num: "$10.250.000 COP", text: formatCountryFinancialAmount("10250000", "COP") },
        { num: "$1.540,50 COP", text: formatCountryFinancialAmount("1540.50", "COP"), variant: "o con cincuenta centavos M/CTE" }
      ];

    case 'PE':
      return [
        { num: "S/ 100.00", text: formatCountryFinancialAmount("100.00", "PEN") },
        { num: "S/ 500.00", text: formatCountryFinancialAmount("500.00", "PEN") },
        { num: "S/ 1,000.00", text: formatCountryFinancialAmount("1000.00", "PEN"), variant: "o Un mil y 00/100 soles" },
        { num: "S/ 1,500.00", text: formatCountryFinancialAmount("1500.00", "PEN") },
        { num: "S/ 1,540.50", text: formatCountryFinancialAmount("1540.50", "PEN") },
        { num: "S/ 10,000.00", text: formatCountryFinancialAmount("10000.00", "PEN") },
        { num: "S/ 50,000.00", text: formatCountryFinancialAmount("50000.00", "PEN") },
        { num: "S/ 100,000.00", text: formatCountryFinancialAmount("100000.00", "PEN") },
        { num: "S/ 1,000,000.00", text: formatCountryFinancialAmount("1000000.00", "PEN") },
        { num: "S/ 2,450.75", text: formatCountryFinancialAmount("2450.75", "PEN") }
      ];

    case 'AR':
      return [
        { num: "$100,00", text: formatCountryFinancialAmount("100", "ARS") },
        { num: "$500,00", text: formatCountryFinancialAmount("500", "ARS") },
        { num: "$1.000,00", text: formatCountryFinancialAmount("1000", "ARS"), variant: "o Un mil pesos" },
        { num: "$1.500,00", text: formatCountryFinancialAmount("1500", "ARS") },
        { num: "$1.540,50", text: formatCountryFinancialAmount("1540.50", "ARS") },
        { num: "$10.000,00", text: formatCountryFinancialAmount("10000", "ARS") },
        { num: "$50.000,00", text: formatCountryFinancialAmount("50000", "ARS") },
        { num: "$100.000,00", text: formatCountryFinancialAmount("100000", "ARS") },
        { num: "$1.000.000,00", text: formatCountryFinancialAmount("1000000", "ARS") },
        { num: "$5.250.000,75", text: formatCountryFinancialAmount("5250000.75", "ARS") }
      ];

    case 'ES':
      return [
        { num: "100,00 €", text: formatCountryFinancialAmount("100", "EUR") },
        { num: "500,00 €", text: formatCountryFinancialAmount("500", "EUR") },
        { num: "1.000,00 €", text: formatCountryFinancialAmount("1000", "EUR"), variant: "o Un mil euros" },
        { num: "1.500,00 €", text: formatCountryFinancialAmount("1500", "EUR") },
        { num: "1.540,50 €", text: formatCountryFinancialAmount("1540.50", "EUR") },
        { num: "10.000,00 €", text: formatCountryFinancialAmount("10000", "EUR") },
        { num: "50.000,00 €", text: formatCountryFinancialAmount("50000", "EUR") },
        { num: "100.000,00 €", text: formatCountryFinancialAmount("100000", "EUR") },
        { num: "1.000.000,00 €", text: formatCountryFinancialAmount("1000000", "EUR") },
        { num: "2.350.400,25 €", text: formatCountryFinancialAmount("2350400.25", "EUR") }
      ];
  }
}
