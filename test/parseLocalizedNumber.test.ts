import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseLocalizedNumber, formatNormalizedNumber } from '../src/utils/parseLocalizedNumber.js';

describe('locale-aware monetary and cardinal input', () => {
  it('parses valid Latin American and Spanish styles without changing value', () => {
    assert.equal(parseLocalizedNumber('1,234.56', 'LA').normalized, '1234.56');
    assert.equal(parseLocalizedNumber('1.234,56', 'ES').normalized, '1234.56');
    assert.equal(parseLocalizedNumber('1540,50', 'ES', 2).normalized, '1540.50');
    assert.equal(parseLocalizedNumber('-0,01', 'ES', 2).normalized, '-0.01');
  });

  it('rejects wrong decimal separators and invalid groupings', () => {
    for (const input of ['12,34.56', '1,,234', '1.2.3', '12 345', '1e21', 'Infinity']) {
      assert.throws(() => parseLocalizedNumber(input, 'LA'));
    }
    assert.throws(() => parseLocalizedNumber('1.23,45', 'ES'));
    assert.throws(() => parseLocalizedNumber('123,456', 'ES', 2), /más de dos decimales/);
  });

  it('rejects fractional truncation and integers beyond supported scale', () => {
    assert.throws(() => parseLocalizedNumber('123.999', 'LA', 2), /más de dos decimales/);
    assert.throws(() => parseLocalizedNumber('1000000000000000', 'LA'));
    assert.throws(() => parseLocalizedNumber(Infinity));
  });

  it('formats normalized values for the selected locale without changing amounts', () => {
    assert.equal(formatNormalizedNumber('1234.56', 'LA'), '1,234.56');
    assert.equal(formatNormalizedNumber('1234.56', 'ES'), '1.234,56');
    assert.equal(formatNormalizedNumber('100.00', 'ES'), '100,00');
    assert.equal(formatNormalizedNumber('-1540.50', 'ES'), '-1.540,50');
    const normalized = parseLocalizedNumber(formatNormalizedNumber('100.00', 'ES'), 'ES', 2).normalized;
    assert.equal(normalized, '100.00');
  });
});

describe('exact decimal quick operations', () => {
  it('avoids binary floating-point precision loss', async () => {
    const { calculateExactDecimal } = await import('../src/utils/parseLocalizedNumber.js');
    assert.equal(calculateExactDecimal('1234.56', 'add', 1), '1235.56');
    assert.equal(calculateExactDecimal('0.10', 'add', 1), '1.1');
    assert.equal(calculateExactDecimal('999999999999999.99', 'multiply', 0.5), '499999999999999.995');
    assert.equal(calculateExactDecimal('1.25', 'multiply', 2), '2.5');
  });
  it('rejects overflow rather than silently corrupting large results', async () => {
    const { calculateExactDecimal } = await import('../src/utils/parseLocalizedNumber.js');
    assert.throws(() => calculateExactDecimal('999999999999999', 'add', 1), /15 cifras/);
  });
});

describe('flexible parser used by the spelling guide', () => {
  it('accepts explicit LA and ES decimal forms', async () => {
    const { parseFlexibleNumber } = await import('../src/utils/parseLocalizedNumber.js');
    assert.equal(parseFlexibleNumber('1,234.56').normalized, '1234.56');
    assert.equal(parseFlexibleNumber('1.234,56').normalized, '1234.56');
  });
  it('rejects malformed values instead of parseFloat prefix truncation', async () => {
    const { parseFlexibleNumber } = await import('../src/utils/parseLocalizedNumber.js');
    for (const input of ['1.2.3', '12,34.56', '123abc', '1e9']) {
      assert.throws(() => parseFlexibleNumber(input));
    }
  });
});
