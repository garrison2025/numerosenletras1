import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatCountryFinancialAmount, getCountryExamples } from '../src/utils/countryFinancialFormats.js';

describe('Country Specific Financial Formats (P0-5 & P0-6)', () => {
  it('formats MXN (México): 1540.50 contains pesos 50/100 M.N.', () => {
    const res = formatCountryFinancialAmount('1540.50', 'MXN');
    assert.ok(res.includes('pesos 50/100 M.N.'), `Expected to include 'pesos 50/100 M.N.', got: ${res}`);
    assert.strictEqual(res, 'Mil quinientos cuarenta pesos 50/100 M.N.');

    const upper = formatCountryFinancialAmount('1540.50', 'MXN', { uppercase: true });
    assert.strictEqual(upper, 'MIL QUINIENTOS CUARENTA PESOS 50/100 M.N.');

    // 1 million connection
    const million = formatCountryFinancialAmount('1000000.00', 'MXN');
    assert.strictEqual(million, 'Un millón de pesos 00/100 M.N.');
  });

  it('formats COP (Colombia): 1500000 contains pesos M/CTE', () => {
    const res = formatCountryFinancialAmount('1500000', 'COP');
    assert.ok(res.includes('pesos M/CTE'), `Expected to include 'pesos M/CTE', got: ${res}`);
    assert.strictEqual(res, 'Un millón quinientos mil pesos M/CTE');

    const upper = formatCountryFinancialAmount('1500000', 'COP', { uppercase: true });
    assert.strictEqual(upper, 'UN MILLÓN QUINIENTOS MIL PESOS M/CTE');

    // Fractional cents
    const withCents = formatCountryFinancialAmount('1540.50', 'COP');
    assert.ok(withCents.includes('pesos 50/100 M/CTE'), `Expected fractional cents for COP 1540.50, got: ${withCents}`);
  });

  it('formats PEN (Perú): 1540.50 contains y 50/100 soles (or uppercase equivalent)', () => {
    const res = formatCountryFinancialAmount('1540.50', 'PEN');
    assert.ok(res.includes('y 50/100 soles'), `Expected to include 'y 50/100 soles', got: ${res}`);
    assert.strictEqual(res, 'Mil quinientos cuarenta y 50/100 soles');

    const upper = formatCountryFinancialAmount('1540.50', 'PEN', { uppercase: true });
    assert.ok(upper.includes('Y 50/100 SOLES'), `Expected uppercase to include 'Y 50/100 SOLES', got: ${upper}`);
    assert.strictEqual(upper, 'MIL QUINIENTOS CUARENTA Y 50/100 SOLES');

    // 100 soles
    const hundred = formatCountryFinancialAmount('100.00', 'PEN');
    assert.strictEqual(hundred, 'Cien y 00/100 soles');
  });

  it('formats ARS (Argentina): 1540.50 contains pesos con 50/100 or pesos con cincuenta centavos', () => {
    const res = formatCountryFinancialAmount('1540.50', 'ARS');
    const valid = res.includes('pesos con 50/100') || res.includes('pesos con cincuenta centavos');
    assert.ok(valid, `Expected ARS to match, got: ${res}`);
    assert.strictEqual(res, 'Mil quinientos cuarenta pesos con cincuenta centavos');

    // Integer without decimals
    const integerRes = formatCountryFinancialAmount('100', 'ARS');
    assert.strictEqual(integerRes, 'Cien pesos');

    const millionRes = formatCountryFinancialAmount('1000000', 'ARS');
    assert.strictEqual(millionRes, 'Un millón de pesos');
  });

  it('formats EUR (España): 1540.50 contains euros con cincuenta céntimos or euros con 50/100', () => {
    const res = formatCountryFinancialAmount('1540.50', 'EUR');
    const valid = res.includes('euros con cincuenta céntimos') || res.includes('euros con 50/100');
    assert.ok(valid, `Expected EUR to match, got: ${res}`);
    assert.strictEqual(res, 'Mil quinientos cuarenta euros con cincuenta céntimos');

    // Integer without decimals
    const integerRes = formatCountryFinancialAmount('100', 'EUR');
    assert.strictEqual(integerRes, 'Cien euros');

    const upper = formatCountryFinancialAmount('1540.50', 'EUR', { uppercase: true });
    assert.strictEqual(upper, 'MIL QUINIENTOS CUARENTA EUROS CON CINCUENTA CÉNTIMOS');
  });

  it('handles comma-separated decimal inputs for ARS and EUR', () => {
    const resARS = formatCountryFinancialAmount('1540,50', 'ARS');
    assert.strictEqual(resARS, 'Mil quinientos cuarenta pesos con cincuenta centavos');

    const resEUR = formatCountryFinancialAmount('1540,50', 'EUR');
    assert.strictEqual(resEUR, 'Mil quinientos cuarenta euros con cincuenta céntimos');
  });

  it('generates consistent getCountryExamples for all 5 countries', () => {
    const countries = ['MX', 'CO', 'PE', 'AR', 'ES'] as const;
    for (const c of countries) {
      const examples = getCountryExamples(c);
      assert.strictEqual(examples.length, 10, `Expected 10 examples for country ${c}`);
      for (const ex of examples) {
        assert.ok(ex.num && ex.num.length > 0, `Missing num in example: ${JSON.stringify(ex)}`);
        assert.ok(ex.text && ex.text.length > 0, `Missing text in example: ${JSON.stringify(ex)}`);
      }
    }
  });

  it('ensures all 16 currencies have defaultBank as NOMBRE DEL BANCO', async () => {
    const { CURRENCIES } = await import('../src/data/currencies.js');
    assert.strictEqual(CURRENCIES.length, 16, 'Expected 16 currencies');
    for (const curr of CURRENCIES) {
      assert.strictEqual(curr.defaultBank, 'NOMBRE DEL BANCO', `Currency ${curr.code} defaultBank is not NOMBRE DEL BANCO`);
    }
  });
});
