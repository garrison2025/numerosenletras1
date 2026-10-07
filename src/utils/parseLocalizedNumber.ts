/**
 * Shared locale-aware number parser used by every interactive converter.
 * Never guess malformed grouping or silently discard fractional digits.
 * 15 integer digits are supported by the Spanish long-scale word engine.
 */
export type NumberFormatStyle = 'LA' | 'ES';
export const MAX_INTEGER_DIGITS = 15;
export const MAX_DECIMAL_DIGITS = 12;

export interface ParsedLocalizedNumber {
  normalized: string;
  integerDigits: string;
  fractionDigits: string;
  negative: boolean;
}

export function parseLocalizedNumber(
  input: string | number,
  style: NumberFormatStyle = 'LA',
  maxDecimalDigits = MAX_DECIMAL_DIGITS
): ParsedLocalizedNumber {
  if (typeof input === 'number' && !Number.isFinite(input)) {
    throw new RangeError('El número debe ser finito.');
  }
  if (!Number.isInteger(maxDecimalDigits) || maxDecimalDigits < 0 || maxDecimalDigits > MAX_DECIMAL_DIGITS) {
    throw new RangeError('Precisión decimal no admitida.');
  }

  const raw = String(input).trim();
  if (!raw || raw === '-' || raw === '+') {
    throw new RangeError('Introduce un número.');
  }
  if (/[eE\s]/.test(raw)) {
    throw new RangeError('Usa cifras completas, sin exponentes ni espacios.');
  }

  const negative = raw.startsWith('-');
  const unsigned = negative || raw.startsWith('+') ? raw.slice(1) : raw;
  const groupSeparator = style === 'ES' ? '.' : ',';
  const decimalSeparator = style === 'ES' ? ',' : '.';
  const split = unsigned.split(decimalSeparator);
  if (split.length > 2 || !split[0] || (split.length === 2 && !split[1])) {
    throw new RangeError('Formato numérico no válido.');
  }

  const rawInteger = split[0];
  const plainInteger = /^\d+$/.test(rawInteger);
  const groupedInteger = style === 'ES'
    ? /^\d{1,3}(?:\.\d{3})+$/.test(rawInteger)
    : /^\d{1,3}(?:,\d{3})+$/.test(rawInteger);
  if (!plainInteger && !groupedInteger) {
    throw new RangeError('Separadores de miles incorrectos.');
  }
  const integerDigits = rawInteger.split(groupSeparator).join('').replace(/^0+(?=\d)/, '');
  if (integerDigits.length > MAX_INTEGER_DIGITS) {
    throw new RangeError('Máximo 15 cifras enteras (hasta 999 billones).');
  }

  const fractionDigits = split[1] ?? '';
  if (fractionDigits && !/^\d+$/.test(fractionDigits)) {
    throw new RangeError('La parte decimal debe contener solo cifras.');
  }
  if (fractionDigits.length > maxDecimalDigits) {
    throw new RangeError(maxDecimalDigits === 2
      ? 'Importe con más de dos decimales: corrígelo antes de convertir.'
      : `Máximo ${maxDecimalDigits} decimales.`);
  }

  const nonzero = /[1-9]/.test(integerDigits + fractionDigits);
  const prefix = negative && nonzero ? '-' : '';
  return {
    normalized: `${prefix}${integerDigits}${fractionDigits ? '.' + fractionDigits : ''}`,
    integerDigits,
    fractionDigits,
    negative: negative && nonzero
  };
}

/** Explicit grouping/decimal display; never changes the underlying value. */
export function formatNormalizedNumber(normalized: string, style: NumberFormatStyle): string {
  const parsed = parseLocalizedNumber(normalized, 'LA');
  const groups = parsed.integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, style === 'ES' ? '.' : ',');
  return `${parsed.negative ? '-' : ''}${groups}${parsed.fractionDigits ? (style === 'ES' ? ',' : '.') + parsed.fractionDigits : ''}`;
}

/**
 * API convenience: both 1,234.56 and 1.234,56 are accepted when the
 * decimal separator is unambiguous. For a single comma, treat it as decimal.
 * UI must always use parseLocalizedNumber with an explicit selected style.
 */
export function parseFlexibleNumber(
  input: string | number,
  maxDecimalDigits = MAX_DECIMAL_DIGITS
): ParsedLocalizedNumber {
  const raw = String(input).trim();
  const comma = raw.lastIndexOf(',');
  const dot = raw.lastIndexOf('.');
  const style: NumberFormatStyle = comma >= 0 && (dot < 0 || comma > dot) ? 'ES' : 'LA';
  return parseLocalizedNumber(input, style, maxDecimalDigits);
}

/**
 * Exact quick-action arithmetic. Using BigInt scaled integers avoids floating
 * point rounding even for 15-digit values and high fractional precision.
 */
export function calculateExactDecimal(
  normalized: string,
  operation: 'add' | 'multiply',
  operand: number
): string {
  const parsed = parseLocalizedNumber(normalized, 'LA');
  let decimals = parsed.fractionDigits.length;
  let scaled = BigInt(parsed.integerDigits + parsed.fractionDigits);
  if (parsed.negative) scaled = -scaled;

  if (operation === 'add') {
    if (!Number.isSafeInteger(operand)) throw new RangeError('Incremento no válido.');
    scaled += BigInt(operand) * 10n ** BigInt(decimals);
  } else if (operand === 2) {
    scaled *= 2n;
  } else if (operand === 0.5) {
    if (decimals === MAX_DECIMAL_DIGITS) {
      throw new RangeError('La división requiere un decimal adicional.');
    }
    scaled *= 5n;
    decimals++;
  } else {
    throw new RangeError('Operación no admitida.');
  }

  const minus = scaled < 0n ? '-' : '';
  const digits = (scaled < 0n ? -scaled : scaled).toString().padStart(decimals + 1, '0');
  const intDigits = decimals ? digits.slice(0, -decimals) : digits;
  const fracDigits = decimals ? digits.slice(-decimals).replace(/0+$/, '') : '';
  const output = `${minus}${intDigits}${fracDigits ? '.' + fracDigits : ''}`;
  return parseLocalizedNumber(output, 'LA').normalized;
}
