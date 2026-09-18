import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convertNumberToLetters } from '../src/utils/numberToLetters.js';
import { CURRENCIES, CURRENCY_MAP } from '../src/data/currencies.js';

describe('convertNumberToLetters - Cardinal numbers without currency', () => {
  it('handles 0', () => {
    assert.strictEqual(convertNumberToLetters(0), 'cero');
    assert.strictEqual(convertNumberToLetters('0'), 'cero');
  });

  it('handles 1', () => {
    assert.strictEqual(convertNumberToLetters(1), 'uno');
    assert.strictEqual(convertNumberToLetters(1, { gender: 'F' }), 'una');
    assert.strictEqual(convertNumberToLetters(1, { gender: 'N' }), 'un');
  });

  it('handles numbers with accents (16, 21, 22, 23, 26)', () => {
    assert.strictEqual(convertNumberToLetters(16), 'dieciséis');
    assert.strictEqual(convertNumberToLetters(21), 'veintiuno');
    assert.strictEqual(convertNumberToLetters(21, { gender: 'F' }), 'veintiuna');
    assert.strictEqual(convertNumberToLetters(21, { gender: 'N' }), 'veintiún');
    assert.strictEqual(convertNumberToLetters(22), 'veintidós');
    assert.strictEqual(convertNumberToLetters(23), 'veintitrés');
    assert.strictEqual(convertNumberToLetters(26), 'veintiséis');
  });

  it('handles 31 and tens separation with y', () => {
    assert.strictEqual(convertNumberToLetters(31), 'treinta y uno');
    assert.strictEqual(convertNumberToLetters(31, { gender: 'F' }), 'treinta y una');
    assert.strictEqual(convertNumberToLetters(31, { gender: 'N' }), 'treinta y un');
  });

  it('handles 100, 101, 121', () => {
    assert.strictEqual(convertNumberToLetters(100), 'cien');
    assert.strictEqual(convertNumberToLetters(101), 'ciento uno');
    assert.strictEqual(convertNumberToLetters(121), 'ciento veintiuno');
    assert.strictEqual(convertNumberToLetters(121, { gender: 'N' }), 'ciento veintiún');
  });

  it('handles 500 (quinientos) and 999', () => {
    assert.strictEqual(convertNumberToLetters(500), 'quinientos');
    assert.strictEqual(convertNumberToLetters(500, { gender: 'F' }), 'quinientas');
    assert.strictEqual(convertNumberToLetters(999), 'novecientos noventa y nueve');
  });

  it('handles thousands (1000 is mil, not un mil)', () => {
    assert.strictEqual(convertNumberToLetters(1000), 'mil');
    assert.strictEqual(convertNumberToLetters(1001), 'mil uno');
    assert.strictEqual(convertNumberToLetters(21000), 'veintiún mil');
    assert.strictEqual(convertNumberToLetters(100000), 'cien mil');
  });

  it('handles millions (un millón vs millones, with de when exact)', () => {
    assert.strictEqual(convertNumberToLetters(1000000), 'un millón');
    assert.strictEqual(convertNumberToLetters(1000001), 'un millón uno');
    assert.strictEqual(convertNumberToLetters(2000000), 'dos millones');
  });

  it('handles negative numbers', () => {
    assert.strictEqual(convertNumberToLetters(-5), 'menos cinco');
    assert.strictEqual(convertNumberToLetters(-100), 'menos cien');
  });

  it('handles decimal numbers without currency', () => {
    assert.strictEqual(convertNumberToLetters(0.5), 'cero punto cinco');
    assert.strictEqual(convertNumberToLetters(1.01), 'uno punto cero uno');
    assert.strictEqual(convertNumberToLetters(100.25), 'cien punto veinticinco');
  });
});

describe('convertNumberToLetters - All 16 Supported Currencies', () => {
  it('contains exactly 16 supported currencies in CURRENCIES list', () => {
    assert.strictEqual(CURRENCIES.length, 16);
    const expectedCodes = [
      'MXN', 'USD', 'EUR', 'COP', 'PEN', 'ARS',
      'CLP', 'VES', 'BOB', 'GTQ', 'CRC', 'HNL',
      'NIO', 'PYG', 'UYU', 'DOP'
    ];
    for (const code of expectedCodes) {
      assert.ok(CURRENCY_MAP[code], `Missing expected currency ${code}`);
    }
  });

  for (const currency of CURRENCIES) {
    describe(`Currency: ${currency.code} (${currency.name})`, () => {
      const suffix = currency.financialSuffix ? ` ${currency.financialSuffix}` : '';

      it(`formats 1 ${currency.code} with singular noun`, () => {
        const result = convertNumberToLetters(1, { currency });
        assert.strictEqual(result, `un ${currency.singular} 00/100${suffix}`);
        // Never allow "un <plural>"
        assert.ok(!result.includes(`un ${currency.plural}`), `Must not say 'un ${currency.plural}'`);
      });

      it(`formats 2 ${currency.code} with plural noun`, () => {
        const result = convertNumberToLetters(2, { currency });
        assert.strictEqual(result, `dos ${currency.plural} 00/100${suffix}`);
      });

      it(`formats 1.01 ${currency.code} with fraction and words mode`, () => {
        const fractionResult = convertNumberToLetters(1.01, { currency });
        assert.strictEqual(fractionResult, `un ${currency.singular} 01/100${suffix}`);

        const wordsResult = convertNumberToLetters(1.01, { currency, decimalMode: 'words' });
        assert.strictEqual(wordsResult, `un ${currency.singular} con un ${currency.centSingular}${suffix}`);
      });

      it(`formats cents plural correctly (2.02 ${currency.code})`, () => {
        const wordsResult = convertNumberToLetters(2.02, { currency, decimalMode: 'words' });
        assert.strictEqual(wordsResult, `dos ${currency.plural} con dos ${currency.centPlural}${suffix}`);
      });

      it(`formats 1000 ${currency.code} (mil + plural)`, () => {
        const result = convertNumberToLetters(1000, { currency });
        assert.strictEqual(result, `mil ${currency.plural} 00/100${suffix}`);
        assert.ok(!result.startsWith('un mil'), 'Must be mil, not un mil');
      });

      it(`formats 1000000 ${currency.code} with 'de' connection`, () => {
        const result = convertNumberToLetters(1000000, { currency });
        assert.strictEqual(result, `un millón de ${currency.plural} 00/100${suffix}`);
      });
    });
  }
});
